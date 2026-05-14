"use client";

import { WarningGraphic } from "@/components/ui/warning-graphic";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const HOLD_MS = 3000;
const FADE_S = 0.9;

export function IntroSplash() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => setVisible(false), HOLD_MS);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence onExitComplete={() => (document.body.style.overflow = "")}>
      {visible && (
        <motion.div
          key="intro-splash"
          role="presentation"
          aria-hidden="true"
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[rgb(8,8,8)]"
          initial={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: "-12%", scale: 1.05, filter: "blur(8px)" }}
          transition={{ duration: FADE_S, ease: [0.65, 0, 0.35, 1] }}
        >
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,77,0,0.18)_0%,_transparent_60%)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />

          <motion.div
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
            className="relative flex flex-col items-center gap-8"
          >
            <WarningGraphic
              width={480}
              height={156}
              animationSpeed={1.15}
              color="#FF4D00"
              className="h-auto w-[min(78vw,520px)] drop-shadow-[0_0_40px_rgba(255,77,0,0.35)]"
            />
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.5, ease: "easeOut" }}
              className="font-meta text-[10px] font-bold uppercase tracking-[0.45em] text-white/70 sm:text-[11px]"
            >
              Caution &nbsp;·&nbsp; Heavy Craft Ahead
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
