/**
 * מספרי נייד ישראליים בלבד — הקידומות הנפוצות אצל אנשים פרטיים.
 * הטופס בוחר קידומת מרשימה סגורה, ומקבל 7 ספרות חופשיות אחריה.
 */
export const ISRAELI_MOBILE_PREFIXES = [
  "050",
  "052",
  "053",
  "054",
  "055",
  "058",
] as const;

export type IsraeliMobilePrefix = (typeof ISRAELI_MOBILE_PREFIXES)[number];

/**
 * נרמול מספר מקומי (למשל "0501234567") ל-E.164 (+972501234567).
 * גם קלט חופשי עם רווחים/מקפים/972+ מתקבל, למקרה שמגיע ממקור אחר מהטופס.
 */
export function normalizeIsraeliMobile(raw: string): string | null {
  let digits = raw.replace(/[^\d+]/g, "");

  if (digits.startsWith("+972")) digits = digits.slice(4);
  else if (digits.startsWith("00972")) digits = digits.slice(5);
  else if (digits.startsWith("972")) digits = digits.slice(3);
  else if (digits.startsWith("0")) digits = digits.slice(1);

  if (!/^5\d{8}$/.test(digits)) return null;
  if (!ISRAELI_MOBILE_PREFIXES.some((p) => `0${digits}`.startsWith(p))) {
    return null;
  }

  return `+972${digits}`;
}

/** תצוגה נוחה לקריאה: 050-123-4567 */
export function formatIsraeliMobile(e164: string): string {
  const local = e164.replace("+972", "0");
  return `${local.slice(0, 3)}-${local.slice(3, 6)}-${local.slice(6)}`;
}
