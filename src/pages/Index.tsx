import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WaitlistCounter from "@/components/WaitlistCounter";
import TrustBadges from "@/components/TrustBadges";
import FeaturesSection from "@/components/FeaturesSection";
import DemoPreview from "@/components/DemoPreview";
import HowItWorks from "@/components/HowItWorks";
import TestimonialSection from "@/components/TestimonialSection";
import WaitlistSection from "@/components/WaitlistSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import StickyCTA from "@/components/StickyCTA";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <WaitlistCounter />
        <TrustBadges />
        <FeaturesSection />
        <DemoPreview />
        <HowItWorks />
        <TestimonialSection />
        <WaitlistSection />
        <FAQSection />
      </main>
      <Footer />
      <StickyCTA />
    </div>
  );
};

export default Index;
