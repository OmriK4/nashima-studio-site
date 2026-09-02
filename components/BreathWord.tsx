"use client";

import { useEffect, useState } from "react";
import { isInhaling, prefersReducedMotion } from "@/lib/breath";

/**
 * הכיתוב שמעל הכותרת — "שאיפה" כשהלוגו נפתח, "נשיפה" כשהוא נאסף.
 * קורא את אותה נוסחת זמן כמו שדה הלוגו, ולכן תמיד מדויק מול התנועה.
 */
export function BreathWord() {
  const [inhale, setInhale] = useState(true);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let frame = 0;
    const tick = (now: number) => {
      setInhale(isInhaling(now));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <span className="inline-flex items-center gap-3 text-[13px] tracking-[0.42em] text-dusk">
      <span
        aria-hidden
        className={`h-px w-8 bg-gradient-to-l from-dusk/60 to-transparent transition-opacity duration-1000 ${inhale ? "opacity-100" : "opacity-40"}`}
      />
      <span className="relative inline-block h-[1.4em] min-w-[4.5em] text-center">
        <span
          className={`absolute inset-0 transition-opacity duration-1000 ${inhale ? "opacity-100" : "opacity-0"}`}
        >
          שאיפה
        </span>
        <span
          className={`absolute inset-0 transition-opacity duration-1000 ${inhale ? "opacity-0" : "opacity-100"}`}
        >
          נשיפה
        </span>
      </span>
      <span
        aria-hidden
        className={`h-px w-8 bg-gradient-to-r from-dusk/60 to-transparent transition-opacity duration-1000 ${inhale ? "opacity-100" : "opacity-40"}`}
      />
    </span>
  );
}
