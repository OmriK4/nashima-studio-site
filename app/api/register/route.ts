import { NextResponse } from "next/server";
import { registrationSchema } from "@/lib/schema";
import { normalizeIsraeliMobile } from "@/lib/phone";
import { findRegistrationGroup, studio, practicalInfo, contact } from "@/content/site";

// שליחה מהירה מזה נחשבת חשודה — בן אדם לא ממלא טופס תוך פחות משנייה
const MIN_FILL_TIME_MS = 1200;

// כל הרשמה שעוברת כאן כותבת שורה בגיליון ושולחת שני מיילים אמיתיים.
// לכן יש תקרה לכמה פעמים אותה כתובת IP יכולה להצליח בחלון זמן.
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;

/**
 * מונה בזיכרון התהליך. ב-Vercel כל instance סופר לעצמו והמונה מתאפס
 * בהתעוררות קרה, ולכן זו האטה של התפרצות ולא מכסה קשיחה. עבור עסק
 * בהיקף הזה זה מספיק, ואין צורך להכניס Redis רק בשביל טופס אחד.
 */
const hits = new Map<string, number[]>();

function rateLimited(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);

  // ניקוי מפתחות ישנים, כדי שהמפה לא תגדל בלי גבול לאורך חיי ה-instance
  if (hits.size > 500) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(k);
    }
  }
  return false;
}

/**
 * הטופס באתר הוא הצרכן היחיד של נקודת הקצה הזו, והדפדפן תמיד שולח
 * Origin ב-POST. דרישה שה-Origin יתאים ל-Host חוסמת סקריפטים חיצוניים
 * וטפסים באתרים אחרים, בלי לקבע דומיין בקוד.
 */
function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/**
 * המקום היחיד שמכיר את כתובת ה-webhook של n8n והסוד המשותף איתו.
 * נשארים צד-שרת בלבד ולא מגיעים ללקוח, כדי שאף אחד לא יוכל
 * להפציץ את ה-webhook ישירות בעקיפת האתר.
 *
 * n8n הוא גם שכבת ההתמדה: הוא כותב את הליד ל-Google Sheet ומחליט
 * confirmed/waitlist לפי מה שכבר רשום שם. אין כאן ואין לנו מסד נתונים משלנו.
 */
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;
const N8N_WEBHOOK_SECRET = process.env.N8N_WEBHOOK_SECRET;

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return NextResponse.json(
      { ok: false, error: "בקשה לא תקינה." },
      { status: 403 },
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "נשלחו יותר מדי בקשות. אפשר לנסות שוב בעוד כמה דקות." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "בקשה לא תקינה." },
      { status: 400 },
    );
  }

  const parsed = registrationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "הפרטים שהוזנו אינם תקינים." },
      { status: 400 },
    );
  }

  const { honeypot, startedAt } = parsed.data;

  // בוט: שדה המלכודת מולא, או שהטופס "נשלח" מהר מדי מכדי שאדם מילא אותו
  if (honeypot || Date.now() - startedAt < MIN_FILL_TIME_MS) {
    // תשובת הצלחה מזויפת — לא חושפים לבוט שזוהה
    return NextResponse.json({ ok: true, status: "confirmed" });
  }

  const phoneE164 = normalizeIsraeliMobile(parsed.data.phone);
  if (!phoneE164) {
    return NextResponse.json(
      { ok: false, error: "מספר הטלפון אינו תקין." },
      { status: 400 },
    );
  }

  // הסכמה כבר אימתה שה-slug הוא אחת הקבוצות הקיימות
  const group = findRegistrationGroup(parsed.data.group);
  if (!group) {
    return NextResponse.json(
      { ok: false, error: "הקבוצה שנבחרה אינה קיימת." },
      { status: 400 },
    );
  }

  /**
   * כל מה שה-workflow צריך כדי לבנות מייל אישור/המתנה מלא,
   * בלי לשכפל את פרטי העסק בתוך n8n. מקור האמת נשאר content/site.ts.
   *
   * שדה שאין לו ערך נשלח כמחרוזת ריקה, ו-n8n משמיט את השורה שלו
   * מהמייל — כדי שלא יישלח ללקוחה תאריך או מחיר שלא קיימים.
   */
  const lead = {
    fullName: parsed.data.fullName,
    phone: phoneE164,
    email: parsed.data.email,
    firstTime: parsed.data.firstTime,
    medicalAck: parsed.data.medicalAck,

    groupSlug: group.slug,
    groupTitle: group.title,
    groupDay: group.dayLabel,
    groupTime: group.timeLabel,
    groupDescription: group.description,
    groupCapacity: group.capacity,
    groupDuration: group.durationLabel ?? "",
    groupStart: group.startDateLabel ?? "",
    groupSessions: group.sessions ?? "",
    groupPrice: group.priceLabel ?? "",
    groupPayment: group.paymentNote,

    studioStreet: studio.street,
    studioCity: studio.city,
    studioFloor: studio.floor,
    studioElevator: studio.hasElevator,

    whatToBring: practicalInfo.whatToBring.join(" ו"),
    providedOnSite: practicalInfo.providedOnSite,
    medicalNote: practicalInfo.medicalNote,
    contactPhone: contact.phone,
  };

  if (!N8N_WEBHOOK_URL) {
    /**
     * אין webhook מוגדר — הליד לא ייכתב בשום מקום.
     * מחזירים כשל מפורש ולא "הצלחה": הסוכנת קוראת לנקודת הקצה הזו
     * כדי לרשום אנשים, ותשובת הצלחה מזויפת הייתה גורמת לה להבטיח
     * מקום שלא נשמר.
     */
    console.error(
      "[register] N8N_WEBHOOK_URL אינו מוגדר — ההרשמה נדחתה ולא נשמרה.",
    );
    return NextResponse.json(
      { ok: false, error: "ההרשמה אינה זמינה כרגע. אפשר לנסות שוב בהמשך." },
      { status: 503 },
    );
  }

  try {
    const n8nRes = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(N8N_WEBHOOK_SECRET
          ? { "x-webhook-secret": N8N_WEBHOOK_SECRET }
          : {}),
      },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(8000),
    });

    if (!n8nRes.ok) {
      throw new Error(`n8n responded with ${n8nRes.status}`);
    }

    const data = (await n8nRes.json()) as { status?: "confirmed" | "waitlist" };
    return NextResponse.json({
      ok: true,
      status: data.status ?? "confirmed",
    });
  } catch (err) {
    console.error("[register] כשל בהעברת הליד ל-n8n:", err);
    return NextResponse.json(
      { ok: false, error: "אירעה תקלה זמנית. נסו שוב בעוד רגע." },
      { status: 502 },
    );
  }
}
