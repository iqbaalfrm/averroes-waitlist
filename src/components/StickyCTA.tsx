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
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden animate-fade-in safe-area-bottom">
      <div className="bg-background/95 backdrop-blur-lg border-t border-border p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-lg">
        <div className="flex items-center gap-3">
          <Button
            onClick={scrollToWaitlist}
            size="lg"
            variant="hero"
            className="flex-1 active:scale-[0.98] transition-transform touch-manipulation"
          >
            Gabung Waitlist
            <ArrowRight className="ml-1 w-4 h-4" />
          </Button>
          <button
            onClick={() => setIsDismissed(true)}
            className="p-3 -m-1 text-muted-foreground hover:text-foreground active:scale-95 transition-all touch-manipulation"
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