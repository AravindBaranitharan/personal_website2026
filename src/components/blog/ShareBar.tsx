"use client";

import { useEffect, useState } from "react";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.97L2 22l5.17-1.5A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.07.9.92-2.98-.2-.31a8.2 8.2 0 1 1 6.83 3.72Zm4.5-6.14c-.25-.12-1.46-.72-1.69-.8-.22-.08-.39-.12-.55.13-.16.24-.63.8-.77.96-.14.17-.28.19-.53.06a6.7 6.7 0 0 1-3.32-2.9c-.25-.43.25-.4.72-1.33.08-.17.04-.31-.02-.43-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47a.9.9 0 0 0-.65.3 2.74 2.74 0 0 0-.86 2.04 4.76 4.76 0 0 0 1 2.53c.12.16 1.73 2.64 4.19 3.7 1.56.67 2.17.73 2.95.62.48-.07 1.46-.6 1.67-1.18.2-.58.2-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M10 14a4.5 4.5 0 0 0 6.36 0l3.18-3.18a4.5 4.5 0 0 0-6.36-6.36L11.6 6.04" />
      <path d="M14 10a4.5 4.5 0 0 0-6.36 0l-3.18 3.18a4.5 4.5 0 0 0 6.36 6.36l1.58-1.58" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3v12M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
    </svg>
  );
}

/** WhatsApp share (works on phones and WhatsApp Web), copy link, and the system share sheet where the browser has one. */
export function ShareBar({ title, dek, url, compact = false }: { title: string; dek: string; url: string; compact?: boolean }) {
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  // navigator.share only exists in the browser; checking after mount keeps server and client HTML identical.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time capability check
    setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${title}: ${dek}\n\n${url}`)}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link:", url);
    }
  }

  async function nativeShare() {
    try {
      await navigator.share({ title, text: dek, url });
    } catch {
      // The visitor closed the share sheet; nothing to do.
    }
  }

  // .ar-btn spins its icon on hover (an arrow affordance); share icons should stay upright.
  const size = `${compact ? "ar-btn--sm" : ""} [&:hover_svg]:[transform:none]`;

  return (
    <div className="flex flex-wrap items-center gap-[var(--space-2)]" role="group" aria-label="Share this post">
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className={`ar-btn ar-btn--primary ${size}`}
        data-share="whatsapp"
      >
        <WhatsAppIcon />
        Share on WhatsApp
        <span className="sr-only"> (opens WhatsApp)</span>
      </a>
      <button type="button" onClick={copy} className={`ar-btn ar-btn--secondary ${size}`}>
        <LinkIcon />
        <span aria-live="polite">{copied ? "Link copied" : "Copy link"}</span>
      </button>
      {canNativeShare && (
        <button type="button" onClick={nativeShare} className={`ar-btn ar-btn--secondary ${size}`}>
          <ShareIcon />
          More
        </button>
      )}
    </div>
  );
}
