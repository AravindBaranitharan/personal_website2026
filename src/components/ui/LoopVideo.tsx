"use client";

import { useEffect, useRef } from "react";

type Props = {
  src: string;
  poster: string;
  label: string;
  className?: string;
};

/**
 * A short, silent product loop (rendered with /brag in brag-output/).
 * Plays only while at least a quarter of it is on screen, and never under prefers-reduced-motion,
 * where the poster frame stays as a still.
 */
export function LoopVideo({ src, poster, label, className = "" }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={`block h-full w-full object-cover ${className}`}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={label}
    />
  );
}
