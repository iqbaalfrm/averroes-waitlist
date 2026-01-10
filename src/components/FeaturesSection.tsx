import { 
  Search, 
  TrendingUp, 
  Wallet, 
  Calculator, 
  GraduationCap, 
  BookOpen, 
  MessageCircle, 
  Brain 
} from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const features = [
  {
    icon: Search,
    title: "Screener Syariah",
    description: "Cek status syariah crypto lengkap dengan alasan fiqh muamalah.",
    gradient: "from-primary/20 to-emerald-light/20",
  },
  {
    icon: TrendingUp,
    title: "Pasar Crypto",
    description: "Pantau harga & chart crypto favorit secara real-time.",
    gradient: "from-gold/20 to-gold-light/20",
  },
  {
    icon: Wallet,
    title: "Portofolio Wallet",
    description: "Hubungkan wallet (read-only) dan lihat semua asetmu.",
    gradient: "from-mint to-mint-dark/30",
  },
  {
    icon: Calculator,
    title: "Zakat Otomatis",
    description: "Hitung zakat crypto berdasarkan nishab emas terkini.",
    gradient: "from-primary/20 to-mint",
  },
  {
    icon: GraduationCap,
    title: "Edukasi",
    description: "Kelas online fiqh muamalah & investasi syariah.",
    gradient: "from-gold/20 to-cream",
  },
  {
    icon: BookOpen,
    title: "Pustaka",
    description: "E-library fatwa, artikel, dan riset syariah digital.",
    gradient: "from-emerald-light/20 to-mint",
  },
  {
    icon: MessageCircle,
    title: "Tanya Ahli",
    description: "Chatbot AI untuk pertanyaan seputar fiqh & crypto.",
    gradient: "from-mint to-primary/10",
  },
  {
    icon: Brain,
    title: "Psikologi",
    description: "Tips anti FOMO & manajemen emosi saat berinvestasi.",
    gradient: "from-gold-light/30 to-gold/10",
  },
];

const FeaturesSection = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal({ threshold: 0.3 });
  const { ref: gridRef, isVisible: gridVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <section id="fitur" className="py-20 md:py-28 islamic-pattern relative overflow-hidden">
      {/* Top gradient for smooth transition */}
      <div className="absolute inset-x-0 top-0 h-20 section-gradient-top pointer-events-none" />
      
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div 
          ref={headerRef as React.RefObject<HTMLDivElement>}
          className={`text-center max-w-2xl mx-auto mb-14 md:mb-20 scroll-reveal ${headerVisible ? "revealed" : ""}`}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-mint text-primary text-sm font-medium mb-4">
            Fitur Lengkap
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Semua yang kamu butuhkan,{" "}
            <span className="text-gradient">dalam satu aplikasi</span>
          </h2>
          <p className="text-muted-foreground">
            Dari screener syariah hingga edukasi fiqh muamalah, Averroes hadir untuk 
            membantu perjalanan investasimu sesuai syariah.
          </p>
        </div>

        {/* Features grid */}
        <div 
          ref={gridRef as React.RefObject<HTMLDivElement>}
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 stagger-children ${gridVisible ? "revealed" : ""}`}
        >
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/20 shadow-soft hover:shadow-card hover:-translate-y-2 transition-all duration-500"
            >
              {/* Gradient background */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              <div className="relative z-10">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>

                {/* Content */}
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Bottom gradient for smooth transition */}
      <div className="absolute inset-x-0 bottom-0 h-20 section-gradient-bottom pointer-events-none" />
    </section>
  );
};

export default FeaturesSection;
