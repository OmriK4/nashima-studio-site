import Image from "next/image";
import { studio } from "@/content/site";
import { images } from "@/content/images";
import { Section } from "@/components/ui";

export function About() {
  return (
    <Section id="about" eyebrow="הסטודיו" title="מי אנחנו" wide>
      <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
        <div className="max-w-xl space-y-5 text-lg text-ivory-dim">
          <p>
            סטודיו {studio.name} פועל ב{studio.street}, {studio.city}, משנת{" "}
            {studio.activeSince}. זה סטודיו קטן ואישי, לא רשת ולא חדר כושר.
          </p>
          <p>
            החדר מכיל עד {studio.roomCapacity} אנשים, וזה גודל הקבוצה המרבי
            בכל שיעור. הבחירה הזו היא מה שמאפשר ליווי אישי גם כשמתאמנים
            בקבוצה.
          </p>
          <p className="border-r-2 border-dawn/50 pr-4 font-display text-2xl leading-snug text-ivory">
            קטן מספיק כדי לראות כל אחד ואחת. גדול מספיק כדי לנשום יחד.
          </p>
        </div>

        <figure className="photo-warm aspect-[4/3]">
          <Image
            src={images.groupSideStretch.src}
            alt={images.groupSideStretch.alt}
            fill
            sizes="(min-width: 1024px) 30rem, 100vw"
            className="object-cover"
          />
        </figure>
      </div>
    </Section>
  );
}
