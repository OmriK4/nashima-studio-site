import { studio, contact } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-sand bg-cream py-12">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <p className="text-xl">סטודיו {studio.name}</p>
        <p className="mt-2 text-ink-soft">
          {studio.street}, {studio.city} · {studio.floor}
          {studio.hasElevator && " · יש מעלית"}
        </p>
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
          <a
            href={`tel:${contact.phoneE164}`}
            className="text-clay underline underline-offset-4 hover:text-clay-hover"
          >
            {contact.phone}
          </a>
          <a
            href={`mailto:${contact.email}`}
            className="text-clay underline underline-offset-4 hover:text-clay-hover"
          >
            {contact.email}
          </a>
        </div>
        <p className="mt-8 text-xs text-taupe">
          {studio.instructor} · פעיל משנת {studio.activeSince}
        </p>
      </div>
    </footer>
  );
}
