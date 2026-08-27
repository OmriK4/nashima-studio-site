"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { images, heroVideo } from "@/content/images";

/**
 * הסרטון נוצר רק כשהמסך רחב והמשתמש לא ביקש להפחית תנועה.
 * הסתרה ב-CSS לא מספיקה — הדפדפן היה מוריד את הקובץ גם במובייל.
 */
export function HeroMedia() {
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
    );
    const sync = () => setShowVideo(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  if (showVideo) {
    return (
      <video
        className="h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster={heroVideo.poster}
        aria-hidden="true"
      >
        <source src={heroVideo.src} type="video/mp4" />
      </video>
    );
  }

  return (
    <Image
      src={images.groupSideStretch.src}
      alt={images.groupSideStretch.alt}
      fill
      sizes="100vw"
      className="object-cover"
    />
  );
}
