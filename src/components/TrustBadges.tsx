import { Shield, TrendingDown, Star, Sparkles } from "lucide-react";

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
  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {badges.map((badge, index) => (
            <div
              key={badge.label}
              className="flex flex-col items-center text-center p-4 md:p-6 rounded-2xl bg-card shadow-soft hover:shadow-card transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
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
    </section>
  );
};

export default TrustBadges;
