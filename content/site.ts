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

export const otherOfferings = [
  { title: "קבוצת ערב", detail: "ימי שני, 19:00" },
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
 * שתי הקבוצות שאפשר להירשם אליהן בטופס.
 * רביעי נגזר מ-morningGroup כדי לא לשכפל אותו.
 *
 * ⚠️ חסר לקבוצת הערב: תאריך פתיחה, מספר מפגשים, מחיר ומשך המפגש.
 * כל עוד הם null, הטופס והמייל פשוט משמיטים את השורות האלה
 * במקום להמציא ערכים. צריך למלא מול נטע לפני שהקבוצה משווקת.
 *
 * ⚠️ קבוצת הערב מתוארת גם ב-otherOfferings כטקסט חופשי.
 * שווה לאחד את שני המקומות בהמשך.
 */
export const registrationGroups = [
  {
    slug: morningGroup.slug,
    title: morningGroup.title,
    dayLabel: morningGroup.dayLabel,
    timeLabel: morningGroup.timeLabel,
    durationLabel: morningGroup.durationLabel as string | null,
    startDateLabel: morningGroup.startDateLabel as string | null,
    sessions: morningGroup.sessions as number | null,
    priceLabel: morningGroup.priceLabel as string | null,
    paymentNote: morningGroup.paymentNote,
    capacity: morningGroup.capacity,
    highlight: false,
  },
  {
    slug: "evening-monday",
    title: "קבוצת ערב",
    dayLabel: "יום שני",
    timeLabel: "19:00",
    durationLabel: null as string | null,
    startDateLabel: null as string | null,
    sessions: null as number | null,
    priceLabel: null as string | null,
    paymentNote: morningGroup.paymentNote,
    capacity: studio.roomCapacity,
    highlight: true,
  },
] as const;

export type RegistrationGroupSlug =
  (typeof registrationGroups)[number]["slug"];

export function findRegistrationGroup(slug: string) {
  return registrationGroups.find((g) => g.slug === slug) ?? null;
}

/** מגבלת קיבולת קשיחה. מקור האמת בזמן ריצה הוא מסד הנתונים. */
export const CAPACITY = morningGroup.capacity;
