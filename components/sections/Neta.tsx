import Image from "next/image";
import { studio } from "@/content/site";
import { images } from "@/content/images";
import { Section } from "@/components/ui";

export function Neta() {
  return (
    <Section id="neta" eyebrow="מי מלווה אתכם" title={studio.instructor}>
      <div className="grid gap-8 sm:grid-cols-[1fr_1.2fr] sm:items-start">
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
          <Image
            src={images.netaPortrait.src}
            alt={images.netaPortrait.alt}
            fill
            sizes="(min-width: 640px) 20rem, 100vw"
            className="object-cover"
          />
        </div>
        <div className="space-y-4 text-lg text-ink-soft">
          <p>
            אני מלמדת פילאטיס בסטודיו {studio.name} ב{studio.city} משנת{" "}
            {studio.activeSince}.
          </p>
          <p>
            הסטודיו קטן ואישי בכוונה. החדר מכיל עד {studio.roomCapacity} אנשים,
            וזה מספיק כדי שאספיק לראות כל אחד ואחת במהלך המפגש ולהתאים את
            התרגול.
          </p>
        </div>
      </div>
    </Section>
  );
}
