import { studio, contact } from "@/content/site";
import { Section } from "@/components/ui";
import { RegisterForm } from "@/components/sections/RegisterForm";

export function Register() {
  return (
    <Section id="register" eyebrow="הרשמה" title="שמירת מקום">
      {/*
        היום והשעה ירדו מכאן כשהטופס התחיל להציע שתי קבוצות —
        שורה שמכריזה על רביעי 07:30 סותרת בורר שמציע גם שני 19:00.
        הפרטים של הקבוצה שנבחרה מוצגים ממילא במסך האישור.
      */}
      <p className="mb-8 max-w-xl text-lg text-ink-soft">
        עד {studio.roomCapacity} משתתפים. אפשר גם להתקשר: {contact.phone}
      </p>
      <RegisterForm />
    </Section>
  );
}
