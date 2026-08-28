"use client";

import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registrationFormSchema,
  type RegistrationFormInput,
} from "@/lib/schema";
import { ISRAELI_MOBILE_PREFIXES } from "@/lib/phone";
import {
  registrationGroups,
  findRegistrationGroup,
  studio,
  practicalInfo,
  contact,
} from "@/content/site";

type Status = "idle" | "submitting" | "success" | "error" | "unsure";

/** מה n8n החזיר על המקום שנשמר. "unknown" = נכתב, אך הסטטוס לא הוחזר. */
type SeatStatus = "confirmed" | "waitlist" | "unknown";

/**
 * ארוך מהתקרה של השרת (25 שניות ל-n8n בתוך maxDuration של 30), כדי
 * שהתשובה המסודרת של השרת תגיע ראשונה כמעט תמיד. ניתוק יזום מוקדם
 * יותר היה מייצר ספק מיותר אצל מי שההרשמה שלה כן נקלטה.
 */
const SUBMIT_TIMEOUT_MS = 35000;

// בלי w-full כאן בכוונה: השדה הכפול (טלפון) צריך רוחב חלקי,
// וקלאס w-full שהיה כאן ניצח w-24/flex-1 לפי סדר הפלט הפנימי של Tailwind.
const fieldBase =
  "rounded-lg border bg-milk px-4 py-3 text-ink placeholder:text-taupe/70 " +
  "focus:outline-none focus:ring-2 focus:ring-clay/40 transition-colors";
const fieldValid = "border-sand focus:border-clay";
const fieldInvalid = "border-clay/60";

export function RegisterForm() {
  const [status, setStatus] = useState<Status>("idle");
  // איזו קבוצה נשלחה בפועל — מסך האישור מציג את הפרטים שלה ולא של אחרת
  const [sentGroupSlug, setSentGroupSlug] = useState<string | null>(null);
  // מקום מאושר או רשימת המתנה — כדי שהמסך לא יבטיח מקום שלא נשמר
  const [seatStatus, setSeatStatus] = useState<SeatStatus>("unknown");
  // useState עם אתחול עצל: Date.now() נקרא פעם אחת בלבד, לא בכל רינדור
  const [startedAt] = useState(() => Date.now());

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormInput>({
    resolver: zodResolver(registrationFormSchema),
    mode: "onBlur",
    defaultValues: {
      group: undefined,
      fullName: "",
      phonePrefix: "050",
      phoneLocal: "",
      email: "",
      firstTime: undefined,
      medicalAck: false,
      honeypot: "",
      startedAt,
    },
  });

  const groupId = useId();
  const fullNameId = useId();
  const phoneId = useId();
  const emailId = useId();
  const firstTimeId = useId();
  const medicalId = useId();

  const onSubmit = handleSubmit(
    async (values) => {
      setStatus("submitting");

      try {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            group: values.group,
            fullName: values.fullName,
            phone: `${values.phonePrefix}${values.phoneLocal}`,
            email: values.email,
            firstTime: values.firstTime,
            medicalAck: values.medicalAck,
            honeypot: values.honeypot,
            startedAt: values.startedAt,
          }),
          signal: AbortSignal.timeout(SUBMIT_TIMEOUT_MS),
        });
        const data: { ok: boolean; status?: SeatStatus } = await res.json();
        if (data.ok) {
          setSentGroupSlug(values.group);
          setSeatStatus(data.status ?? "unknown");
          setStatus("success");
          return;
        }
        setStatus("error");
      } catch {
        /**
         * ניתוק או תום זמן — אין לנו דרך לדעת אם ההרשמה נכתבה או לא,
         * ואין מנגנון שמונע שורה כפולה בשליחה חוזרת. לכן מציגים מסך
         * נפרד שמבקש לבדוק את המייל לפני ניסיון נוסף, במקום להציע
         * "נסו שוב" שעלול לרשום את אותה אדם פעמיים.
         */
        setStatus("unsure");
      }
    },
    () => {
      // מיקוד על השדה השגוי הראשון, לפי סדר הטופס
      const order: (keyof RegistrationFormInput)[] = [
        "group",
        "fullName",
        "phonePrefix",
        "phoneLocal",
        "email",
        "firstTime",
        "medicalAck",
      ];
      const first = order.find((name) => errors[name]);
      if (first) setFocus(first);
    },
  );

  const sentGroup = sentGroupSlug ? findRegistrationGroup(sentGroupSlug) : null;

  if (status === "success" && sentGroup) {
    /**
     * רק סטטוס "waitlist" מוכר משנה את הכותרת. כל מצב אחר, כולל
     * "unknown", מציג את האישור הרגיל — אותה התנהגות שהייתה קודם.
     * העיקר הוא שמי שנכנסה לרשימת המתנה לא תקרא "מחכים לך ביום רביעי".
     */
    const waitlisted = seatStatus === "waitlist";

    return (
      <div className="rounded-xl border border-sand bg-milk p-6 sm:p-8">
        <p className="text-sm tracking-[0.14em] text-clay">
          {waitlisted ? "נרשמת לרשימת ההמתנה" : "ההרשמה נקלטה"}
        </p>
        <h3 className="mt-2 text-2xl">
          {waitlisted
            ? "הקבוצה מלאה כרגע"
            : `מחכים לך ב${sentGroup.dayLabel}`}
        </h3>

        {waitlisted && (
          <p className="mt-3 text-ink-soft">
            שמרנו את מקומך ברשימת ההמתנה, ואם יתפנה מקום ניצור קשר בהקדם.
          </p>
        )}

        {/* שורה שאין לה נתון פשוט לא מוצגת — עדיף חסר על פני המצאה */}
        <dl className="mt-6 space-y-2 text-ink-soft">
          <div>
            {sentGroup.dayLabel}, {sentGroup.timeLabel}
            {sentGroup.durationLabel && ` · ${sentGroup.durationLabel}`}
          </div>
          {sentGroup.startDateLabel && (
            <div>מתחילים ב־{sentGroup.startDateLabel}</div>
          )}
          <div>
            {studio.street}, {studio.city} · {studio.floor}
            {studio.hasElevator && " · יש מעלית"}
          </div>
          <div>{practicalInfo.providedOnSite}</div>
          <div>{sentGroup.paymentNote}</div>
        </dl>

        <p className="mt-6 border-r-2 border-clay/40 pr-4 text-sm text-ink-soft">
          {practicalInfo.medicalNote}
        </p>

        <p className="mt-6 text-sm text-taupe">
          שאלה לפני המפגש? אפשר להתקשר: {contact.phone}
        </p>
      </div>
    );
  }

  /**
   * החיבור נקטע ואיננו יודעים אם ההרשמה נכתבה. לא מציעים "נסו שוב"
   * כברירת מחדל, כי שליחה חוזרת עלולה ליצור הרשמה כפולה.
   */
  if (status === "unsure") {
    return (
      <div className="rounded-xl border border-clay/30 bg-milk p-6 sm:p-8">
        <p className="text-sm tracking-[0.14em] text-clay">החיבור נקטע</p>
        <h3 className="mt-2 text-2xl">לא הצלחנו לוודא את ההרשמה</h3>
        <p className="mt-4 text-ink-soft">
          ייתכן שההרשמה כן נקלטה. כדאי לבדוק אם הגיע מייל אישור לפני
          שממלאים את הטופס שוב, כדי שלא תיווצר הרשמה כפולה.
        </p>
        <p className="mt-6 text-sm text-taupe">
          אם לא הגיע מייל, אפשר להתקשר: {contact.phone}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      {/* מלכודת בוטים — מוסתר מבני אדם, גלוי לרובוטים שממלאים כל שדה */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company">חברה</label>
        <input
          id="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("honeypot")}
        />
      </div>

      <fieldset>
        <legend className="mb-2 text-sm text-ink-soft">לאיזו קבוצה נרשמים?</legend>
        <div
          className="flex gap-3"
          role="radiogroup"
          aria-describedby={errors.group ? `${groupId}-err` : undefined}
        >
          {registrationGroups.map((group) => (
            <label
              key={group.slug}
              className={`flex flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-lg border bg-milk px-4 py-3 text-ink transition-colors has-[:checked]:border-clay has-[:checked]:bg-cream-deep has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-clay/40 ${
                group.highlight
                  ? "option-glow border-clay/40"
                  : "border-sand"
              }`}
            >
              <input
                type="radio"
                value={group.slug}
                className="sr-only"
                {...register("group")}
              />
              <span>{group.dayLabel}</span>
              <span className="text-sm text-ink-soft">{group.timeLabel}</span>
              {/*
                טקסט שיווקי בלבד, לא נתון אמיתי מהגיליון — דגל להחלפה
                כשיהיה זרם הרשמות אמיתי לקבוצה הזו.
              */}
              {group.highlight && (
                <span className="mt-1 text-[11px] font-medium text-clay">
                  🔥 כבר נרשמו 4 — שריינו את המקום שלכם
                </span>
              )}
            </label>
          ))}
        </div>
        {errors.group && (
          <p id={`${groupId}-err`} className="mt-1.5 text-sm text-clay">
            {errors.group.message}
          </p>
        )}
      </fieldset>

      <div>
        <label htmlFor={fullNameId} className="mb-2 block text-sm text-ink-soft">
          שם מלא
        </label>
        <input
          id={fullNameId}
          type="text"
          autoComplete="name"
          aria-invalid={!!errors.fullName}
          aria-describedby={errors.fullName ? `${fullNameId}-err` : undefined}
          className={`${fieldBase} w-full ${errors.fullName ? fieldInvalid : fieldValid}`}
          {...register("fullName")}
        />
        {errors.fullName && (
          <p id={`${fullNameId}-err`} className="mt-1.5 text-sm text-clay">
            {errors.fullName.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={phoneId} className="mb-2 block text-sm text-ink-soft">
          טלפון נייד
        </label>
        <div className="flex gap-2" dir="ltr">
          <select
            aria-label="קידומת"
            className={`${fieldBase} w-24 text-center ${
              errors.phonePrefix ? fieldInvalid : fieldValid
            }`}
            {...register("phonePrefix")}
          >
            {ISRAELI_MOBILE_PREFIXES.map((prefix) => (
              <option key={prefix} value={prefix}>
                {prefix}
              </option>
            ))}
          </select>
          <input
            id={phoneId}
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder="1234567"
            className={`${fieldBase} min-w-0 flex-1 text-left ${
              errors.phoneLocal ? fieldInvalid : fieldValid
            }`}
            aria-invalid={!!errors.phoneLocal}
            aria-describedby={errors.phoneLocal ? `${phoneId}-err` : undefined}
            {...register("phoneLocal")}
          />
        </div>
        {(errors.phonePrefix || errors.phoneLocal) && (
          <p id={`${phoneId}-err`} className="mt-1.5 text-sm text-clay">
            {errors.phoneLocal?.message ?? errors.phonePrefix?.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={emailId} className="mb-2 block text-sm text-ink-soft">
          אימייל
        </label>
        <input
          id={emailId}
          type="email"
          inputMode="email"
          autoComplete="email"
          dir="ltr"
          className={`${fieldBase} w-full text-right ${errors.email ? fieldInvalid : fieldValid}`}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? `${emailId}-err` : undefined}
          {...register("email")}
        />
        {errors.email && (
          <p id={`${emailId}-err`} className="mt-1.5 text-sm text-clay">
            {errors.email.message}
          </p>
        )}
      </div>

      <fieldset>
        <legend className="mb-2 text-sm text-ink-soft">
          האם זו הפעם הראשונה שלך בפילאטיס?
        </legend>
        <div
          className="flex gap-3"
          role="radiogroup"
          aria-describedby={errors.firstTime ? `${firstTimeId}-err` : undefined}
        >
          {(["yes", "no"] as const).map((value) => (
            <label
              key={value}
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-sand bg-milk px-4 py-3 text-ink transition-colors has-[:checked]:border-clay has-[:checked]:bg-cream-deep has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-clay/40"
            >
              <input
                type="radio"
                value={value}
                className="sr-only"
                {...register("firstTime")}
              />
              {value === "yes" ? "כן, פעם ראשונה" : "כבר התאמנתי"}
            </label>
          ))}
        </div>
        {errors.firstTime && (
          <p id={`${firstTimeId}-err`} className="mt-1.5 text-sm text-clay">
            {errors.firstTime.message}
          </p>
        )}
      </fieldset>

      <div>
        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-sand bg-milk px-4 py-3 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-clay/40">
          <input
            id={medicalId}
            type="checkbox"
            className="mt-1 h-4 w-4 shrink-0 accent-clay"
            aria-invalid={!!errors.medicalAck}
            aria-describedby={
              errors.medicalAck ? `${medicalId}-err` : undefined
            }
            {...register("medicalAck")}
          />
          <span className="text-sm text-ink-soft">
            קראתי, ואם אני אחרי ניתוח או פציעה אביא אישור רופא לפני ההשתתפות.
          </span>
        </label>
        {errors.medicalAck && (
          <p id={`${medicalId}-err`} className="mt-1.5 text-sm text-clay">
            {errors.medicalAck.message}
          </p>
        )}
      </div>

      {status === "error" && (
        <p role="alert" className="rounded-lg bg-cream-deep px-4 py-3 text-sm text-ink-soft">
          לא הצלחנו לשלוח את הטופס. אפשר לנסות שוב, או להתקשר: {contact.phone}
        </p>
      )}

      {/* הכפתור ממורכז מתחת לטופס — בדסקטופ הוא ברוחב תוכן, ולכן
          העטיפה היא זו שמרכזת אותו ולא מרג׳ין על אלמנט inline-flex. */}
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={status === "submitting" || isSubmitting}
          className="inline-flex w-full items-center justify-center rounded-full bg-clay px-7 py-3.5 text-base text-cream transition-colors hover:bg-clay-hover disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
        >
          {status === "submitting" || isSubmitting ? "שולח..." : "שריין לי מקום"}
        </button>
      </div>
    </form>
  );
}
