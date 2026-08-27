import Image from "next/image";
import { studio, practicalInfo } from "@/content/site";
import { images } from "@/content/images";
import { Section } from "@/components/ui";

export function Place() {
  const facts: [string, string][] = [
    ["כתובת", `${studio.street}, ${studio.city}`],
    ["קומה", studio.floor],
    ["מעלית", studio.hasElevator ? "יש מעלית בבניין" : "אין מעלית"],
    ["גודל החדר", `עד ${studio.roomCapacity} משתתפים`],
  ];

  return (
    <Section id="place" eyebrow="המקום" title="איך מגיעים ומה מביאים" tone="milk">
      <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
        <Image
          src={images.studioEmpty.src}
          alt={images.studioEmpty.alt}
          fill
          sizes="(min-width: 768px) 48rem, 100vw"
          className="object-cover"
        />
      </div>

      <dl className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2">
        {facts.map(([label, value]) => (
          <div key={label} className="border-b border-sand pb-3">
            <dt className="text-sm text-taupe">{label}</dt>
            <dd className="mt-1 text-ink">{value}</dd>
          </div>
        ))}
      </dl>

      <h3 className="mt-12 text-2xl">מה להביא</h3>
      <div className="mt-5 grid gap-8 sm:grid-cols-2 sm:items-center">
        <ul className="space-y-3">
          {practicalInfo.whatToBring.map((item) => (
            <li key={item} className="flex gap-3 text-lg">
              <span aria-hidden className="text-greige">
                —
              </span>
              {item}
            </li>
          ))}
          <li className="flex gap-3 text-lg text-ink-soft">
            <span aria-hidden className="text-greige">
              —
            </span>
            {practicalInfo.providedOnSite}
          </li>
        </ul>

        <div className="relative aspect-square overflow-hidden rounded-xl">
          <Image
            src={images.equipmentFloor.src}
            alt={images.equipmentFloor.alt}
            fill
            sizes="(min-width: 640px) 20rem, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      <p className="mt-8 border-r-2 border-clay/40 pr-4 text-ink-soft">
        {practicalInfo.medicalNote}
      </p>
    </Section>
  );
}
