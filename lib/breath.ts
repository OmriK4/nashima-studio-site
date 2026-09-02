/**
 * הנוסחה האחת של הנשימה — כל מי שנושם בדף קורא ממנה.
 *
 * הערך נגזר מהזמן המוחלט (performance.now), לא ממונה פנימי: כך קנבס,
 * שעון ה-CSS והכיתוב "שאיפה/נשיפה" מסונכרנים בלי לחלוק state, גם אם
 * כל אחד מהם רץ בלולאת rAF משלו שנוצרה ברגע אחר.
 */
export const BREATH_CYCLE_MS = 8000;

/** 0 בסוף נשיפה, 1 בשיא שאיפה. עקומת קוסינוס — איטי בקצוות, כמו נשימה. */
export function breathAt(nowMs: number): number {
  const phase = (nowMs % BREATH_CYCLE_MS) / BREATH_CYCLE_MS;
  return 0.5 - 0.5 * Math.cos(phase * Math.PI * 2);
}

/** בחצי הראשון של המחזור האוויר נכנס, בשני יוצא. */
export function isInhaling(nowMs: number): boolean {
  return (nowMs % BREATH_CYCLE_MS) / BREATH_CYCLE_MS < 0.5;
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
