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
    <div className="overflow-x-hidden bg-brand-orange text-brand-black">
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
