/**
 * דורש שה-Origin יתאים ל-Host. חוסם קריאות ישירות מסקריפטים חיצוניים
 * וטפסים באתרים אחרים, בלי לקבע דומיין בקוד — ולכן עובד מעצמו על כל
 * כתובת שהאתר רץ עליה, כולל כתובות דיפלוימנט זמניות של Vercel.
 */
export function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
