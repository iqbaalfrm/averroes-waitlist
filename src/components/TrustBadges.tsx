import { Shield, TrendingDown, Star, Sparkles } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const badges = [
  {
    icon: Shield,
    label: "Non-custodial",
    description: "Kunci pribadi tetap milikmu",
  },
  {
    icon: TrendingDown,
    label: "No trading",
    description: "Fokus edukasi, bukan spekulasi",
  },
  {
    icon: Star,
    label: "Syariah-first",
    description: "Berdasarkan fiqh muamalah",
  },
  {
    icon: Sparkles,
    label: "Gen Z friendly UI",
    description: "Simpel & mudah dipahami",
  },
];

const TrustBadges = () => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.2 });

  return (
    <section 
      ref={ref as React.RefObject<HTMLElement>}
      className="py-12 md:py-16 bg-muted/30 relative overflow-hidden"
    >
      {/* Subtle gradient overlay for smooth section transition */}
      <div className="absolute inset-x-0 top-0 h-16 section-gradient-top pointer-events-none" />
      
      <div className="container mx-auto px-4">
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 stagger-children ${isVisible ? "revealed" : ""}`}>
          {badges.map((badge) => (
            <div
              key={badge.label}
              className="flex flex-col items-center text-center p-4 md:p-6 rounded-2xl bg-card shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-500"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-mint flex items-center justify-center mb-3">
                <badge.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{badge.label}</h3>
              <p className="text-xs text-muted-foreground">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="absolute inset-x-0 bottom-0 h-16 section-gradient-bottom pointer-events-none" />
    </section>
  );
};

export default TrustBadges;
