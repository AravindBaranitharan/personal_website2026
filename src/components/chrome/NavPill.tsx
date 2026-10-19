"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Link as NavLink } from "@/content/site";

function HomeIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true">
      <path d="M8 1.6 1.5 7.2V14a.6.6 0 0 0 .6.6h4.1V10h3.6v4.6h4.1a.6.6 0 0 0 .6-.6V7.2Z" />
    </svg>
  );
}

/**
 * Dark nav pill with a white highlight that slides to the section in view (after the hero reference).
 * Section ids come from the hrefs ("/#about" → #about); off the home page, nothing is highlighted except Work on case studies.
 */
export function NavPill({ items }: { items: NavLink[] }) {
  const pathname = usePathname();
  const [spy, setSpy] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const ids = items.map((item) => item.href.split("#")[1] ?? "");
  const onHome = pathname === "/";
  const active = onHome ? spy : pathname.startsWith("/work") ? ids.indexOf("work") : -1;

  // Scroll-spy on the home page: the last section whose top has passed 40% of the viewport.
  useEffect(() => {
    if (!onHome) return;
    const sections = ids.map((id) => document.getElementById(id));
    const pick = () => {
      const line = window.innerHeight * 0.4;
      let current = 0;
      sections.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top <= line) current = i;
      });
      setSpy(current);
    };
    const first = requestAnimationFrame(pick);
    window.addEventListener("scroll", pick, { passive: true });
    window.addEventListener("resize", pick);
    return () => {
      cancelAnimationFrame(first);
      window.removeEventListener("scroll", pick);
      window.removeEventListener("resize", pick);
    };
    // ids is derived from static content
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onHome]);

  // Move the white highlight under the active link.
  useLayoutEffect(() => {
    const list = listRef.current;
    const indicator = indicatorRef.current;
    if (!list || !indicator) return;
    const link = list.querySelectorAll<HTMLElement>("a")[active];
    if (!link) {
      indicator.style.opacity = "0";
      return;
    }
    indicator.style.opacity = "1";
    indicator.style.width = `${link.offsetWidth}px`;
    indicator.style.transform = `translateX(${link.offsetLeft}px)`;
  }, [active]);

  return (
    <div ref={listRef} className="ar-navdark">
      <span ref={indicatorRef} className="ar-navdark__indicator" aria-hidden="true" />
      {items.map((item, i) => (
        <Link
          key={item.href}
          href={item.href}
          className="ar-navdark__link"
          aria-current={i === active ? "location" : undefined}
          data-active={i === active || undefined}
        >
          {i === 0 && <HomeIcon />}
          {item.label}
        </Link>
      ))}
    </div>
  );
}
