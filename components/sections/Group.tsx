import { morningGroup } from "@/content/site";
import { Section, CtaButton } from "@/components/ui";

/** הקבוצה שנפתחת עכשיו — הפריט המודגש בדף. הכל ממורכז. */
export function Group() {
  const rows: [string, string][] = [
    ["יום ושעה", `${morningGroup.dayLabel}, ${morningGroup.timeLabel}`],
    ["משך המפגש", morningGroup.durationLabel],
    ["מתחילים בתאריך", morningGroup.startDateLabel],
    ["מספר מפגשים", `${morningGroup.sessions} מפגשים`],
    ["גודל הקבוצה", `עד ${morningGroup.capacity} משתתפים`],
    ["רמה", morningGroup.level],
    ["מחיר החבילה", morningGroup.priceLabel],
  ];

  return (
    <Section id="group" eyebrow="נפתחת עכשיו" title={morningGroup.title} centered>
      <p className="mx-auto max-w-lg text-lg text-ink-soft text-balance">
        {morningGroup.discipline} ברמת {morningGroup.level}.
      </p>

      <dl className="mx-auto mt-10 grid max-w-xl gap-x-10 border-y border-sand sm:grid-cols-2">
        {rows.map(([label, value], i) => (
          <div
            key={label}
            className={`border-b border-sand py-4 last:border-b-0 ${
              i === rows.length - 1 ? "sm:col-span-2" : ""
            }`}
          >
            <dt className="text-sm text-taupe">{label}</dt>
            <dd className="mt-1 text-lg text-ink">{value}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-6 text-ink-soft">{morningGroup.paymentNote}.</p>

      <div className="mt-8">
        <CtaButton>שמירת מקום בקבוצה</CtaButton>
      </div>
    </Section>
  );
}
