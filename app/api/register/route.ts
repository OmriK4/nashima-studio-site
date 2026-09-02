import { NextResponse } from "next/server";
import { registrationSchema } from "@/lib/schema";
import { normalizeIsraeliMobile } from "@/lib/phone";
import { sameOrigin, clientKey, createRateLimiter } from "@/lib/http";
import { findRegistrationGroup, studio, practicalInfo, contact } from "@/content/site";

// ה-workflow קורא Sheet, כותב שורה ושולח שני מיילים לפני שהוא עונה —
// נמדד בפועל סביב 7-8 שניות, ולפעמים יותר. maxDuration מרים את תקרת
// זמן הריצה של הפונקציה ב-Vercel, ו-AbortSignal נותן לה מרווח נשימה
// אמיתי לפני שהדפדפן מוותר ומציג "תקלה זמנית" על הרשמה שבפועל הצליחה.
export const maxDuration = 30;

// מילוי מהיר מזה חשוד, אבל אינו ראיה. ראו את ההערה ב-POST.
const MIN_FILL_TIME_MS = 1200;

// כל הרשמה שעוברת כאן כותבת שורה בגיליון ושולחת שני מיילים אמיתיים.
// לכן יש תקרה לכמה פעמים אותה כתובת IP יכולה להצליח בחלון זמן.
const isRateLimited = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 5,
});

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

  if (isRateLimited(clientKey(request))) {
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

  /**
   * מלכודת הבוטים היא הסימן היחיד שמצדיק השלכת פנייה: השדה מוסתר
   * מבני אדם, ולכן אדם לעולם לא ממלא אותו. תשובת ההצלחה מזויפת בכוונה,
   * כדי לא לחשוף לבוט שזוהה.
   */
  if (honeypot) {
    return NextResponse.json({ ok: true, status: "confirmed" });
  }

  /**
   * מהירות המילוי נמדדת מול startedAt שמגיע מהשעון של הדפדפן, ולכן
   * היא **לא** ראיה: שעון לקוח שמקדים את השרת מקצר את ההפרש, ומילוי
   * אוטומטי לגיטימי יכול לרדת מתחת לסף. קודם לכן מקרה כזה קיבל את
   * אותה תשובת הצלחה מזויפת — כלומר לקוחה אמיתית ראתה "ההרשמה נקלטה"
   * בזמן ששום שורה לא נכתבה ושום מייל לא נשלח.
   * לכן הסף נשאר כסימן לתיעוד בלבד, וההרשמה ממשיכה כרגיל.
   */
  const elapsed = Date.now() - startedAt;
  if (elapsed < MIN_FILL_TIME_MS) {
    console.warn(
      `[register] טופס נשלח מהר מהצפוי (${elapsed}ms) — ממשיכים בכל זאת כדי לא לאבד ליד אמיתי.`,
    );
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
      signal: AbortSignal.timeout(25000),
    });

    if (!n8nRes.ok) {
      throw new Error(`n8n responded with ${n8nRes.status}`);
    }

    /**
     * מעבירים רק סטטוס שהוכר במפורש. קודם לכן ערך חסר תורגם ל-"confirmed",
     * כלומר מי שנכנסה לרשימת המתנה הייתה עלולה לקבל אישור מקום.
     * "unknown" אומר שהשורה נכתבה אבל הסטטוס לא ידוע לנו — והמסך
     * מציג במקרה כזה את האישור הנייטרלי, בלי להבטיח מקום שלא אושר.
     */
    const data = (await n8nRes.json()) as { status?: unknown };
    const status =
      data.status === "confirmed" || data.status === "waitlist"
        ? data.status
        : "unknown";

    return NextResponse.json({ ok: true, status });
  } catch (err) {
    console.error("[register] כשל בהעברת הליד ל-n8n:", err);
    return NextResponse.json(
      { ok: false, error: "אירעה תקלה זמנית. נסו שוב בעוד רגע." },
      { status: 502 },
    );
  }
}
