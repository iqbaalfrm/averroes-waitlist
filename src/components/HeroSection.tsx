import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import heroPhoneImage from "@/assets/hero-phone.jpg";

const HeroSection = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden bg-background pt-32 pb-16 md:pt-36 md:pb-24 border-b border-border/30">
      {/* Dekorasi Latar - Ambien Premium */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-80 pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto grid max-w-7xl gap-12 lg:gap-16 lg:grid-cols-12 lg:items-center">
          
          {/* Kolom Kiri: Hirarki Tipografi Terfokus (Dominan) */}
          <div className="max-w-2xl lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-primary animate-fade-in-up">
              <span className="text-sm">👋</span> Selamat Datang di Averroes
            </div>

            <h1
              className="mt-6 font-display text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl md:text-7xl leading-[1.05] animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              Mulai Investasi Kripto <br className="hidden md:block"/> Tanpa Rasa Ragu.
            </h1>

            <p
              className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl animate-fade-in-up max-w-xl"
              style={{ animationDelay: "0.2s" }}
            >
              Nggak perlu pusing mikirin halal-haram koin atau ribet ngitung zakat. Averroes bantu kamu <em className="not-italic text-foreground font-semibold">screening</em> portofolio biar investasi makin tenang.
            </p>

            <div
              className="mt-10 flex flex-col sm:flex-row gap-4 animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              <Button onClick={() => scrollToSection("waitlist")} size="xl" variant="hero" className="w-full sm:w-auto shadow-sm transition-transform hover:-translate-y-0.5">
                Mulai Eksplorasi
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div
              className="mt-12 grid gap-4 sm:grid-cols-2 animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              {[
                "Edukasi bahasa manusia",
                "Screener koin transparan",
                "Integrasi dompet (Read-only)",
                "Hitung zakat tinggal pencet",
              ].map((benefit) => (
                <div key={benefit} className="flex items-center gap-3 group">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-sm font-semibold text-foreground/80 transition-colors group-hover:text-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Kolom Kanan: Visual Mockup */}
          <div
            className="relative mx-auto w-full max-w-[20rem] sm:max-w-[22rem] lg:max-w-[24rem] lg:col-span-5 animate-fade-in-up mt-12 lg:mt-0"
            style={{ animationDelay: "0.4s" }}
          >
            {/* Soft Ambient Glow */}
            <div className="absolute inset-0 z-0 bg-primary/20 blur-[80px] rounded-full transform scale-90 opacity-70 pointer-events-none" />
            
            {/* Bodi Gambar Image Nyata */}
            <div className="relative z-10 w-full overflow-hidden rounded-[2rem] border border-border/40 bg-background shadow-2xl shadow-primary/10 transition-transform duration-700 ease-out hover:-translate-y-2 hover:shadow-primary/20">
              <img
                src={heroPhoneImage}
                alt="Averroes App Interface"
                className="w-full h-auto"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
