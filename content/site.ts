/**
 * מקור האמת היחיד לפרטי העסק.
 * שינוי תאריך / מחיר / טלפון נעשה כאן בלבד.
 */

export const studio = {
  name: "נשימה",
  instructor: "נטע שגיב",
  city: "רמת גן",
  street: "ביאליק",
  floor: "קומה שנייה",
  hasElevator: true,
  activeSince: 2021,
  roomCapacity: 8,
} as const;

/** TODO: פרטים זמניים — חובה להחליף לפני עלייה לאוויר */
export const contact = {
  phone: "052-000-0000",
  phoneE164: "+972520000000",
  email: "noa@example.co.il",
  whatsapp: "+972520000000",
  isPlaceholder: true,
} as const;

export const morningGroup = {
  slug: "morning-wednesday",
  title: "קבוצת בוקר חדשה",
  discipline: "פילאטיס מזרן",
  level: "מתחילים",
  dayLabel: "יום רביעי",
  timeLabel: "07:30",
  durationLabel: "שעה",
  startDate: "2026-10-14",
  startDateLabel: "14 באוקטובר 2026",
  endDateLabel: "2 בדצמבר 2026",
  sessions: 8,
  capacity: 8,
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
 * המחיר זהה לרביעי (640 ₪, נמכר בחבילות של 8 מפגשים) — אושר מול נטע.
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
    description: "קבוצה קבועה המתקיימת מדי שבוע",
    durationLabel: "שעה" as string | null,
    // אין תאריך פתיחה בכוונה — קבוצה שבועית שרצה ברצף
    startDateLabel: null as string | null,
    sessions: 8 as number | null,
    priceLabel: "640 ₪" as string | null,
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

/** מגבלת קיבולת קשיחה. מקור האמת בזמן ריצה הוא מסד הנתונים. */
export const CAPACITY = morningGroup.capacity;
