import { studio, contact } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-seam py-14">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <p className="font-display text-2xl text-ivory">סטודיו {studio.name}</p>
        <p className="mt-2 text-ivory-dim">
          {studio.street}, {studio.city} · {studio.floor}
          {studio.hasElevator && " · יש מעלית"}
        </p>
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
          <a
            href={`tel:${contact.phoneE164}`}
            className="text-dawn underline underline-offset-4 transition-colors hover:text-dawn-bright"
          >
            {contact.phone}
          </a>
          <a
            href={`mailto:${contact.email}`}
            className="text-dawn underline underline-offset-4 transition-colors hover:text-dawn-bright"
          >
            {contact.email}
          </a>
        </div>
        <p className="mt-9 text-xs text-dusk">
          {studio.instructor} · פעיל משנת {studio.activeSince} · נבנה בקצב של
          שמונה שניות לנשימה
        </p>
      </div>
    </footer>
  );
}
