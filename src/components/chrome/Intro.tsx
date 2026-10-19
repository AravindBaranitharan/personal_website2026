"use client";

import { useEffect, useRef } from "react";

const KEY = "ar-intro-seen";

/** First-visit curtain: the wordmark rises, then the screen lifts (design system: Intro). Once per session. */
export function Intro() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const el = ref.current;
    const finish = () => {
      root.classList.remove("ar-intro-pending");
      root.classList.add(KEY);
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {}
      window.dispatchEvent(new Event("ar:intro-done"));
    };
    if (!el || !root.classList.contains("ar-intro-pending")) return;
    import("@/lib/motion/aravind-motion.js").then(() => {
      const motion = window.Aravind?.motion;
      if (motion) motion.intro(el, finish);
      else finish();
    });
  }, []);

  return (
    <div ref={ref} className="ar-intro" style={{ position: "fixed", zIndex: 95 }} aria-hidden="true">
      <div className="ar-intro__word">
        <span className="ar-intro__mask">
          <span>Aravind</span>
        </span>
        <span className="ar-intro__mask">
          <span>Baranitharan</span>
        </span>
      </div>
    </div>
  );
}
