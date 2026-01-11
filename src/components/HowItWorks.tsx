import { Wallet, LayoutDashboard, BookOpen } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const steps = [
  {
    number: "01",
    icon: Wallet,
    title: "Login Wallet (opsional)",
    description: "Hubungkan wallet crypto kamu secara read-only. Aman, tanpa akses private key.",
  },
  {
    number: "02",
    icon: LayoutDashboard,
    title: "Portofolio muncul otomatis",
    description: "Lihat semua aset crypto kamu dalam satu dashboard yang mudah dipahami.",
  },
  {
    number: "03",
    icon: BookOpen,
    title: "Belajar + Hitung + Cek",
    description: "Akses edukasi fiqh, hitung zakat otomatis, dan cek status syariah setiap aset.",
  },
];

const HowItWorks = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal({ threshold: 0.3 });
  const { ref: stepsRef, isVisible: stepsVisible } = useScrollReveal({ threshold: 0.2 });

  return (
    <section id="cara-kerja" className="py-12 md:py-16 bg-muted/30 relative overflow-hidden">
      {/* Top gradient for smooth transition */}
      <div className="absolute inset-x-0 top-0 h-20 section-gradient-top pointer-events-none" />
      
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div 
          ref={headerRef as React.RefObject<HTMLDivElement>}
          className={`text-center max-w-2xl mx-auto mb-8 md:mb-12 scroll-reveal ${headerVisible ? "revealed" : ""}`}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-gold/20 text-accent-foreground text-sm font-medium mb-4">
            Cara Kerja
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Mulai dalam{" "}
            <span className="text-gradient">3 langkah mudah</span>
          </h2>
          <p className="text-muted-foreground">
            Tidak perlu setup rumit. Cukup beberapa klik dan kamu siap 
            memulai perjalanan investasi syariah.
          </p>
        </div>

        {/* Steps */}
        <div 
          ref={stepsRef as React.RefObject<HTMLDivElement>}
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 stagger-children ${stepsVisible ? "revealed" : ""}`}
        >
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative group"
            >
              {/* Connector line (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/30 to-transparent" />
              )}

              <div className="relative bg-card rounded-2xl p-6 md:p-8 shadow-soft hover:shadow-card hover:-translate-y-2 transition-all duration-500 border border-border/50 hover:border-primary/20">
                {/* Step number */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-5xl font-extrabold text-primary/10 group-hover:text-primary/20 transition-colors duration-300">
                    {step.number}
                  </span>
                  <div className="w-14 h-14 rounded-xl bg-gradient-hero flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform duration-500">
                    <step.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
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

export default HowItWorks;
