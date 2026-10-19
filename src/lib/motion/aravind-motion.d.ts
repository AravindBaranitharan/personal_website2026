// Types for the design system's motion runtime (aravind-motion.js assigns window.Aravind).
export {};

type Ease = [number, number, number, number];

declare global {
  interface Window {
    Aravind?: {
      version: string;
      motion: {
        init(root?: ParentNode): void;
        replay(root?: ParentNode): void;
        intro(el: HTMLElement, done?: () => void): void;
        cursor(area: HTMLElement): HTMLElement | null;
        ease: Record<"studio" | "glide" | "exit" | "ui" | "overshoot" | "cycle", Ease>;
        reduced: boolean;
      };
    };
  }
}
