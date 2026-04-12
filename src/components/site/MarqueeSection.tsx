import { marqueeText } from "@/content/site";

export function MarqueeSection() {
  return (
    <section className="section-reveal section-delay-2 relative -skew-y-2 overflow-hidden border-y-2 border-black bg-black py-8 sm:py-10">
      <div className="skew-y-2 space-y-2">
        <div className="marquee">
          <div className="marquee-track font-display text-[clamp(2.4rem,10vw,10rem)] leading-[0.86] text-[#FF4D00]">
            <span className="pr-10">{marqueeText.primary}</span>
            <span aria-hidden="true" className="pr-10">
              {marqueeText.primary}
            </span>
          </div>
        </div>
        <div className="marquee">
          <div className="marquee-track marquee-track--reverse font-display text-[clamp(2.3rem,10vw,10rem)] leading-[0.86] text-white/80">
            <span className="pr-10">{marqueeText.secondary}</span>
            <span aria-hidden="true" className="pr-10">
              {marqueeText.secondary}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

