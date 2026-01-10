import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, X } from "lucide-react";

const StickyCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past hero section (approx 600px)
      const shouldShow = window.scrollY > 600;
      
      // Hide when near waitlist section
      const waitlistSection = document.getElementById("waitlist");
      if (waitlistSection) {
        const rect = waitlistSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          setIsVisible(false);
          return;
        }
      }
      
      setIsVisible(shouldShow && !isDismissed);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDismissed]);

  const scrollToWaitlist = () => {
    const element = document.getElementById("waitlist");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden animate-fade-in">
      <div className="bg-background/95 backdrop-blur-lg border-t border-border p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <Button
            onClick={scrollToWaitlist}
            size="lg"
            variant="hero"
            className="flex-1"
          >
            Gabung Waitlist
            <ArrowRight className="ml-1 w-4 h-4" />
          </Button>
          <button
            onClick={() => setIsDismissed(true)}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StickyCTA;