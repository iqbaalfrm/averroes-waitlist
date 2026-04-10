import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useParallax } from "@/hooks/useParallax";
import heroPhoneImage from "@/assets/hero-phone.jpg";

const HeroSection = () => {
  const { offset: offset1 } = useParallax({ speed: 0.08 });
  const { offset: offset2 } = useParallax({ speed: 0.12 });

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="brand-shell relative overflow-hidden pb-14 pt-28 md:pb-20 md:pt-36">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -left-12 top-20 h-32 w-32 rounded-full bg-gold-light/35 blur-3xl transition-transform duration-100"
          style={{ transform: `translateY(${offset1}px)` }}
        />
        <div
          className="absolute right-0 top-14 h-44 w-44 rounded-full bg-mint-dark/28 blur-3xl transition-transform duration-100"
          style={{ transform: `translateY(${offset2}px)` }}
        />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-center">
          <div className="max-w-xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-primary animate-fade-in-up">
              Averroes beta
            </p>

            <h1
              className="font-display mt-6 text-5xl font-bold leading-[0.96] tracking-[-0.05em] text-foreground sm:text-6xl lg:text-[4.2rem] animate-fade-in-up"
              style={{ animationDelay: "0.08s" }}
            >
              Aset digital syariah
              <br />
              yang lebih tenang
              <br />
              untuk dipahami.
            </h1>

            <p
              className="mt-5 max-w-lg text-base leading-8 text-muted-foreground sm:text-lg animate-fade-in-up"
              style={{ animationDelay: "0.16s" }}
            >
              Averroes menyatukan edukasi, screening syariah, portofolio, dan
              kalkulator zakat dalam pengalaman produk yang lebih ringkas dan lebih
              mudah dipahami.
            </p>

            <div
              className="mt-8 flex flex-wrap items-center gap-3 animate-fade-in-up"
              style={{ animationDelay: "0.24s" }}
            >
              <Button onClick={() => scrollToSection("waitlist")} size="xl" variant="hero">
                Masuk waitlist
                <ArrowRight className="ml-1" />
              </Button>
              <Button onClick={() => scrollToSection("fitur")} size="xl" variant="outline">
                Lihat produk
              </Button>
            </div>
          </div>

          <div
            className="relative mx-auto w-full max-w-[312px] animate-fade-in-up lg:ml-auto"
            style={{ animationDelay: "0.18s" }}
          >
            <div className="absolute inset-x-8 top-20 h-20 rounded-full bg-primary/8 blur-3xl" />
            <div className="relative mx-auto w-full max-w-[300px]">
              <div className="rounded-[2.85rem] border-[7px] border-slate-900 bg-slate-900 p-[7px] shadow-[0_24px_50px_-28px_rgba(15,23,42,0.38)]">
                <div className="overflow-hidden rounded-[2.5rem] bg-card">
                  <div className="flex justify-center pt-3">
                    <div className="h-1.5 w-24 rounded-full bg-foreground/12" />
                  </div>

                  <div className="px-3 pb-3 pt-2">
                    <div className="overflow-hidden rounded-[2.1rem] border border-border bg-background shadow-soft [aspect-ratio:367/890]">
                      <img
                        src={heroPhoneImage}
                        alt="Preview aplikasi Averroes"
                        className="h-full w-full object-cover object-top"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
