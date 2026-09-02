"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * חשיפה עדינה בכניסה לשדה הראייה — פעם אחת, לא בגלילה חזרה.
 * מי שביקש להפחית תנועה רואה את התוכן מיד.
 */
export function Reveal({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  // הפחתת תנועה מטופלת ב-globals.css, שמאפס שם את משך המעברים:
  // התוכן נחשף מיד בכניסה לשדה הראייה, בלי הזזה.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
      className={`transition-[opacity,transform] duration-700 ease-out ${
        shown ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      }`}
    >
      {children}
    </div>
  );
}
