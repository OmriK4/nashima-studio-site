import Image from "next/image";
import { studio, morningGroup } from "@/content/site";
import { images } from "@/content/images";
import { CtaButton } from "@/components/ui";
import { BreathField, BreathWord } from "@/components/BreathField";

/**
 * השעה שלפני שיעור הבוקר. חדר חשוך וחם, ובמרכזו שדה הנשימה —
 * כדור נקודות אור שמתרחב ומתכווץ בקצב שכל הדף מסונכרן אליו.
 * הטקסט יושב בתוך השדה, לא לידו: הכותרת היא חלק מהנשימה.
 */
export function Hero() {
  return (
    <header className="relative isolate flex min-h-[100dvh] flex-col overflow-hidden">
      {/* שדה הנשימה — מאחורי הכול, על כל גובה ה-Hero */}
      <div className="absolute inset-0 -z-10">
        <BreathField />
      </div>

      {/* עיגון רך של מרכז הפריים, כדי שהכותרת תקרא גם על נקודות בהירות */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 42% 36% at 50% 52%, color-mix(in srgb, var(--night) 55%, transparent) 0%, transparent 100%)",
        }}
      />

      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <div className="rise-in" style={{ animationDelay: "0.1s" }}>
          <Image
            src={images.logo.src}
            alt={images.logo.alt}
            width={images.logo.width}
            height={images.logo.height}
            priority
            className="mx-auto h-20 w-auto opacity-90 sm:h-24"
          />
        </div>

        <div className="rise-in mt-10" style={{ animationDelay: "0.45s" }}>
          <BreathWord />
        </div>

        <h1
          className="rise-in mt-6 text-5xl leading-[1.15] text-ivory text-balance sm:text-7xl"
          style={{ animationDelay: "0.65s" }}
        >
          לנשום. לזוז.
          <br />
          <span className="text-dawn">לחזור לעצמך.</span>
        </h1>

        <p
          className="rise-in mx-auto mt-7 max-w-xl text-lg text-ivory-dim text-balance"
          style={{ animationDelay: "0.9s" }}
        >
          סטודיו פילאטיס קטן ואישי. קבוצות של עד {studio.roomCapacity} אנשים,
          כדי שיהיה אפשר לראות כל אחד ואחת במהלך המפגש. {studio.street},{" "}
          {studio.city}, משנת {studio.activeSince}.
        </p>

        <div
          className="rise-in mt-10 flex flex-wrap items-center justify-center gap-4"
          style={{ animationDelay: "1.1s" }}
        >
          <CtaButton breathing>שריין לי מקום</CtaButton>
          <CtaButton href="#classes" variant="quiet">
            השיעורים בסטודיו
          </CtaButton>
        </div>

        {/* ההודעה הפעילה: הקבוצה שנפתחת עכשיו */}
        <a
          href="#group"
          className="rise-in group mt-12 flex flex-col items-center gap-1 rounded-2xl border border-dawn/25 bg-night-soft/60 px-7 py-5 backdrop-blur-sm transition-colors duration-300 hover:border-dawn/55 hover:bg-night-lift/70"
          style={{ animationDelay: "1.3s" }}
        >
          <span className="text-xs font-semibold tracking-[0.28em] text-dawn">
            נפתחת עכשיו
          </span>
          <span className="mt-1.5 text-xl font-semibold text-ivory">
            {morningGroup.title}
          </span>
          <span className="text-ivory-dim">
            {morningGroup.dayLabel}, {morningGroup.timeLabel} · מתחילים ב־
            {morningGroup.startDateLabel}
          </span>
          <span className="mt-2 text-sm font-semibold text-dawn underline underline-offset-4 transition-colors group-hover:text-dawn-bright">
            לפרטים ולשמירת מקום
          </span>
        </a>
      </div>

      {/* רמז הגלילה — הזריחה מחכה בתחתית הדף */}
      <div
        className="rise-in pb-7 text-center"
        style={{ animationDelay: "1.7s" }}
        aria-hidden
      >
        <span className="text-[11px] tracking-[0.4em] text-dusk">
          הזריחה למטה
        </span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          className="drift-down mx-auto mt-2 h-5 w-5 text-dusk"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </header>
  );
}
