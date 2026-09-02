import { morningGroup } from "@/content/site";
import { Section, CtaButton } from "@/components/ui";
import { CountUp } from "@/components/CountUp";

/**
 * הקבוצה שנפתחת עכשיו — הפריט המודגש בדף.
 * הנתונים החשובים מוצגים כמספרים גדולים שנספרים בכניסה לשדה הראייה,
 * והכרטיס כולו עוטף אותם בטבעת שנושמת בקצב הדף.
 */
export function Group() {
  const stats: { value: React.ReactNode; label: string }[] = [
    {
      value: morningGroup.timeLabel,
      label: `כל ${morningGroup.dayLabel} בבוקר`,
    },
    {
      value: <CountUp value={morningGroup.sessions} />,
      label: "מפגשים בחבילה",
    },
    {
      value: (
        <>
          <CountUp value={morningGroup.price} />
          <span className="mr-1 text-2xl align-top">₪</span>
        </>
      ),
      label: "לכל החבילה",
    },
    {
      value: <CountUp value={morningGroup.capacity} />,
      label: "משתתפים לכל היותר",
    },
  ];

  return (
    <Section id="group" eyebrow="נפתחת עכשיו" title={morningGroup.title} centered wide>
      <p className="mx-auto max-w-lg text-lg text-ivory-dim text-balance">
        {morningGroup.discipline} ברמת {morningGroup.level} · מתחילים ב־
        {morningGroup.startDateLabel}
      </p>

      <div className="breath-ring mx-auto mt-12 max-w-3xl rounded-3xl border border-dawn/25 bg-night-soft/70 px-6 py-10 sm:px-10">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <dd className="font-display text-5xl font-light text-dawn tabular-nums sm:text-6xl">
                {stat.value}
              </dd>
              <dt className="mt-2 text-sm text-ivory-dim">{stat.label}</dt>
            </div>
          ))}
        </dl>

        <p className="mt-10 border-t border-seam pt-6 text-ivory-dim">
          משך כל מפגש {morningGroup.durationLabel} · עד {morningGroup.endDateLabel} ·{" "}
          {morningGroup.paymentNote}
        </p>
      </div>

      <div className="mt-10">
        <CtaButton breathing>שריין לי מקום</CtaButton>
      </div>
    </Section>
  );
}
