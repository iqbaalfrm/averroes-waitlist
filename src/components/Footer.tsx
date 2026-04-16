import averroesIcon from "@/assets/averroes-icon.png";
import { ArrowRight, Sparkles } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-border/40 bg-card/30 pt-16 pb-8 md:pt-20 lg:pt-24">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-4 lg:gap-8">
          
          {/* Brand & Positioning */}
          <div className="lg:col-span-2">
            <a href="#" onClick={scrollToTop} className="inline-flex items-center gap-3 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border/80 bg-white p-2 shadow-sm transition-transform duration-300 group-hover:scale-105">
                <img
                  src={averroesIcon}
                  alt="Averroes logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <p className="text-xl font-display font-extrabold tracking-tight text-foreground">Averroes</p>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-primary" />
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-primary">
                    Sistem Investasi Syariah
                  </p>
                </div>
              </div>
            </a>

            <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-base">
              Navigasi tunggal ekosistem investasi syariah:{" "}
              <span className="font-semibold text-foreground transition-colors hover:text-primary">Pelajari</span> fundamentalnya,{" "}
              <span className="font-semibold text-foreground transition-colors hover:text-primary">Analisa</span> kepatuhan asetnya, dan{" "}
              <span className="font-semibold text-foreground transition-colors hover:text-primary">Terapkan</span> manajemen risikonya.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="mb-6 text-xs font-extrabold uppercase tracking-widest text-foreground">
              Produk Platform
            </h4>
            <ul className="space-y-4">
              <li>
                <a 
                  href="#cara-kerja" 
                  onClick={(e) => scrollToSection("cara-kerja", e)} 
                  className="inline-block text-sm font-medium text-muted-foreground transition-all duration-300 hover:translate-x-1 hover:text-primary"
                >
                  Siklus Ekosistem
                </a>
              </li>
              <li>
                <a 
                  href="#fitur" 
                  onClick={(e) => scrollToSection("fitur", e)} 
                  className="inline-block text-sm font-medium text-muted-foreground transition-all duration-300 hover:translate-x-1 hover:text-primary"
                >
                  Screener Kepatuhan
                </a>
              </li>
              <li>
                <a 
                  href="#fitur" 
                  onClick={(e) => scrollToSection("fitur", e)} 
                  className="inline-block text-sm font-medium text-muted-foreground transition-all duration-300 hover:translate-x-1 hover:text-primary"
                >
                  Manajemen & Zakat
                </a>
              </li>
            </ul>
          </div>

          {/* Soft CTA & Resources */}
          <div>
            <h4 className="mb-6 text-xs font-extrabold uppercase tracking-widest text-foreground">
              Akses Sistem
            </h4>
            <p className="mb-4 text-sm text-muted-foreground">
              Bersiap untuk portofolio yang bersih dan terukur.
            </p>
            <button 
              onClick={(e) => scrollToSection("waitlist", e)}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold shadow-sm text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-md hover:shadow-primary/20 sm:w-auto"
            >
              Buka Akses Pra-Rilis
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            
            <div className="mt-8 flex gap-5">
               <a 
                 href="#faq" 
                 onClick={(e) => scrollToSection("faq", e)} 
                 className="text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground hover:underline hover:underline-offset-4"
               >
                 Pusat Bantuan
               </a>
               <a 
                 href="mailto:hello@averroes.app" 
                 className="text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground hover:underline hover:underline-offset-4"
               >
                 Kontak Tim
               </a>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 sm:mt-24 md:flex-row">
          <p className="text-center text-xs font-medium text-muted-foreground md:text-left">
            &copy; {currentYear} Averroes Ecosystem. All rights reserved.
          </p>
          <div className="flex gap-6">
             <a href="#" className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
               Kebijakan Privasi
             </a>
             <a href="#" className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
               Ketentuan Layanan
             </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
