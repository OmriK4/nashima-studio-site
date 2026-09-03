/**
 * מקור האמת היחיד לפרטי העסק.
 * שינוי תאריך / מחיר / טלפון נעשה כאן בלבד.
 */

export const studio = {
  name: "נשימה",
  instructor: "נועה שגב",
  city: "רמת גן",
  street: "ביאליק 1",
  floor: "קומה ראשונה",
  hasElevator: true,
  activeSince: 2021,
  roomCapacity: 8,
} as const;

// פרטי הקשר נלקחים מקובץ מקור האמת של העסק ("האלוהים של הידע"),
// שגובר על כל מקור אחר. הוא מוסר טלפון 050-000-0000 ואימייל
// komritlv@gmail.com — ולכן אלה הערכים כאן.
export const contact = {
  phone: "050-000-0000",
  phoneE164: "+972500000000",
  email: "komritlv@gmail.com",
  whatsapp: "+972500000000",
} as const;

export const morningGroup = {
  slug: "morning-wednesday",
  title: "קבוצת בוקר חדשה",
  discipline: "פילאטיס מזרן",
  level: "מתחילים",
  dayLabel: "יום רביעי",
  timeLabel: "07:30",
  durationLabel: "שעה",
  startDate: "2026-10-21",
  startDateLabel: "21 באוקטובר 2026",
  endDateLabel: "9 בדצמבר 2026",
  sessions: 8,
  // גודל הקבוצה הוא גודל החדר — מקור אחד, כדי ששינוי של אחד לא ישאיר
  // את השני מאחור ויסתור את מה שכתוב בדף.
  capacity: studio.roomCapacity,
  price: 640,
  priceLabel: "640 ₪",
  paymentNote: "התשלום מתבצע בסטודיו",
} as const;

/**
 * רק מה שאין לו הרשמה דרך האתר. קבוצת הערב לא כאן — יש לה הרשמה
 * דרך הטופס, והיום/השעה שלה מגיעים מ-registrationGroups בלבד,
 * כדי שלא יהיו שני מקורות אמת לאותו פרט.
 */
export const otherOfferings = [
  { title: "אימונים אישיים", detail: "בתיאום מראש" },
] as const;

export const practicalInfo = {
  whatToBring: ["בגדים נוחים", "גרביים"],
  providedOnSite: "מזרנים וציוד נמצאים במקום",
  medicalNote:
    "מי שאחרי ניתוח או פציעה מתבקש להביא אישור רופא.",
  beginnerNote: "אין צורך בניסיון קודם, ומתאים גם למי שלא התאמן במשך שנים.",
} as const;

/**
 * מקור האמת היחיד למיפוי הקבוצות.
 * זה המקום שממנו נגזרים גם הבורר בטופס, גם מסך האישור,
 * גם ה-payload ל-n8n וגם המיילים. n8n לא מחזיק מיפוי משלו.
 *
 * רביעי נגזר מ-morningGroup כדי לא לשכפל אותו.
 *
 * לקבוצת הערב אין תאריך פתיחה בכוונה — היא כבר רצה ברצף שבועי,
 * לא קבוצה עתידית עם תאריך התחלה. שדה null פשוט לא מוצג.
 * מפגש אינו מתקיים ביום שני שאינו יום עבודה רגיל (חג, ערב חג,
 * חול המועד או יום זיכרון) — הדילוג עצמו נעשה ב-n8n, בתזכורות.
 * המחיר זהה לרביעי (640 ₪, נמכר בחבילות של 8 מפגשים) — אושר מול נועה.
 */
export const registrationGroups = [
  {
    slug: morningGroup.slug,
    title: morningGroup.title,
    dayLabel: morningGroup.dayLabel,
    timeLabel: morningGroup.timeLabel,
    description: "הקבוצה החדשה והלוהטת 🔥",
    durationLabel: morningGroup.durationLabel as string | null,
    startDateLabel: morningGroup.startDateLabel as string | null,
    sessions: morningGroup.sessions as number | null,
    priceLabel: morningGroup.priceLabel as string | null,
    paymentNote: morningGroup.paymentNote,
    capacity: morningGroup.capacity,
    // ההדגשה בטופס יושבת על הקבוצה החדשה — אותה קבוצה שהמייל מתאר
    // כ"החדשה והלוהטת", כדי שהאתר והמייל לא יסמנו קבוצות שונות.
    highlight: true,
  },
  {
    slug: "evening-monday",
    title: "קבוצת ערב",
    dayLabel: "יום שני",
    timeLabel: "19:00",
    description: "קבוצה קבועה המתקיימת בכל יום שני שהוא יום עבודה רגיל",
    durationLabel: "שעה" as string | null,
    // אין תאריך פתיחה בכוונה — קבוצה שבועית שרצה ברצף
    startDateLabel: null as string | null,
    // אותה חבילה בדיוק כמו רביעי — נגזר ולא משוכפל, כדי ששינוי מחיר
    // ייעשה במקום אחד. אם התמחור של הקבוצות ייפרד בעתיד, כאן מפרידים.
    sessions: morningGroup.sessions as number | null,
    priceLabel: morningGroup.priceLabel as string | null,
    paymentNote: morningGroup.paymentNote,
    capacity: studio.roomCapacity,
    highlight: false,
  },
] as const;

export type RegistrationGroupSlug =
  (typeof registrationGroups)[number]["slug"];

export function findRegistrationGroup(slug: string) {
  return registrationGroups.find((g) => g.slug === slug) ?? null;
}

/** לתצוגה מחוץ לטופס (כמו רשימת השיעורים) — אותו מקור, בלי לשכפל. */
export const eveningGroup = registrationGroups[1];
