import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, BookOpen, Eye } from "lucide-react";

const HeroSection = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden islamic-pattern">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-[10%] w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-[5%] w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-mint/30 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mint border border-primary/10 mb-6 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-foreground">
              Crypto Syariah & Keuangan Islami
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Crypto Syariah,{" "}
            <span className="text-gradient">Lebih Tenang & Terarah.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Pantau portofolio wallet (read-only), cek status syariah, hitung zakat, 
            belajar fiqh muamalah—dalam satu aplikasi.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Button
              onClick={() => scrollToSection("waitlist")}
              size="xl"
              variant="hero"
              className="w-full sm:w-auto"
            >
              Gabung Waitlist
              <ArrowRight className="ml-1" />
            </Button>
            <Button
              onClick={() => scrollToSection("fitur")}
              size="xl"
              variant="outline"
              className="w-full sm:w-auto"
            >
              Lihat Fitur
            </Button>
          </div>

          {/* Trust microcopy */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm text-muted-foreground animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span>Tanpa transaksi</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" />
              <span>Read-only</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              <span>Edukasi berbasis fiqh muamalah</span>
            </div>
          </div>
        </div>

        {/* App Mockup */}
        <div className="mt-16 md:mt-20 max-w-md mx-auto animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          <div className="relative">
            {/* Phone frame */}
            <div className="bg-foreground/5 backdrop-blur-sm rounded-[2.5rem] p-3 shadow-card">
              <div className="bg-card rounded-[2rem] overflow-hidden shadow-soft">
                {/* Phone notch */}
                <div className="h-7 bg-muted flex items-center justify-center">
                  <div className="w-20 h-5 bg-foreground/10 rounded-full" />
                </div>
                
                {/* App content */}
                <div className="p-5 space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Selamat Siang 👋</p>
                      <p className="font-semibold text-foreground">Ahmad</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center">
                      <span className="text-primary-foreground font-bold text-sm">A</span>
                    </div>
                  </div>

                  {/* Prayer Cards */}
                  <div className="space-y-3">
                    {/* Jakarta */}
                    <div className="bg-gradient-hero rounded-2xl p-4 text-primary-foreground">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs opacity-80">📍 Jakarta</p>
                          <p className="text-2xl font-bold mt-1">12:15</p>
                          <p className="text-sm opacity-80">Dzuhur</p>
                        </div>
                        <div className="text-right text-xs opacity-70">
                          <p>Ashar: 15:28</p>
                          <p>Maghrib: 17:58</p>
                        </div>
                      </div>
                    </div>

                    {/* Mekkah */}
                    <div className="bg-gradient-gold rounded-2xl p-4 text-accent-foreground">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs opacity-80">🕋 Mekkah</p>
                          <p className="text-2xl font-bold mt-1">08:15</p>
                          <p className="text-sm opacity-80">Dhuha</p>
                        </div>
                        <div className="text-right text-xs opacity-70">
                          <p>Dzuhur: 12:18</p>
                          <p>Ashar: 15:38</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick stats */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-muted rounded-xl p-3 text-center">
                      <p className="text-lg font-bold text-primary">✓</p>
                      <p className="text-[10px] text-muted-foreground">Syariah</p>
                    </div>
                    <div className="bg-muted rounded-xl p-3 text-center">
                      <p className="text-lg font-bold text-foreground">2.5%</p>
                      <p className="text-[10px] text-muted-foreground">Zakat</p>
                    </div>
                    <div className="bg-muted rounded-xl p-3 text-center">
                      <p className="text-lg font-bold text-foreground">12</p>
                      <p className="text-[10px] text-muted-foreground">Kelas</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -left-4 top-1/4 bg-card rounded-xl px-3 py-2 shadow-card animate-float">
              <p className="text-xs font-medium text-primary">🔒 Non-custodial</p>
            </div>
            <div className="absolute -right-4 top-1/2 bg-card rounded-xl px-3 py-2 shadow-card animate-float" style={{ animationDelay: "0.5s" }}>
              <p className="text-xs font-medium text-foreground">✨ Syariah-first</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
