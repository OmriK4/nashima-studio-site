import { studio, morningGroup } from "@/content/site";
import { CtaButton } from "@/components/ui";
import { LogoField } from "@/components/LogoField";
import { BreathWord } from "@/components/BreathWord";

/**
 * השעה שלפני שיעור הבוקר. חדר חשוך וחם, ובראשו הלוגו של הסטודיו
 * בנוי מאור — נושם, נוטה אחרי העכבר, ומתפזר למגע.
 *
 * הסימן מקבל במה משלו ולא יושב מאחורי המלל: כשהוא היה ברקע של כל
 * ה-Hero, קווי הלוגו חתכו את פסקת הפתיחה ואת הכפתורים. עכשיו הוא
 * תופס את החלק העליון (flex-1, גדל עם המסך) והמלל יושב נקי מתחתיו.
 *
 * אין כאן עותק שטוח של הלוגו: הסימן החי הוא הזהות, והשם חוזר במלל.
 */
export function Hero() {
  return (
    <header className="relative isolate flex min-h-[100dvh] flex-col overflow-hidden">
      {/* הבמה של הסימן — גדלה עם גובה המסך, לא קטנה מ-220 פיקסלים */}
      <div className="relative w-full flex-1 min-h-[220px]">
        <LogoField />
      </div>

      <div className="mx-auto flex w-full max-w-3xl shrink-0 flex-col items-center px-6 pt-2 pb-10 text-center">
        <div className="rise-in" style={{ animationDelay: "0.5s" }}>
          <BreathWord />
        </div>

        <h1
          className="rise-in mt-5 text-5xl leading-[1.15] text-ivory text-balance sm:text-6xl"
          style={{ animationDelay: "0.7s" }}
        >
          לנשום. לזוז.{" "}
          <span className="text-dawn">לחזור לעצמך.</span>
        </h1>

        <p
          className="rise-in mx-auto mt-6 max-w-xl text-lg text-ivory-dim text-balance"
          style={{ animationDelay: "0.95s" }}
        >
          סטודיו {studio.name} — פילאטיס קטן ואישי. קבוצות של עד{" "}
          {studio.roomCapacity} אנשים, כדי שיהיה אפשר לראות כל אחד ואחת במהלך
          המפגש. {studio.street}, {studio.city}, משנת {studio.activeSince}.
        </p>

        <div
          className="rise-in mt-8 flex flex-wrap items-center justify-center gap-4"
          style={{ animationDelay: "1.15s" }}
        >
          <CtaButton breathing>שריין לי מקום</CtaButton>
          <CtaButton href="#classes" variant="quiet">
            השיעורים בסטודיו
          </CtaButton>
        </div>

        {/*
          ההודעה הפעילה — שורה אחת ולא כרטיס. הפרטים המלאים של הקבוצה
          יושבים ממילא בסקשן "נפתחת עכשיו", וכרטיס שלם כאן היה דוחק
          את הסימן ומוריד אותו מהמסך הראשון.
        */}
        <a
          href="#group"
          className="rise-in group mt-7 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm"
          style={{ animationDelay: "1.35s" }}
        >
          <span className="font-semibold tracking-[0.22em] text-dawn">
            נפתחת עכשיו
          </span>
          <span className="text-ivory-dim">
            {morningGroup.title} · {morningGroup.dayLabel},{" "}
            {morningGroup.timeLabel} · מ־{morningGroup.startDateLabel}
          </span>
          <span className="font-semibold text-dawn underline underline-offset-4 transition-colors group-hover:text-dawn-bright">
            לפרטים
          </span>
        </a>
      </div>

      {/* רמז הגלילה — הזריחה מחכה בתחתית הדף */}
      <div
        className="rise-in shrink-0 pb-6 text-center"
        style={{ animationDelay: "1.7s" }}
        aria-hidden
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          className="drift-down mx-auto h-5 w-5 text-dusk"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </header>
  );
}
