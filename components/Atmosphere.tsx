"use client";

import { useEffect, useRef } from "react";
import { breathAt, prefersReducedMotion } from "@/lib/breath";

/**
 * שלוש שכבות האווירה של הדף. כולן פאסיביות: בלי DOM כבד, בלי האזנה
 * לסקרול בכל פריים, וכולן כבות מעצמן כשמבקשים להפחית תנועה.
 */

/**
 * שעון הנשימה הגלובלי — כותב את ‎--breath‎ על html בכל פריים.
 * כל מחלקות ‎.breathes / .breath-glow / .breath-ring‎ ב-CSS קוראות אותו.
 */
export function BreathClock() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const root = document.documentElement;
    let frame = 0;
    const tick = (now: number) => {
      root.style.setProperty("--breath", breathAt(now).toFixed(4));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    // בטאב מוסתר rAF ממילא קפוא; רק מוודאים ניקוי
    return () => {
      cancelAnimationFrame(frame);
      root.style.removeProperty("--breath");
    };
  }, []);

  return null;
}

/**
 * הזריחה — ‎--sunrise‎ עולה מ-0 ל-1 ככל שמתקרבים לטופס ההרשמה.
 * נמדד מול תחתית הדף: בראש הדף לילה מלא, בהרשמה אור ראשון.
 */
export function SunriseLayer() {
  useEffect(() => {
    const root = document.documentElement;
    let ticking = false;

    const measure = () => {
      ticking = false;
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      const progress = total > 0 ? window.scrollY / total : 0;
      // עקומה עדינה: רוב העלייה קורית בשליש האחרון של הדף
      const sunrise = Math.min(1, Math.max(0, progress)) ** 1.8;
      root.style.setProperty("--sunrise", sunrise.toFixed(3));
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(measure);
      }
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      root.style.removeProperty("--sunrise");
    };
  }, []);

  return null;
}

/**
 * אור הנר — זוהר רך שהולך עם הסמן, כמו לשאת נר בחדר חשוך.
 * עצלן בכוונה (lerp), עכבר בלבד, ולעולם לא חוסם אינטראקציה.
 */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const el = ref.current;
    if (!el) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let x = targetX;
    let y = targetY;
    let visible = false;
    let frame = 0;

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!visible) {
        visible = true;
        el.style.opacity = "1";
      }
    };

    const tick = () => {
      x += (targetX - x) * 0.08;
      y += (targetY - y) * 0.08;
      el.style.transform = `translate3d(${x - 340}px, ${y - 340}px, 0)`;
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    frame = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed top-0 right-auto left-0 z-[2] h-[680px] w-[680px] opacity-0 transition-opacity duration-700"
      style={{
        background:
          "radial-gradient(circle, color-mix(in srgb, var(--dawn) 9%, transparent) 0%, color-mix(in srgb, var(--ember) 4%, transparent) 38%, transparent 68%)",
        mixBlendMode: "screen",
      }}
    />
  );
}
