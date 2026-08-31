"use client";

import { useRef, type ReactNode, type PointerEvent } from "react";
import { Divider } from "@/components/Divider";
import { Reveal } from "@/components/Reveal";

export function Section({
  id,
  eyebrow,
  title,
  centered = false,
  divider = true,
  wide = false,
  children,
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  centered?: boolean;
  divider?: boolean;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 pb-20 sm:pb-28">
      {divider && (
        <div className="py-14 sm:py-20">
          <Divider />
        </div>
      )}
      <div
        className={`mx-auto px-6 lg:px-8 ${wide ? "max-w-5xl" : "max-w-3xl"} ${
          centered ? "text-center" : ""
        }`}
      >
        <Reveal>
          {eyebrow && (
            <p className="mb-4 text-xs tracking-[0.34em] text-dawn">
              {eyebrow}
            </p>
          )}
          {title && (
            <h2 className="mb-9 text-3xl text-ivory text-balance sm:text-5xl">
              {title}
            </h2>
          )}
        </Reveal>
        <Reveal delay={120}>{children}</Reveal>
      </div>
    </section>
  );
}

/**
 * הכפתור הראשי נמשך קלות אל הסמן — מספיק כדי להרגיש חי, לא מספיק
 * כדי לברוח מהאצבע. במגע ובהפחתת-תנועה אין הזזה כלל.
 */
export function CtaButton({
  children,
  href = "#register",
  variant = "primary",
  breathing = false,
}: {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "quiet";
  breathing?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = (e: PointerEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    el.style.transform = `translate(${dx * 0.14}px, ${dy * 0.22}px)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "";
  };

  const base =
    "inline-flex items-center justify-center rounded-full px-8 py-3.5 text-base transition-[background-color,border-color,color] duration-300 will-change-transform";
  const styles =
    variant === "primary"
      ? `bg-dawn font-semibold text-night hover:bg-dawn-bright ${breathing ? "breath-glow" : ""}`
      : "border border-dusk/40 text-ivory-dim hover:border-dawn/60 hover:text-ivory";

  return (
    <a
      ref={ref}
      href={href}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`${base} ${styles}`}
    >
      {children}
    </a>
  );
}
