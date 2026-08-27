import type { ReactNode } from "react";
import { Divider } from "@/components/Divider";
import { Reveal } from "@/components/Reveal";

export function Section({
  id,
  eyebrow,
  title,
  tone = "cream",
  centered = false,
  divider = true,
  children,
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  tone?: "cream" | "milk";
  centered?: boolean;
  divider?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-20 pb-16 sm:pb-24 ${
        tone === "milk" ? "bg-milk" : "bg-cream"
      }`}
    >
      {divider && (
        <div className="py-12 sm:py-16">
          <Divider />
        </div>
      )}
      <div
        className={`mx-auto max-w-3xl px-6 lg:px-8 ${centered ? "text-center" : ""}`}
      >
        <Reveal>
          {eyebrow && (
            <p className="mb-3 text-xs tracking-[0.18em] text-taupe">
              {eyebrow}
            </p>
          )}
          {title && (
            <h2 className="mb-8 text-3xl sm:text-4xl text-balance">{title}</h2>
          )}
        </Reveal>
        <Reveal delay={90}>{children}</Reveal>
      </div>
    </section>
  );
}

export function CtaButton({
  children,
  href = "#register",
  variant = "primary",
}: {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "quiet";
}) {
  const base =
    "inline-flex items-center justify-center rounded-full px-7 py-3.5 text-base transition-colors";
  const styles =
    variant === "primary"
      ? "bg-clay text-cream hover:bg-clay-hover"
      : "border border-taupe/50 text-ink hover:border-ink";
  return (
    <a href={href} className={`${base} ${styles}`}>
      {children}
    </a>
  );
}
