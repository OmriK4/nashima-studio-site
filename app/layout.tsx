import type { Metadata } from "next";
import { Frank_Ruhl_Libre, Assistant } from "next/font/google";
import { studio, morningGroup } from "@/content/site";
import "./globals.css";

const frank = Frank_Ruhl_Libre({
  variable: "--font-frank",
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const assistant = Assistant({
  variable: "--font-assistant",
  subsets: ["hebrew", "latin"],
  weight: ["400", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `סטודיו ${studio.name} · ${morningGroup.title} ב${studio.city}`,
  description: `${morningGroup.discipline} ל${morningGroup.level} ב${morningGroup.dayLabel}, ${morningGroup.timeLabel}. קבוצה קטנה של עד ${morningGroup.capacity} משתתפים בסטודיו ${studio.name}, ${studio.street}, ${studio.city}.`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${frank.variable} ${assistant.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
