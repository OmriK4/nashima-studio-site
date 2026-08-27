import { NextResponse } from "next/server";
import {
  registrationGroups,
  studio,
  practicalInfo,
  morningGroup,
  otherOfferings,
} from "@/content/site";

/**
 * מקור האמת של הקבוצות, חשוף לקריאה בלבד.
 *
 * מנוע ההרשמה ב-n8n קורא מכאן במקום להחזיק העתק של פרטי העסק.
 * כך שינוי מחיר או שעה ב-content/site.ts מתעדכן גם בהרשמות שהסוכנת
 * מבצעת, בלי לגעת ב-n8n.
 *
 * אין כאן שום סוד ושום מידע על נרשמות — רק מה שממילא מופיע בדף.
 */
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    {
      groups: registrationGroups.map((g) => ({
        slug: g.slug,
        title: g.title,
        dayLabel: g.dayLabel,
        timeLabel: g.timeLabel,
        description: g.description,
        durationLabel: g.durationLabel,
        startDateLabel: g.startDateLabel,
        sessions: g.sessions,
        priceLabel: g.priceLabel,
        paymentNote: g.paymentNote,
        capacity: g.capacity,
      })),
      studio: {
        name: studio.name,
        instructor: studio.instructor,
        street: studio.street,
        city: studio.city,
        floor: studio.floor,
        hasElevator: studio.hasElevator,
        activeSince: studio.activeSince,
        roomCapacity: studio.roomCapacity,
      },
      practicalInfo: {
        whatToBring: practicalInfo.whatToBring.join(" ו"),
        providedOnSite: practicalInfo.providedOnSite,
        medicalNote: practicalInfo.medicalNote,
        beginnerNote: practicalInfo.beginnerNote,
      },
      /** מה שאינו נפתח להרשמה מהאתר, אבל הסוכנת צריכה להכיר */
      otherOfferings: otherOfferings.map((o) => ({ ...o })),
      level: morningGroup.level,
      discipline: morningGroup.discipline,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
