import { MotionInit } from "@/components/chrome/MotionInit";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Notes } from "@/components/sections/Notes";
import { Recognition } from "@/components/sections/Recognition";
import { Services } from "@/components/sections/Services";
import { Work } from "@/components/sections/Work";

// Chapter order follows the design system's blueprint: wash hero → paper about → band services →
// night work (the one dark chapter) → paper experience → band recognition and notes. The footer is the contact chapter.
export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <Work />
      <Experience />
      <Recognition />
      <Notes />
      <MotionInit />
    </>
  );
}
