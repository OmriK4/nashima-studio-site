"use client";

import { useEffect, useRef } from "react";
import { breathAt, prefersReducedMotion } from "@/lib/breath";
import { images } from "@/content/images";

/**
 * שדה הנשימה — הלוגו של הסטודיו, בנוי מאור, בתלת-ממד.
 *
 * הצורה לא מצוירת כאן ולא מקורבת: הקומפוננטה טוענת את קובץ הלוגו
 * (logo-nashima-glyph.png), דוגמת ממנו את הפיקסלים של הקו עצמו,
 * ובונה מהם ענן נקודות. כלומר זה תמיד הלוגו האמיתי — ואם הקובץ
 * יוחלף מתישהו, האנימציה תעקוב אחריו בלי לגעת בקוד.
 *
 * העומק: הלוגו לא שטוח אלא יושב על כיפה רכה — הקצוות נסוגים אחורה
 * כמו כנפיים. עומק הכיפה נושם: נפתח בשאיפה ונאסף בנשיפה.
 *
 * הסיבוב מתנדנד סביב החזית ולא מסתובב במעגל שלם, כדי שהלוגו יישאר
 * קריא בכל רגע — זה סימן מסחרי, לא צעצוע.
 *
 * האינטראקציה: העכבר מטה את הגוף, והמעבר מעליו מפזר את החלקיקים
 * שנמשכים בחזרה למקומם בקפיץ — האור נבהל לרגע ומתאסף מחדש ללוגו.
 *
 * הקצב מגיע מ-lib/breath — אותה נוסחת זמן מוחלט שכל הדף נושם בה.
 */

const IVORY = "241, 232, 219";
const DAWN = "226, 164, 92";

/** רדיוס ההשפעה של הסמן, בפיקסלים */
const TOUCH_RADIUS = 115;

type Point = {
  /** מיקום הבסיס במודל: x,y מהלוגו, curve הוא עיקום הכיפה */
  bx: number;
  by: number;
  curve: number;
  dawn: boolean;
  tw: number;
  /** הסטה זמנית מהסמן, וקפיץ שמחזיר אותה לאפס */
  ox: number;
  oy: number;
  vx: number;
  vy: number;
};

/**
 * דגימת קווי הלוגו לרשת אחידה.
 * מכל תא ברשת נבחר פיקסל אטום אחד (דגימת מאגר — אחיד ואקראי),
 * כך שהנקודות מתפזרות במרווחים שווים לאורך הקו ולא נערמות בפינות.
 */
function sampleLogo(img: HTMLImageElement, cell: number): Point[] {
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  if (!w || !h) return [];

  const off = document.createElement("canvas");
  off.width = w;
  off.height = h;
  const octx = off.getContext("2d", { willReadFrequently: true });
  if (!octx) return [];
  octx.drawImage(img, 0, 0);

  let data: Uint8ClampedArray;
  try {
    data = octx.getImageData(0, 0, w, h).data;
  } catch {
    // הקנבס "מוכתם" — לא אמור לקרות בתמונה מאותו מקור, אבל אם כן,
    // עדיף לוותר על השדה מאשר להפיל את הדף
    return [];
  }

  const cols = Math.ceil(w / cell);
  const rows = Math.ceil(h / cell);
  const norm = Math.max(w, h) / 2;
  const pts: Point[] = [];

  for (let cy = 0; cy < rows; cy++) {
    for (let cx = 0; cx < cols; cx++) {
      let pick = -1;
      let seen = 0;
      const yEnd = Math.min((cy + 1) * cell, h);
      const xEnd = Math.min((cx + 1) * cell, w);

      for (let y = cy * cell; y < yEnd; y++) {
        for (let x = cx * cell; x < xEnd; x++) {
          if (data[(y * w + x) * 4 + 3] > 60) {
            seen++;
            if (Math.random() * seen < 1) pick = y * w + x;
          }
        }
      }
      if (pick < 0) continue;

      const nx = ((pick % w) - w / 2) / norm;
      const ny = (Math.floor(pick / w) - h / 2) / norm;

      pts.push({
        bx: nx,
        by: ny,
        // כיפה רכה: הקצוות נסוגים אחורה, החלק האמצעי קרוב לצופה.
        // הפיזור הקטן נותן לקו עובי של אבק במקום חוט מתמטי.
        curve: 0.95 * nx * nx + 0.3 * ny * ny + (Math.random() - 0.5) * 0.05,
        dawn: Math.random() < 0.09,
        tw: Math.random() * Math.PI * 2,
        ox: 0,
        oy: 0,
        vx: 0,
        vy: 0,
      });
    }
  }

  return pts;
}

/** ענן אבק רחוק שעוטף את הלוגו — שומר על החלל סביבו חי ולא ריק */
function buildDust(count: number) {
  const dust: { x: number; y: number; z: number; tw: number }[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    dust.push({
      x: Math.cos(theta) * r,
      y: y * 0.7,
      z: Math.sin(theta) * r,
      tw: Math.random() * Math.PI * 2,
    });
  }
  return dust;
}

export function LogoField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = prefersReducedMotion();
    const small = window.matchMedia("(max-width: 640px)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const interactive = fine && !reduced;

    let points: Point[] = [];
    const dust = buildDust(small ? 90 : 160);

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
    const ro = new ResizeObserver(() => {
      resize();
      // בהפחתת תנועה אין לולאת ציור שתמלא את הקנבס אחרי שינוי הגודל,
      // ולכן מציירים כאן פריים בודד במקום להשאיר שדה ריק
      if (reduced) draw(0);
    });
    ro.observe(canvas);

    // נטיית הגוף אחרי הסמן — יעד + lerp, כדי שיגיב כמו גוף ולא כמו סמן
    let targetTiltX = 0;
    let targetTiltY = 0;
    let tiltX = 0;
    let tiltY = 0;
    // מיקום הסמן בתוך הקנבס; null כשהוא בחוץ
    let pointer: { x: number; y: number } | null = null;

    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      targetTiltY = nx * 0.26;
      targetTiltX = ny * 0.17;

      const rect = canvas.getBoundingClientRect();
      pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => {
      pointer = null;
    };

    if (interactive) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerleave", onLeave);
    }

    // הקנבס עובד רק כשהוא על המסך
    let onScreen = true;
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
    });
    io.observe(canvas);

    let frame = 0;
    let fade = 0; // כניסה רכה אחרי שהלוגו נדגם

    const draw = (now: number) => {
      const breath = reduced ? 0.4 : breathAt(now);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      if (!points.length) return;

      if (fade < 1) fade = Math.min(1, fade + (reduced ? 1 : 0.02));

      const cx = width / 2;
      const cy = height / 2;
      // הלוגו רחב מגובהו (584×411), ולכן במסך צר הרוחב מגביל
      // ובבמה נמוכה הגובה. השוליים מותירים מקום לפרספקטיבה ולנשימה.
      const base = Math.min(width * 0.42, height * 0.5);
      const scale = base * (0.95 + 0.05 * breath);

      tiltX += (targetTiltX - tiltX) * 0.045;
      tiltY += (targetTiltY - tiltY) * 0.045;

      // נדנוד סביב החזית — הלוגו נשאר קריא, אבל חי ובעל עומק
      const yaw = (reduced ? 0 : Math.sin(now * 0.00019) * 0.26) + tiltY;
      const pitch = (reduced ? 0 : Math.sin(now * 0.00013) * 0.085) + tiltX;
      // הכנפיים נפתחות בשאיפה ונאספות בנשיפה
      const depth = 0.6 + breath * 0.4;

      const sinY = Math.sin(yaw);
      const cosY = Math.cos(yaw);
      const sinX = Math.sin(pitch);
      const cosX = Math.cos(pitch);
      const persp = 3.4;

      // ליבת אור שמתמלאת בשאיפה
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, base * 1.35);
      glow.addColorStop(0, `rgba(${DAWN}, ${(0.075 + breath * 0.09) * fade})`);
      glow.addColorStop(0.5, `rgba(${DAWN}, ${(0.028 + breath * 0.04) * fade})`);
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      // האבק הרחוק — שכבה שקטה מאחורי הלוגו
      const dustR = base * 1.28;
      for (const d of dust) {
        const x1 = d.x * cosY + d.z * sinY;
        const z1 = -d.x * sinY + d.z * cosY;
        const y1 = d.y * cosX - z1 * sinX;
        const z2 = d.y * sinX + z1 * cosX;
        const k = persp / (persp - z2);
        const sx = cx + x1 * dustR * k;
        const sy = cy + y1 * dustR * k;
        const depthN = (z2 + 1) / 2;
        const tw = reduced ? 1 : 0.7 + 0.3 * Math.sin(now * 0.0009 + d.tw);
        ctx.beginPath();
        ctx.arc(sx, sy, 0.5 + depthN * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${IVORY}, ${(0.07 + depthN * 0.13) * tw * fade})`;
        ctx.fill();
      }

      // הלוגו
      for (const p of points) {
        const z0 = -(p.curve - 0.28) * depth;

        const x1 = p.bx * cosY + z0 * sinY;
        const z1 = -p.bx * sinY + z0 * cosY;
        const y1 = p.by * cosX - z1 * sinX;
        const z2 = p.by * sinX + z1 * cosX;

        const k = persp / (persp - z2);
        const sx = cx + x1 * scale * k;
        const sy = cy + y1 * scale * k;

        // קפיץ: ההסטה מהסמן נמשכת תמיד בחזרה לאפס
        if (interactive) {
          p.vx += -p.ox * 0.055;
          p.vy += -p.oy * 0.055;
          p.vx *= 0.88;
          p.vy *= 0.88;
          p.ox += p.vx;
          p.oy += p.vy;
        }

        const fx = sx + p.ox;
        const fy = sy + p.oy;

        let touch = 0;
        if (pointer) {
          const dx = fx - pointer.x;
          const dy = fy - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < TOUCH_RADIUS * TOUCH_RADIUS) {
            const d = Math.sqrt(d2) || 1;
            touch = 1 - d / TOUCH_RADIUS;
            const push = touch * touch * 2.8;
            p.vx += (dx / d) * push;
            p.vy += (dy / d) * push;
          }
        }

        const depthN = (z2 + 1) / 2; // 0 רחוק, 1 קרוב
        const twinkle = reduced ? 1 : 0.78 + 0.22 * Math.sin(now * 0.0011 + p.tw);
        const alpha =
          Math.min(1, (0.36 + depthN * 0.64) * twinkle * (0.86 + breath * 0.22) + touch * 0.42) *
          fade;
        const size = (0.58 + depthN * 1.1) * (small ? 0.95 : 1) + touch * 0.6;

        ctx.beginPath();
        ctx.arc(fx, fy, size, 0, Math.PI * 2);
        ctx.fillStyle =
          p.dawn || touch > 0.45
            ? `rgba(${DAWN}, ${Math.min(1, alpha * 1.3)})`
            : `rgba(${IVORY}, ${alpha})`;
        ctx.fill();
      }
    };

    const start = () => {
      if (reduced) {
        draw(0);
        return;
      }
      const loop = (now: number) => {
        if (onScreen) draw(now);
        frame = requestAnimationFrame(loop);
      };
      frame = requestAnimationFrame(loop);
    };

    const img = new Image();
    img.onload = () => {
      points = sampleLogo(img, small ? 4 : 3);
      start();
    };
    // אם הלוגו לא נטען, עדיף שדה ריק על פני דף שבור
    img.onerror = () => start();
    img.src = images.logoGlyph.src;

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
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
