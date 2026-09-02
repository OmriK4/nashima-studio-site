import Image from "next/image";
import { morningGroup, eveningGroup, otherOfferings, contact } from "@/content/site";
import { images } from "@/content/images";
import { Section } from "@/components/ui";

/** כל מה שמתאמנים בסטודיו, במקום אחד. */
export function Classes() {
  return (
    <Section id="classes" eyebrow="השיעורים" title="האימונים שלנו">
      <ul className="divide-y divide-seam border-y border-seam">
        <li className="group py-6 transition-colors">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <span className="flex flex-wrap items-center gap-3 text-xl text-ivory">
              {morningGroup.discipline} · קבוצת בוקר
              <span className="badge-new inline-block rounded-full bg-dawn px-3 py-1 text-xs font-semibold text-night">
                חדש בסטודיו
              </span>
            </span>
            <span className="text-ivory-dim">
              {morningGroup.dayLabel}, {morningGroup.timeLabel}
            </span>
          </div>
          <p className="mt-2 text-ivory-dim">
            רמת {morningGroup.level} · עד {morningGroup.capacity} משתתפים ·{" "}
            <a
              href="#group"
              className="text-dawn underline underline-offset-4 transition-colors hover:text-dawn-bright"
            >
              נפתחת ב־{morningGroup.startDateLabel}
            </a>
          </p>
        </li>

        <li className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-6">
          <span className="text-xl text-ivory">{eveningGroup.title}</span>
          <span className="text-ivory-dim">
            {eveningGroup.dayLabel}, {eveningGroup.timeLabel}
          </span>
        </li>

        {otherOfferings.map((item) => (
          <li
            key={item.title}
            className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-6"
          >
            <span className="text-xl text-ivory">{item.title}</span>
            <span className="text-ivory-dim">{item.detail}</span>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-ivory-dim">
        לפרטים על קבוצת הערב או אימון אישי אפשר להתקשר:{" "}
        <a
          href={`tel:${contact.phoneE164}`}
          className="text-dawn underline underline-offset-4 transition-colors hover:text-dawn-bright"
        >
          {contact.phone}
        </a>
      </p>

      <figure className="photo-warm mt-10 aspect-[16/9]">
        <Image
          src={images.groupBridge.src}
          alt={images.groupBridge.alt}
          fill
          sizes="(min-width: 768px) 48rem, 100vw"
          className="object-cover"
        />
      </figure>
    </Section>
  );
}
