import { useState, useEffect } from "react";
import { Users, TrendingUp, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const WaitlistCounter = () => {
  const [count, setCount] = useState(0);
  const [displayCount, setDisplayCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { ref, isVisible } = useScrollReveal({ threshold: 0.3 });

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const { count, error } = await supabase
          .from("waitlist")
          .select("*", { count: "exact", head: true });

        if (!error && count !== null) {
          setCount(count);
        }
      } catch (error) {
        console.error("Error fetching waitlist count:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCount();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("waitlist-counter")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "waitlist" },
        () => {
          setCount((prev) => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Animate count up when visible
  useEffect(() => {
    if (isVisible && count > 0 && displayCount === 0) {
      const duration = 2000;
      const steps = 60;
      const increment = count / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= count) {
          setDisplayCount(count);
          clearInterval(timer);
        } else {
          setDisplayCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isVisible, count, displayCount]);

  // Update display when count changes after initial animation
  useEffect(() => {
    if (displayCount > 0 && count > displayCount) {
      setDisplayCount(count);
    }
  }, [count, displayCount]);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-12 bg-gradient-hero"
    >
      <div className="container mx-auto px-4">
        <div className={`flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 scroll-reveal ${isVisible ? "revealed" : ""}`}>
          {/* Counter */}
          <div className="flex items-center gap-4 text-primary-foreground">
            <div className="w-14 h-14 rounded-2xl bg-primary-foreground/20 flex items-center justify-center">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold">
                {isLoading ? (
                  <span className="inline-block w-20 h-10 bg-primary-foreground/20 rounded animate-pulse" />
                ) : (
                  displayCount.toLocaleString("id-ID")
                )}
                <span className="text-2xl">+</span>
              </p>
              <p className="text-sm opacity-80">Sudah Bergabung</p>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-16 bg-primary-foreground/20" />

          {/* Growth */}
          <div className="flex items-center gap-4 text-primary-foreground">
            <div className="w-14 h-14 rounded-2xl bg-primary-foreground/20 flex items-center justify-center">
              <TrendingUp className="w-7 h-7" />
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold">Bertambah Terus</p>
              <p className="text-sm opacity-80">Setiap harinya</p>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-16 bg-primary-foreground/20" />

          {/* Coming Soon */}
          <div className="flex items-center gap-4 text-primary-foreground">
            <div className="w-14 h-14 rounded-2xl bg-primary-foreground/20 flex items-center justify-center">
              <Clock className="w-7 h-7" />
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold">Coming Soon</p>
              <p className="text-sm opacity-80">Q2 2025</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WaitlistCounter;