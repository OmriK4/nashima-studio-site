/** מקור אחד לרשימת הסקשנים — הניווט והדף נגזרים ממנו. */
export const sections = [
  { id: "about", label: "הסטודיו" },
  { id: "classes", label: "השיעורים" },
  { id: "group", label: "קבוצת הבוקר" },
  { id: "who", label: "למי זה מתאים" },
  { id: "neta", label: "נטע" },
  { id: "place", label: "המקום" },
  { id: "faq", label: "שאלות" },
] as const;

export type SectionId = (typeof sections)[number]["id"];
