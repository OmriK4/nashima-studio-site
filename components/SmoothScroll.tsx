"use client";

import { useEffect } from "react";

/**
 * גלילה לעוגנים במשך קצוב.
 * הגלילה החלקה של הדפדפן מאריכה לפי המרחק — 1.4 שניות מקצה הדף לתחתיתו.
 * כאן המשך נשאר בטווח צר, כך שקפיצה ארוכה מרגישה חלקה בלי להיות איטית.
 */
const MIN_MS = 320;
const MAX_MS = 620;

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export function SmoothScroll() {
  useEffect(() => {
    let frame = 0;

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const link = (event.target as HTMLElement).closest?.("a");
      const href = link?.getAttribute("href");
      if (!link || !href || href === "#" || !href.startsWith("#")) return;

      const target = document.getElementById(href.slice(1));
      if (!target) return;

      event.preventDefault();

      // scroll-margin-top מכובד רק ב-scrollIntoView, לכן מחשבים אותו ידנית
      const offset = parseFloat(
        getComputedStyle(target).scrollMarginTop || "0",
      );
      const to = Math.max(
        0,
        Math.min(
          target.getBoundingClientRect().top + window.scrollY - offset,
          document.documentElement.scrollHeight - window.innerHeight,
        ),
      );
      const from = window.scrollY;
      const distance = to - from;

      history.pushState(null, "", href);

      if (
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        Math.abs(distance) < 2
      ) {
        window.scrollTo(0, to);
        focusTarget(target);
        return;
      }

      const duration = Math.min(
        MAX_MS,
        Math.max(MIN_MS, Math.abs(distance) * 0.45),
      );
      const start = performance.now();

      cancelAnimationFrame(frame);
      const step = (now: number) => {
        const progress = Math.min(1, (now - start) / duration);
        window.scrollTo(0, from + distance * easeInOutCubic(progress));
        if (progress < 1) frame = requestAnimationFrame(step);
        else focusTarget(target);
      };
      frame = requestAnimationFrame(step);
    };

    // אחרי הגלילה המיקוד עובר ליעד, כדי שניווט במקלדת ימשיך משם
    const focusTarget = (target: HTMLElement) => {
      const hadTabIndex = target.hasAttribute("tabindex");
      if (!hadTabIndex) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
      if (!hadTabIndex) target.removeAttribute("tabindex");
    };

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
