import { practicalInfo, morningGroup, studio } from "@/content/site";
import { Section } from "@/components/ui";

export function Faq() {
  const items: [string, string][] = [
    [
      "אף פעם לא עשיתי פילאטיס. זה בשבילי?",
      `${practicalInfo.beginnerNote} הקבוצה נפתחת ברמת ${morningGroup.level}.`,
    ],
    [
      "מה להביא?",
      `${practicalInfo.whatToBring.join(" ו")}. ${practicalInfo.providedOnSite}.`,
    ],
    [
      "אני אחרי פציעה או ניתוח.",
      `${practicalInfo.medicalNote} כדאי גם לספר לי לפני המפגש הראשון.`,
    ],
    [
      "איך משלמים?",
      `${morningGroup.paymentNote}. החבילה כוללת ${morningGroup.sessions} מפגשים במחיר ${morningGroup.priceLabel}.`,
    ],
    [
      "יש מעלית?",
      `הסטודיו נמצא ב${studio.floor}${studio.hasElevator ? ", ויש מעלית בבניין" : ""}.`,
    ],
  ];

  return (
    <Section id="faq" eyebrow="שאלות נפוצות" title="שאלות שחוזרות" tone="milk">
      <div className="divide-y divide-sand border-y border-sand">
        {items.map(([q, a]) => (
          <details key={q} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg [&::-webkit-details-marker]:hidden">
              {q}
              <span
                aria-hidden
                className="shrink-0 text-taupe transition-transform duration-200 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-3 text-ink-soft">{a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
