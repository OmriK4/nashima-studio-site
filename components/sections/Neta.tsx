import Image from "next/image";
import { studio } from "@/content/site";
import { images } from "@/content/images";
import { Section } from "@/components/ui";

export function Neta() {
  return (
    <Section id="neta" eyebrow="מי מלווה אתכם" title={studio.instructor} wide>
      <div className="grid gap-10 sm:grid-cols-[1fr_1.2fr] sm:items-center">
        <figure className="photo-warm aspect-[3/4]">
          <Image
            src={images.netaPortrait.src}
            alt={images.netaPortrait.alt}
            fill
            sizes="(min-width: 640px) 22rem, 100vw"
            className="object-cover"
          />
        </figure>

        <div>
          <p className="font-display text-2xl leading-relaxed text-ivory sm:text-3xl">
            <span aria-hidden className="text-dawn">
              ״
            </span>
            הסטודיו קטן ואישי בכוונה. החדר מכיל עד {studio.roomCapacity}{" "}
            אנשים — מספיק כדי שאספיק לראות כל אחד ואחת במהלך המפגש ולהתאים
            את התרגול.
            <span aria-hidden className="text-dawn">
              ״
            </span>
          </p>
          <p className="mt-6 text-lg text-ivory-dim">
            אני מלמדת פילאטיס בסטודיו {studio.name} ב{studio.city} משנת{" "}
            {studio.activeSince}.
          </p>
        </div>
      </div>
    </Section>
  );
}
