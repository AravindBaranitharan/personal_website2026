"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import portraitBw from "@/assets/portrait-bw.webp";
import portraitColor from "@/assets/portrait-color.webp";

type Props = { alt: string };

/**
 * The hero's moving parts:
 * - starts the load sequence (letters rise, portrait lifts out of blur) once the intro curtain is gone;
 * - pointer depth: the word drifts with the cursor and the portrait against it;
 * - colour spotlight: the colour cut-out shows through a circle that follows the cursor over the portrait.
 * Scroll parallax is handled by the motion runtime through data-parallax on the wrappers.
 */
export function HeroStage({ alt }: Props) {
  const portraitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const portrait = portraitRef.current;
    const hero = portrait?.closest<HTMLElement>(".ar-hero");
    if (!portrait || !hero) return;
    const root = document.documentElement;

    const start = () => hero.classList.add("is-in");
    if (root.classList.contains("ar-intro-pending")) {
      window.addEventListener("ar:intro-done", start, { once: true });
    } else {
      requestAnimationFrame(start);
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (reduced || !fine) {
      return () => window.removeEventListener("ar:intro-done", start);
    }

    const word = hero.querySelector<HTMLElement>("[data-hero-depth='word']");
    const photo = hero.querySelector<HTMLElement>("[data-hero-depth='photo']");
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0;

    const frame = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      if (word) word.style.transform = `translate3d(${(x * 18).toFixed(2)}px, ${(y * 10).toFixed(2)}px, 0)`;
      if (photo) photo.style.transform = `translate3d(${(x * -12).toFixed(2)}px, ${(y * -6).toFixed(2)}px, 0)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.001 ? requestAnimationFrame(frame) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      const r = hero.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width) * 2 - 1;
      ty = ((e.clientY - r.top) / r.height) * 2 - 1;
      kick();
      const p = portrait.getBoundingClientRect();
      const inside = e.clientX > p.left && e.clientX < p.right && e.clientY > p.top && e.clientY < p.bottom;
      hero.classList.toggle("is-spot", inside);
      if (inside) {
        portrait.style.setProperty("--mx", `${e.clientX - p.left}px`);
        portrait.style.setProperty("--my", `${e.clientY - p.top}px`);
      }
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
      kick();
      hero.classList.remove("is-spot");
    };

    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("ar:intro-done", start);
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="ar-hero__portrait">
      <div data-parallax="0.82">
        <div className="ar-hero__depth" data-hero-depth="photo">
          <div ref={portraitRef} className="ar-hero__photo">
            <Image src={portraitBw} alt={alt} priority sizes="(max-width: 767px) 118vw, 800px" placeholder="empty" />
            <Image
              src={portraitColor}
              alt=""
              aria-hidden="true"
              className="ar-hero__color"
              sizes="(max-width: 767px) 118vw, 800px"
              placeholder="empty"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
