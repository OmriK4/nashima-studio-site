"use client";

import { useEffect, useRef, useState } from "react";
import { sections } from "@/content/sections";

/**
 * קו הנשימה — הניווט של הדף.
 * דסקטופ: קו רציף לאורך הקצה הימני, עם צומת לכל סקשן.
 * מובייל: סרגל עליון דביק עם צ'יפים לגלילה אופקית.
 */
export function BreathNav() {
  const [active, setActive] = useState<string>("");
  const chipsRef = useRef<HTMLUListElement>(null);

  // הצ'יפ הפעיל נשאר בשדה הראייה כשגוללים בדף
  useEffect(() => {
    if (!active) return;
    const chip = chipsRef.current?.querySelector(`[href="#${active}"]`);
    chip?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [active]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    for (const s of sections) {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* מובייל */}
      <nav
        aria-label="ניווט בדף"
        className="sticky top-0 z-40 border-b border-seam/70 bg-night/85 backdrop-blur lg:hidden"
      >
        <ul ref={chipsRef} className="flex gap-1 overflow-x-auto px-4 py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {sections.map((s) => (
            <li key={s.id} className="shrink-0">
              <a
                href={`#${s.id}`}
                aria-current={active === s.id ? "true" : undefined}
                className={`block rounded-full px-3.5 py-2 text-sm whitespace-nowrap transition-colors ${
                  active === s.id
                    ? "bg-dawn font-semibold text-night"
                    : "text-ivory-dim hover:text-ivory"
                }`}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* דסקטופ — נקודה מימין, שם הסקשן משמאלה */}
      <nav
        aria-label="ניווט בדף"
        className="fixed top-1/2 right-8 z-40 hidden -translate-y-1/2 lg:block"
      >
        <ul className="space-y-4">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={active === s.id ? "true" : undefined}
                className="group flex items-center justify-start gap-3"
              >
                <span
                  aria-hidden
                  className={`h-[9px] w-[9px] shrink-0 rounded-full transition-all duration-300 ${
                    active === s.id
                      ? "scale-125 bg-dawn shadow-[0_0_10px_color-mix(in_srgb,var(--dawn)_60%,transparent)]"
                      : "bg-dusk/50 group-hover:bg-dusk"
                  }`}
                />
                <span
                  className={`text-sm whitespace-nowrap transition-colors duration-300 ${
                    active === s.id
                      ? "text-ivory"
                      : "text-dusk group-hover:text-ivory-dim"
                  }`}
                >
                  {s.label}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
