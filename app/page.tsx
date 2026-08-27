import { BreathNav } from "@/components/BreathNav";
import { NashimaAgent } from "@/components/NashimaAgent";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Classes } from "@/components/sections/Classes";
import { Group } from "@/components/sections/Group";
import { Who } from "@/components/sections/Who";
import { Neta } from "@/components/sections/Neta";
import { Place } from "@/components/sections/Place";
import { Faq } from "@/components/sections/Faq";
import { Register } from "@/components/sections/Register";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <SmoothScroll />

      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:right-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-5 focus:py-2.5 focus:text-cream"
      >
        דילוג לתוכן
      </a>

      <Hero />
      <BreathNav />

      <main className="flex-1">
        <About />
        <Classes />
        <Group />
        <Who />
        <Neta />
        <Place />
        <Faq />
        <Register />
      </main>

      <Footer />

      <NashimaAgent />
    </>
  );
}
