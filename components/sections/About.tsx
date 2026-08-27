import { studio } from "@/content/site";
import { Section } from "@/components/ui";

export function About() {
  return (
    <Section id="about" eyebrow="הסטודיו" title="מי אנחנו">
      <div className="max-w-xl space-y-4 text-lg text-ink-soft">
        <p>
          סטודיו {studio.name} פועל ב{studio.street}, {studio.city}, משנת{" "}
          {studio.activeSince}. זה סטודיו קטן ואישי, לא רשת ולא חדר כושר.
        </p>
        <p>
          החדר מכיל עד {studio.roomCapacity} אנשים, וזה גודל הקבוצה המרבי בכל
          שיעור. הבחירה הזו היא מה שמאפשר ליווי אישי גם כשמתאמנים בקבוצה.
        </p>
      </div>
    </Section>
  );
}
