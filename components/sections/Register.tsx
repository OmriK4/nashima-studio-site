import { studio, contact } from "@/content/site";
import { Section } from "@/components/ui";
import { RegisterForm } from "@/components/sections/RegisterForm";

/**
 * תחנת הסיום של הזריחה — שכבת ה-sunrise מגיעה כאן לשיאה,
 * והטופס יושב בתוך כרטיס שנושם יחד עם שאר הדף.
 */
export function Register() {
  return (
    <Section id="register" eyebrow="הרשמה" title="שמירת מקום">
      <p className="mb-9 max-w-xl text-lg text-ivory-dim">
        עד {studio.roomCapacity} משתתפים. אפשר גם להתקשר: {contact.phone}
      </p>
      <div className="rounded-3xl border border-dawn/20 bg-night-soft/70 p-6 backdrop-blur-sm sm:p-9">
        <RegisterForm />
      </div>
    </Section>
  );
}
