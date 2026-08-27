/**
 * חוצץ בין סקשנים.
 * שתי לולאות מראה — מיניאטורה של סימן הלוגו — על קו שנמוג לשני הצדדים.
 * הקווים נבנים ב-CSS כדי שיתמתחו לרוחב, והקשר נשאר בגודל קבוע ולא מתעוות.
 */
export function Divider() {
  return (
    <div aria-hidden className="flex items-center justify-center gap-4 px-6">
      <span className="h-px max-w-40 flex-1 bg-gradient-to-l from-transparent to-greige/60" />

      <svg
        width="52"
        height="26"
        viewBox="0 0 52 26"
        fill="none"
        className="shrink-0 text-greige"
      >
        <ellipse
          cx="20"
          cy="13"
          rx="10.5"
          ry="5.5"
          transform="rotate(-46 20 13)"
          stroke="currentColor"
          strokeWidth="0.9"
        />
        <ellipse
          cx="32"
          cy="13"
          rx="10.5"
          ry="5.5"
          transform="rotate(46 32 13)"
          stroke="currentColor"
          strokeWidth="0.9"
        />
      </svg>

      <span className="h-px max-w-40 flex-1 bg-gradient-to-r from-transparent to-greige/60" />
    </div>
  );
}
