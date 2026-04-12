import {
  ContactSection,
  Header,
  HeroSection,
  MarqueeSection,
  ProjectsSection,
  ServicesSection,
  SiteFooter,
} from "@/components/site";

export default function Home() {
  return (
    <div className="relative isolate overflow-x-hidden text-brand-black">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 atmosphere-grid opacity-25" />
        <div className="absolute -left-28 top-16 h-[24rem] w-[24rem] rounded-full bg-[#ffc6a1] blur-3xl" />
        <div className="absolute -right-20 top-[24%] h-[21rem] w-[21rem] rounded-full bg-[#ff7d3d] blur-3xl" />
        <div className="absolute bottom-[-5rem] left-[35%] h-[16rem] w-[16rem] rounded-full bg-[#ffad83] blur-3xl" />
        <div className="absolute inset-0 texture-noise opacity-20" />
      </div>

      <Header />
      <HeroSection />
      <MarqueeSection />
      <ServicesSection />
      <ProjectsSection />
      <ContactSection />
      <SiteFooter />
    </div>
  );
}
