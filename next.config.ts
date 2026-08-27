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

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
