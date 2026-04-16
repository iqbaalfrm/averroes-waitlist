import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorks from "@/components/HowItWorks";
import WaitlistSection from "@/components/WaitlistSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import StickyCTA from "@/components/StickyCTA";
import ScrollToTopButton from "@/components/ScrollToTopButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="space-y-0">
        <HeroSection />
        <FeaturesSection />
        <HowItWorks />
        <WaitlistSection />
        <FAQSection />
      </main>
      <Footer />
      <StickyCTA />
      <ScrollToTopButton />
    </div>
  );
};

export default Index;
