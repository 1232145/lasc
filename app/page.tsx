import Hero from "@/components/Hero";
import FeaturedEvent from "@/components/FeaturedEvent";
import ContactSection from "@/components/ContactSection";
import AboutSection from "@/components/AboutSection";
import SponsorshipSection from "@/components/SponsorshipSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedEvent />
      <AboutSection />
      <ContactSection />
      <SponsorshipSection />
    </>
  );
}
