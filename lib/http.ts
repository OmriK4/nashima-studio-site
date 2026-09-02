/**
 * דורש שה-Origin יתאים ל-Host.
 *
 * מה זה כן עושה: חוסם טפסים וסקריפטים שרצים **בדפדפן** באתר אחר
 * (CSRF), בלי לקבע דומיין בקוד — ולכן עובד מעצמו על כל כתובת שהאתר
 * רץ עליה, כולל כתובות דיפלוימנט זמניות של Vercel.
 *
 * מה זה לא עושה: זה אינו הגנה מפני קריאה אוטומטית. לקוח מחוץ לדפדפן
 * יכול לשלוח Origin כרצונו ולעבור את הבדיקה. מי שאמור לעצור הצפה הוא
 * מגביל הקצב שמתחתיו, ולא הפונקציה הזו.
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

/** כתובת הפונה, לשימוש כמפתח בהגבלת הקצב */
export function clientKey(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown"
  );
}

/**
 * מגביל קצב בזיכרון התהליך, דלי נפרד לכל נקודת קצה.
 *
 * ב-Vercel כל instance סופר לעצמו והמונה מתאפס בהתעוררות קרה, ולכן זו
 * האטה של התפרצות ולא מכסה קשיחה. עבור עסק בהיקף הזה זה מספיק, ואין
 * צורך להכניס Redis רק בשביל שתי נקודות קצה.
 */
export function createRateLimiter({
  windowMs,
  max,
  maxKeys = 500,
}: {
  windowMs: number;
  max: number;
  maxKeys?: number;
}) {
  const hits = new Map<string, number[]>();

  return function isRateLimited(key: string): boolean {
    const now = Date.now();
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    if (recent.length >= max) {
      hits.set(key, recent);
      return true;
    }
    recent.push(now);
    hits.set(key, recent);

    // ניקוי מפתחות ישנים, כדי שהמפה לא תגדל בלי גבול לאורך חיי ה-instance
    if (hits.size > maxKeys) {
      for (const [k, v] of hits) {
        if (v.every((t) => now - t >= windowMs)) hits.delete(k);
      }
    }
    return false;
  };
}
