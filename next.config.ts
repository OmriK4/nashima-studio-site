import type { NextConfig } from "next";

/**
 * כותרות אבטחה לכל תשובה מהאתר.
 *
 * אין כאן Content-Security-Policy מלא בכוונה: Next מזריק סקריפטים
 * inline להידרציה, ו-CSP אמיתי היה דורש nonce לכל בקשה. מה שכן אפשר
 * לאכוף בלי לשבור כלום נאכף — ובראשו frame-ancestors, שמונע הטמעה
 * של האתר ב-iframe זר (clickjacking על טופס ההרשמה).
 */
const securityHeaders = [
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
];

/**
 * הנתיבים הישנים של התמונות, מלפני המעבר ל-Cloudinary.
 *
 * מיילי האישור שכבר נשלחו לנרשמות מטמיעים את הלוגו מ-‎/images/‎,
 * ותיבת הדואר שלהן תמשיך לבקש את הכתובת ההיא לנצח. מחיקת הקבצים
 * בלי הפניה שוברת את הלוגו בכל מייל שכבר יצא — ולכן הנתיבים
 * ממשיכים לחיות כהפניה קבועה אל אותו קובץ עצמו ב-Cloudinary.
 */
const CLOUDINARY_BASE =
  "https://res.cloudinary.com/qxawzkp2/image/upload/nashima-studio";

const legacyImagePaths: Record<string, string> = {
  "logo-nashima": "brand/logo-nashima",
  "logo-nashima-mark": "brand/logo-nashima-mark",
  "logo-nashima-glyph": "brand/logo-nashima-glyph",
  "studio-room-empty": "studio/studio-room-empty",
  "studio-equipment-flatlay-floor": "studio/studio-equipment-flatlay-floor",
  "studio-equipment-flatlay-table": "studio/studio-equipment-flatlay-table",
  "studio-group-bridge-pose": "studio/studio-group-bridge-pose",
  "studio-group-side-stretch": "studio/studio-group-side-stretch",
  "neta-one-on-one-training": "neta/neta-one-on-one-training",
  "neta-portrait-seated-mat": "neta/neta-portrait-seated-mat",
  "neta-portrait-closeup": "neta/neta-portrait-closeup",
  "neta-portrait-standing-full": "neta/neta-portrait-standing-full",
  "neta-portrait-standing-crossed-arms": "neta/neta-portrait-standing-crossed-arms",
  "neta-teaching-gesture": "neta/neta-teaching-gesture",
};

const nextConfig: NextConfig = {
  /**
   * התמונות מוגשות מ-Cloudinary. next/image עדיין מבצע את האופטימיזציה
   * (אותם רוחבים, אותו q=75) — רק המקור שממנו הוא מושך את הקובץ השתנה.
   * הנתיב מוגבל לחשבון אחד כדי שלא ייפתח פרוקסי תמונות פתוח.
   */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/qxawzkp2/image/upload/**",
      },
    ],
  },
  async redirects() {
    return Object.entries(legacyImagePaths).map(([name, path]) => ({
      source: `/images/${name}.png`,
      destination: `${CLOUDINARY_BASE}/${path}.png`,
      permanent: true,
    }));
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
