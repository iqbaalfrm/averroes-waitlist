import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, X } from "lucide-react";

const StickyCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const shouldShow = window.scrollY > 640;
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
    <div className="safe-area-bottom fixed bottom-0 left-0 right-0 z-40 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:hidden">
      <div className="brand-panel flex items-center gap-3 px-4 py-3 shadow-card">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold text-foreground">Akses Platform Averroes</p>
          <p className="truncate text-xs font-medium text-muted-foreground">
            Ekosistem kripto syariah presisi.
          </p>
        </div>
        <Button onClick={scrollToWaitlist} size="lg" variant="hero" className="px-5">
          Akses Awal
          <ArrowRight className="h-4 w-4" />
        </Button>
        <button
          onClick={() => setIsDismissed(true)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground"
          aria-label="Tutup"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default StickyCTA;
