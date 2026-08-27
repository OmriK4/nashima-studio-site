import Image from "next/image";
import { morningGroup, otherOfferings, contact } from "@/content/site";
import { images } from "@/content/images";
import { Section } from "@/components/ui";

/** כל מה שמתאמנים בסטודיו, במקום אחד. */
export function Classes() {
  return (
    <Section id="classes" eyebrow="השיעורים" title="האימונים שלנו" tone="milk">
      <ul className="divide-y divide-sand border-y border-sand">
        <li className="py-6">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <span className="flex flex-wrap items-center gap-3 text-xl">
              {morningGroup.discipline} · קבוצת בוקר
              <span className="badge-new inline-block rounded-full bg-clay px-3 py-1 text-xs text-cream">
                חדש בסטודיו
              </span>
            </span>
            <span className="text-ink-soft">
              {morningGroup.dayLabel}, {morningGroup.timeLabel}
            </span>
          </div>
          <p className="mt-2 text-ink-soft">
            רמת {morningGroup.level} · עד {morningGroup.capacity} משתתפים ·{" "}
            <a
              href="#group"
              className="text-clay underline underline-offset-4 hover:text-clay-hover"
            >
              נפתחת ב־{morningGroup.startDateLabel}
            </a>
          </p>
        </li>

        {otherOfferings.map((item) => (
          <li
            key={item.title}
            className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-6"
          >
            <span className="text-xl">{item.title}</span>
            <span className="text-ink-soft">{item.detail}</span>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-ink-soft">
        לפרטים על קבוצת הערב או אימון אישי אפשר להתקשר:{" "}
        <a
          href={`tel:${contact.phoneE164}`}
          className="text-clay underline underline-offset-4 hover:text-clay-hover"
        >
          {contact.phone}
        </a>
      </p>

      <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-xl">
        <Image
          src={images.groupBridge.src}
          alt={images.groupBridge.alt}
          fill
          sizes="(min-width: 768px) 48rem, 100vw"
          className="object-cover"
        />
      </div>
    </Section>
  );
}
