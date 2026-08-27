import Image from "next/image";
import { practicalInfo } from "@/content/site";
import { images } from "@/content/images";
import { Section } from "@/components/ui";

export function Who() {
  return (
    <Section id="who" eyebrow="למי זה מתאים" title="גם אם לא התאמנת שנים">
      <p className="max-w-xl text-lg text-ink-soft">
        {practicalInfo.beginnerNote} קבוצת הבוקר החדשה נפתחת ברמת מתחילים,
        וכולם מתחילים מאותה נקודה.
      </p>

      <figure className="mt-10">
        <div className="relative aspect-[3/2] overflow-hidden rounded-xl">
          <Image
            src={images.oneOnOne.src}
            alt={images.oneOnOne.alt}
            fill
            sizes="(min-width: 768px) 48rem, 100vw"
            className="object-cover"
          />
        </div>
        <figcaption className="mt-3 text-sm text-taupe">
          קבוצה קטנה מאפשרת ליווי אישי לאורך המפגש.
        </figcaption>
      </figure>
    </Section>
  );
}
