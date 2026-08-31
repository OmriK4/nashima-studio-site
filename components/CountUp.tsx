"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/breath";

/**
 * מספר שנספר אל ערכו בכניסה לשדה הראייה — פעם אחת.
 * מוצג במספרים רגילים בלי תנועה למי שביקש להפחית אותה.
 */
export function CountUp({
  value,
  duration = 1400,
  className,
}: {
  value: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        observer.disconnect();

        if (prefersReducedMotion()) {
          setShown(value);
          return;
        }

        const start = performance.now();
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          setShown(Math.round(value * eased));
          if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {shown.toLocaleString("he-IL")}
    </span>
  );
}
