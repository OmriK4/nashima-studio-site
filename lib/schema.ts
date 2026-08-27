import { z } from "zod";
import { ISRAELI_MOBILE_PREFIXES, normalizeIsraeliMobile } from "./phone";
import {
  registrationGroups,
  type RegistrationGroupSlug,
} from "@/content/site";

// נגזר מרשימת הקבוצות ולא מרשימה כפולה, כדי שהוספת קבוצה תיתפס כאן מעצמה
const GROUP_SLUGS = registrationGroups.map((g) => g.slug) as [
  RegistrationGroupSlug,
  ...RegistrationGroupSlug[],
];

/**
 * סכמת השרת: מקור האמת. מקבלת מספר מקומי מורכב (למשל "0501234567"),
 * בלי קשר לאיך שהטופס בנה אותו.
 */
export const registrationSchema = z.object({
  group: z.enum(GROUP_SLUGS, {
    message: "יש לבחור קבוצה",
  }),

  fullName: z
    .string()
    .trim()
    .min(2, "יש להזין שם מלא")
    .max(80, "השם ארוך מדי"),

  phone: z
    .string()
    .trim()
    .min(1, "יש להזין מספר טלפון")
    .refine((v) => normalizeIsraeliMobile(v) !== null, {
      message: "מספר טלפון לא תקין",
    }),

  email: z
    .string()
    .trim()
    .min(1, "יש להזין כתובת אימייל")
    .email("כתובת אימייל לא תקינה"),

  firstTime: z.enum(["yes", "no"], {
    message: "יש לבחור תשובה",
  }),

  medicalAck: z.boolean().refine((v) => v === true, {
    message: "יש לאשר כדי להמשיך בהרשמה",
  }),

  // מלכודת בוטים: שדה שאמור להישאר ריק אצל בן אדם.
  // מתקבל כל ערך (גם ארוך) — אחרת בוט שממלא אותו נכשל כבר בפרסינג
  // ומקבל שגיאת ולידציה, במקום את "הצלחת" הדמה שמטרתה לא לחשוף שזוהה.
  honeypot: z.string().optional(),

  // זמן שחלף מרגע טעינת הטופס — שליחה מהירה באופן חשוד מסננת בוטים
  startedAt: z.number(),
});

export type RegistrationPayload = z.infer<typeof registrationSchema>;

/**
 * סכמת הטופס בפועל: הטלפון מפוצל לקידומת + 7 ספרות חופשיות,
 * ל-UX נוח יותר במובייל. מורכב מחדש למחרוזת אחת לפני שליחה לשרת.
 */
export const registrationFormSchema = z.object({
  group: registrationSchema.shape.group,
  fullName: registrationSchema.shape.fullName,
  phonePrefix: z.enum(ISRAELI_MOBILE_PREFIXES, {
    message: "יש לבחור קידומת",
  }),
  phoneLocal: z
    .string()
    .trim()
    .regex(/^\d{7}$/, "יש להזין 7 ספרות"),
  email: registrationSchema.shape.email,
  firstTime: registrationSchema.shape.firstTime,
  medicalAck: registrationSchema.shape.medicalAck,
  honeypot: registrationSchema.shape.honeypot,
  startedAt: registrationSchema.shape.startedAt,
});

export type RegistrationFormInput = z.infer<typeof registrationFormSchema>;
