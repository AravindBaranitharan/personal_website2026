"use client";

import Lenis from "lenis";
import { useEffect } from "react";

/** Starts Lenis smooth scroll once for the whole site. Per-page motion is wired by <MotionInit /> inside each page. */
export function MotionRuntime() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1, anchors: true });
    let raf = requestAnimationFrame(function loop(time) {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    });
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
