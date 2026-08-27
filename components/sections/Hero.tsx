import Image from "next/image";
import { studio, morningGroup } from "@/content/site";
import { images } from "@/content/images";
import { CtaButton } from "@/components/ui";
import { HeroMedia } from "@/components/HeroMedia";

/**
 * הכותרת היא הסטודיו, לא קבוצה מסוימת.
 * הקבוצה החדשה מופיעה מיד אחריה כהודעה — בולטת, אבל לא מחליפה את הזהות.
 *
 * גובה ה-Hero נגזר מיחס הממדים הטבעי של הסרטון (1280×720, כלומר 16:9):
 * 56.25vw הם בדיוק 9/16 מרוחב המסך, כך שהסרטון מוצג במלואו בלי מתיחה
 * ובלי חיתוך. זהו min-height ולא aspect-ratio, כדי שבמסכים צרים —
 * שבהם 16:9 נמוך מגובה התוכן — ה-Hero יגדל לפי התוכן במקום שהתוכן יגלוש.
 */
export function Hero() {
  return (
    <header className="relative isolate flex min-h-[56.25vw] flex-col justify-center overflow-hidden bg-cream">
      {/* הרקע: אותו סרטון שהיה עד עכשיו ברצועה שמתחת לכותרת */}
      <div className="absolute inset-0 -z-10">
        <HeroMedia />
      </div>

      {/*
        הצעיף לא אחיד: רצפה נמוכה על כל הפריים, כדי שהחדר, החלונות
        והקבוצה ייראו — ומוקד רך של קרם בדיוק מאחורי עמודת הטקסט,
        שם צריך את הניגודיות. פס דק בקצה הימני נותן קרקע לשמות
        הסקשנים בניווט הנקודות, והפס התחתון מחבר את ה-Hero לרקע
        הקרם של הסקשן הבא בלי קו הפרדה.
      */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background: [
            "radial-gradient(ellipse 46% 48% at 50% 52%, color-mix(in srgb, var(--cream) 66%, transparent) 0%, color-mix(in srgb, var(--cream) 48%, transparent) 58%, transparent 92%)",
            "linear-gradient(to left, color-mix(in srgb, var(--cream) 52%, transparent) 0%, transparent 17%)",
            "linear-gradient(to bottom, color-mix(in srgb, var(--cream) 22%, transparent) 0%, transparent 20%, transparent 64%, var(--cream) 100%)",
            "color-mix(in srgb, var(--cream) 30%, transparent)",
          ].join(", "),
        }}
      />

      <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-6 py-14 text-center">
        {/*
          הלוגו הוא קו דק ובהיר מאוד (‎#BEB0A5‎), ומעל וידאו הוא נבלע.
          שתי הפעולות כאן לא נוגעות בקובץ ולא בגודל: הילת קרם נותנת לו
          קרקע נקייה מול הרקע הנע, וצל עדין מגדיר את הקווים עצמם.
        */}
        <span className="relative inline-block">
          <span
            aria-hidden
            className="absolute top-1/2 left-1/2 -z-0 h-[220%] w-[220%] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, var(--cream) 0%, color-mix(in srgb, var(--cream) 72%, transparent) 45%, transparent 100%)",
            }}
          />
          <Image
            src={images.logo.src}
            alt={images.logo.alt}
            width={images.logo.width}
            height={images.logo.height}
            priority
            className="relative mx-auto h-20 w-auto brightness-[0.82] drop-shadow-[0_1px_1.5px_color-mix(in_srgb,var(--ink)_30%,transparent)] sm:h-24"
          />
        </span>

        <h1 className="mt-8 text-4xl leading-tight text-balance sm:text-6xl">
          סטודיו הפילאטיס שלך
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-ink-soft text-balance">
          קבוצות של עד {studio.roomCapacity} אנשים, כדי שיהיה אפשר לראות כל אחד
          ואחת במהלך המפגש. {studio.street}, {studio.city}, משנת{" "}
          {studio.activeSince}.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <CtaButton href="#classes">השיעורים בסטודיו</CtaButton>
          <CtaButton href="#place" variant="quiet">
            איך מגיעים
          </CtaButton>
        </div>

        {/*
          ההודעה הפעילה: הקבוצה שנפתחת עכשיו.
          הרקע שקוף חלקית עם טשטוש (לא bg-milk אטום), כדי שהכרטיס יתמזג
          עם הסרטון מאחוריו במקום לשבת עליו כריבוע לבן בולט. המלל מפצה
          על השקיפות במשקל וצל טקסט עדין, כך שהקריאות לא נפגעת.
        */}
        <a
          href="#group"
          className="mt-10 flex flex-col items-center gap-1 rounded-xl border border-clay/30 bg-milk/40 px-6 py-5 backdrop-blur-sm transition-colors hover:border-clay/55 hover:bg-milk/55"
        >
          <span className="text-xs font-semibold tracking-[0.18em] text-clay drop-shadow-[0_1px_2px_rgba(255,255,255,0.5)]">
            נפתחת עכשיו
          </span>
          <span className="mt-1 text-xl font-semibold text-ink drop-shadow-[0_1px_3px_rgba(255,255,255,0.6)]">
            {morningGroup.title}
          </span>
          <span className="font-medium text-ink-soft drop-shadow-[0_1px_2px_rgba(255,255,255,0.5)]">
            {morningGroup.dayLabel}, {morningGroup.timeLabel} · מתחילים ב־
            {morningGroup.startDateLabel}
          </span>
          <span className="mt-2 text-sm font-semibold text-clay underline underline-offset-4">
            לפרטים ולשמירת מקום
          </span>
        </a>
      </div>
    </header>
  );
}
