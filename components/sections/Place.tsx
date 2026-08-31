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
    <Section id="place" eyebrow="המקום" title="איך מגיעים ומה מביאים">
      <div className="photo-warm aspect-[16/9]">
        <Image
          src={images.studioEmpty.src}
          alt={images.studioEmpty.alt}
          fill
          sizes="(min-width: 768px) 48rem, 100vw"
          className="object-cover"
        />
      </div>

      <dl className="mt-9 grid gap-x-8 gap-y-4 sm:grid-cols-2">
        {facts.map(([label, value]) => (
          <div key={label} className="border-b border-seam pb-3">
            <dt className="text-sm text-dusk">{label}</dt>
            <dd className="mt-1 text-ivory">{value}</dd>
          </div>
        ))}
      </dl>

      <h3 className="mt-14 text-2xl text-ivory">מה להביא</h3>
      <div className="mt-5 grid gap-8 sm:grid-cols-2 sm:items-center">
        <ul className="space-y-3">
          {practicalInfo.whatToBring.map((item) => (
            <li key={item} className="flex gap-3 text-lg text-ivory">
              <span aria-hidden className="text-dawn">
                —
              </span>
              {item}
            </li>
          ))}
          <li className="flex gap-3 text-lg text-ivory-dim">
            <span aria-hidden className="text-dawn/60">
              —
            </span>
            {practicalInfo.providedOnSite}
          </li>
        </ul>

        <div className="photo-warm aspect-square">
          <Image
            src={images.equipmentFloor.src}
            alt={images.equipmentFloor.alt}
            fill
            sizes="(min-width: 640px) 20rem, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      <p className="mt-9 border-r-2 border-dawn/40 pr-4 text-ivory-dim">
        {practicalInfo.medicalNote}
      </p>
    </Section>
  );
}
