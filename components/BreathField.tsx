"use client";

import { useEffect, useRef, useState } from "react";
import { breathAt, isInhaling, prefersReducedMotion } from "@/lib/breath";

/**
 * שדה הנשימה — החתימה של הדף.
 *
 * כדור של נקודות אור בתלת-ממד שמתרחב בשאיפה ומתכווץ בנשיפה, מסתובב
 * לאט, ונוטה בעדינות אל העכבר. קנבס דו-ממדי עם הטלה פרספקטיבית —
 * בלי ספריות, בלי WebGL, ולכן בלי מה שיישבר.
 *
 * הקצב מגיע מ-lib/breath — אותה נוסחת זמן מוחלט שכל הדף נושם בה.
 */

const IVORY = "241, 232, 219";
const DAWN = "226, 164, 92";

type P = { x: number; y: number; z: number; dawn: boolean; tw: number };

function buildSphere(count: number): P[] {
  // פיזור פיבונאצ'י — אחיד על פני הכדור, בלי התגודדות בקטבים
  const pts: P[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    pts.push({
      x: Math.cos(theta) * r,
      y,
      z: Math.sin(theta) * r,
      dawn: i % 11 === 0,
      tw: Math.random() * Math.PI * 2,
    });
  }
  return pts;
}

export function BreathField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = prefersReducedMotion();
    const small = window.matchMedia("(max-width: 640px)").matches;
    const pts = buildSphere(small ? 750 : 1300);

    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // נטיית העכבר — יעד + lerp, כדי שהכדור יגיב כמו גוף ולא כמו סמן
    let targetTiltX = 0;
    let targetTiltY = 0;
    let tiltX = 0;
    let tiltY = 0;
    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      targetTiltY = nx * 0.55;
      targetTiltX = ny * 0.35;
    };
    if (!reduced && window.matchMedia("(pointer: fine)").matches) {
      window.addEventListener("pointermove", onMove, { passive: true });
    }

    // הקנבס עובד רק כשהוא על המסך
    let onScreen = true;
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
    });
    io.observe(canvas);

    let frame = 0;

    const draw = (now: number) => {
      const breath = reduced ? 0.35 : breathAt(now);
      const spin = reduced ? 0.6 : now * 0.00006;

      tiltX += (targetTiltX - tiltX) * 0.04;
      tiltY += (targetTiltY - tiltY) * 0.04;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const base = Math.min(width, height) * 0.315;
      const radius = base * (0.9 + 0.115 * breath);

      // הליבה — אור שחר עמום שמתמלא בשאיפה
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.5);
      glow.addColorStop(0, `rgba(${DAWN}, ${0.055 + breath * 0.075})`);
      glow.addColorStop(0.55, `rgba(${DAWN}, ${0.02 + breath * 0.03})`);
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      const sinY = Math.sin(spin + tiltY);
      const cosY = Math.cos(spin + tiltY);
      const sinX = Math.sin(tiltX);
      const cosX = Math.cos(tiltX);
      const persp = 3.1;

      for (const p of pts) {
        // סיבוב סביב ציר Y ואז נטייה סביב X
        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;
        const y1 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;

        const scale = persp / (persp - z2);
        const sx = cx + x1 * radius * scale;
        const sy = cy + y1 * radius * scale;

        const depth = (z2 + 1) / 2; // 0 רחוק, 1 קרוב
        const twinkle = reduced
          ? 1
          : 0.75 + 0.25 * Math.sin(now * 0.0011 + p.tw);
        const alpha =
          (0.12 + depth * 0.55) * twinkle * (0.75 + breath * 0.35);
        const size = (0.5 + depth * 1.35) * (small ? 0.9 : 1);

        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        ctx.fillStyle = p.dawn
          ? `rgba(${DAWN}, ${Math.min(1, alpha * 1.35)})`
          : `rgba(${IVORY}, ${alpha})`;
        ctx.fill();
      }
    };

    if (reduced) {
      // פריים אחד שקט — יש תמונה, אין תנועה
      draw(0);
    } else {
      const loop = (now: number) => {
        if (onScreen) draw(now);
        frame = requestAnimationFrame(loop);
      };
      frame = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}

/**
 * הכיתוב שמעל הכותרת — "שאיפה" כשהכדור מתרחב, "נשיפה" כשהוא שוקע.
 * קורא את אותה נוסחת זמן, ולכן תמיד מדויק מול התנועה.
 */
export function BreathWord() {
  const [inhale, setInhale] = useState(true);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let frame = 0;
    const tick = (now: number) => {
      setInhale(isInhaling(now));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <span className="inline-flex items-center gap-3 text-[13px] tracking-[0.42em] text-dusk">
      <span
        aria-hidden
        className={`h-px w-8 bg-gradient-to-l from-dusk/60 to-transparent transition-opacity duration-1000 ${inhale ? "opacity-100" : "opacity-40"}`}
      />
      <span className="relative inline-block h-[1.4em] min-w-[4.5em] text-center">
        <span
          className={`absolute inset-0 transition-opacity duration-1000 ${inhale ? "opacity-100" : "opacity-0"}`}
        >
          שאיפה
        </span>
        <span
          className={`absolute inset-0 transition-opacity duration-1000 ${inhale ? "opacity-0" : "opacity-100"}`}
        >
          נשיפה
        </span>
      </span>
      <span
        aria-hidden
        className={`h-px w-8 bg-gradient-to-r from-dusk/60 to-transparent transition-opacity duration-1000 ${inhale ? "opacity-100" : "opacity-40"}`}
      />
    </span>
  );
}
