import { Play, Pause } from "lucide-react";
import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const DemoPreview = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const { ref, isVisible } = useScrollReveal({ threshold: 0.2 });

  const features = [
    { label: "Pantau Portofolio", delay: 0 },
    { label: "Cek Status Syariah", delay: 1 },
    { label: "Hitung Zakat", delay: 2 },
    { label: "Belajar Fiqh", delay: 3 },
  ];

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-16 md:py-24 bg-card islamic-pattern"
    >
      <div className="container mx-auto px-4">
        <div className={`text-center mb-12 scroll-reveal ${isVisible ? "revealed" : ""}`}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/20 text-accent-foreground text-sm font-medium mb-4">
            <Play className="w-4 h-4" />
            Preview
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Lihat Averroes Beraksi
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Pengalaman crypto syariah yang seamless dalam satu genggaman
          </p>
        </div>

        <div className={`max-w-4xl mx-auto scroll-reveal-scale ${isVisible ? "revealed" : ""}`}>
          {/* Demo Container */}
          <div className="relative bg-gradient-to-br from-primary/5 to-gold/5 rounded-3xl p-8 md:p-12 border border-border/50">
            {/* Animated Feature Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {features.map((feature, index) => (
                <div
                  key={feature.label}
                  className={`bg-card rounded-2xl p-4 shadow-soft border border-border/50 text-center transition-all duration-500 ${
                    isPlaying ? "animate-pulse" : ""
                  }`}
                  style={{
                    animationDelay: `${feature.delay * 0.5}s`,
                    animationDuration: "2s",
                  }}
                >
                  <div
                    className={`w-12 h-12 mx-auto rounded-xl mb-3 flex items-center justify-center ${
                      index === 0
                        ? "bg-gradient-hero"
                        : index === 1
                        ? "bg-gradient-gold"
                        : index === 2
                        ? "bg-mint"
                        : "bg-secondary"
                    }`}
                  >
                    <span className="text-xl">
                      {index === 0 ? "📊" : index === 1 ? "✅" : index === 2 ? "💰" : "📚"}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-foreground">{feature.label}</p>
                </div>
              ))}
            </div>

            {/* Animated Flow */}
            <div className="relative h-24 overflow-hidden rounded-2xl bg-muted/50">
              <div
                className={`absolute inset-0 flex items-center ${
                  isPlaying ? "animate-marquee" : ""
                }`}
                style={{
                  animation: isPlaying ? "marquee 10s linear infinite" : "none",
                }}
              >
                <div className="flex gap-8 px-4">
                  {[
                    "🔗 Connect Wallet",
                    "📈 Lihat Portofolio",
                    "🔍 Cek Syariah",
                    "🧮 Hitung Zakat",
                    "📖 Baca Artikel",
                    "✨ Selesai!",
                  ].map((step, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 bg-card px-4 py-2 rounded-full shadow-soft whitespace-nowrap"
                    >
                      <span className="text-sm font-medium text-foreground">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Play/Pause Button */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-soft hover:shadow-hover transition-all duration-300"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 10s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default DemoPreview;