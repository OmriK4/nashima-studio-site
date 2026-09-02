import { sameOrigin, clientKey, createRateLimiter } from "@/lib/http";

/**
 * פרוקסי דק בין הווידג'ט לסוכנת "נשימה כאן" ב-n8n.
 *
 * הדפדפן קורא לנתיב הזה באותו מקור כמו האתר עצמו, ולא ל-n8n ישירות.
 * זה פותר בעיה שחוזרת על עצמה: allowedOrigins ב-n8n היא רשימה סגורה
 * של דומיינים, וכל כתובת דיפלוימנט חדשה של Vercel (עם hash אקראי)
 * נכשלת בה עד שמישהו זוכר לעדכן את n8n ידנית. בקשת שרת-לשרת אינה
 * כפופה ל-CORS בכלל — כך שהבעיה נעלמת לחלוטין, על כל כתובת, בלי
 * תלות בעדכון ב-n8n בכל דיפלוי.
 */
const CHAT_WEBHOOK_URL =
  "https://omrik.app.n8n.cloud/webhook/a0339a6c-32e4-4dd9-a95a-e5ab1fe8af66/chat";

// קצר מ-TIMEOUT_MS של הווידג'ט (120 שניות ב-NashimaAgent.tsx) בכוונה,
// כדי שהשרת יוותר ראשון ויחזיר שגיאה מסודרת במקום שהלקוח ינתק באוויר.
export const maxDuration = 60;
const UPSTREAM_TIMEOUT_MS = 55000;

const MAX_INPUT_CHARS = 4000;
const MAX_SESSION_ID = 128;

/**
 * כל הודעה כאן מפעילה מודל שפה בתשלום. sameOrigin חוסם דפדפנים באתרים
 * אחרים אבל לא לקוח אוטומטי שמזייף Origin, ולכן התקרה הזו היא ההגנה
 * האמיתית מפני שריפת תקציב. הסף רחב מספיק לשיחה אנושית ארוכה.
 */
const isRateLimited = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 40,
});

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return Response.json(
      { ok: false, error: "בקשה לא תקינה." },
      { status: 403 },
    );
  }

  if (isRateLimited(clientKey(request))) {
    return Response.json(
      { ok: false, error: "נשלחו יותר מדי הודעות. אפשר לנסות שוב בעוד כמה דקות." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { ok: false, error: "בקשה לא תקינה." },
      { status: 400 },
    );
  }

  const { sessionId, chatInput } = (body ?? {}) as {
    sessionId?: unknown;
    chatInput?: unknown;
  };

  if (typeof chatInput !== "string" || !chatInput.trim()) {
    return Response.json({ ok: false, error: "חסרה הודעה." }, { status: 400 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(CHAT_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "sendMessage",
        sessionId:
          typeof sessionId === "string" ? sessionId.slice(0, MAX_SESSION_ID) : "",
        chatInput: chatInput.slice(0, MAX_INPUT_CHARS),
        source: "nashima-website-chat",
      }),
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
  } catch (err) {
    console.error("[chat] כשל בפנייה לסוכנת ב-n8n:", err);
    return Response.json(
      { ok: false, error: "לא הצלחנו להתחבר לעוזרת." },
      { status: 502 },
    );
  }

  if (!upstream.ok || !upstream.body) {
    return Response.json(
      { ok: false, error: "העוזרת לא הגיבה." },
      { status: 502 },
    );
  }

  // מעביר את זרם ה-NDJSON כמות שהוא, טוקן-טוקן, בלי לחכות לסיום התשובה
  return new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
