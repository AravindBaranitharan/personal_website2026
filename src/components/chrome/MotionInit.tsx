"use client";

import { useEffect } from "react";

/**
 * Wires the design system's data-attribute motion for the current page.
 * Render it as the LAST child of a page: its effect runs only after that page segment has hydrated,
 * so the runtime never touches DOM that React is still hydrating (Cache Components hydrate segments separately).
 */
export function MotionInit() {
  useEffect(() => {
    let cancelled = false;
    const root = document.documentElement;
    const start = () => {
      import("@/lib/motion/aravind-motion.js").then(() => {
        if (!cancelled) window.Aravind?.motion.init(document);
      });
    };
    if (root.classList.contains("ar-intro-pending")) {
      window.addEventListener("ar:intro-done", start, { once: true });
    } else {
      start();
    }
    return () => {
      cancelled = true;
      window.removeEventListener("ar:intro-done", start);
    };
  }, []);

  return null;
}
