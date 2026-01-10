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
  return (
    <section id="fitur" className="py-16 md:py-24 islamic-pattern">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/20 shadow-soft hover:shadow-card transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Gradient background */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />

              <div className="relative z-10">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>

                {/* Content */}
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
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
    </section>
  );
};

export default FeaturesSection;
