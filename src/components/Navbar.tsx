import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Moon, Sun, ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";
import averroesIcon from "@/assets/averroes-icon.png";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

  const toggleTheme = () => {
    document.documentElement.classList.add("transitioning");
    setTheme(theme === "dark" ? "light" : "dark");

    setTimeout(() => {
      document.documentElement.classList.remove("transitioning");
    }, 400);
  };

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled
          ? "border-b border-border/40 bg-background/80 backdrop-blur-md shadow-sm py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 relative">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 h-14">
          
          {/* Logo Kolom (Tetap di Kiri) */}
          <div className="flex items-center">
            <a href="#" onClick={scrollToTop} className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/80 bg-white p-2 shadow-sm transition-transform duration-300 group-hover:scale-105 cursor-pointer">
                <img
                  src={averroesIcon}
                  alt="Averroes logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="hidden sm:block">
                <p className="text-lg font-display font-extrabold tracking-tight text-foreground transition-colors group-hover:text-primary cursor-pointer">
                  Averroes
                </p>
              </div>
            </a>
          </div>

          {/* Navigasi Desktop Berbasis Produk (Absolut di Tengah) */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center rounded-full border border-border/40 bg-card/60 p-1 backdrop-blur-sm shadow-sm">
            {[
              { label: "Produk", id: "fitur" },
              { label: "Cara kerja", id: "cara-kerja" },
              { label: "FAQ", id: "faq" },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.id)}
                className="rounded-full px-5 py-1.5 text-sm font-semibold text-muted-foreground transition-all duration-300 hover:bg-background hover:text-foreground hover:shadow-sm"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Kolom Tombol (Tetap di Kanan) */}
          <div className="hidden items-center gap-4 md:flex">
            <button
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border/40 bg-card/60 text-muted-foreground shadow-sm transition-colors hover:bg-background hover:text-foreground hover:shadow-md"
              aria-label="Toggle theme"
            >
              {mounted &&
                (theme === "dark" ? (
                  <Sun size={18} className="text-amber-500" />
                ) : (
                  <Moon size={18} className="text-primary" />
                ))}
            </button>
            <Button 
              onClick={() => scrollToSection("waitlist")} 
              className="group h-10 rounded-full px-6 font-bold shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md"
            >
              Gabung Waitlist
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          {/* Toggle Mobile */}
          <div className="flex shrink-0 items-center gap-3 md:hidden">
            <button
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border/40 bg-card/60 text-muted-foreground shadow-sm transition-colors hover:bg-background hover:text-foreground"
              aria-label="Toggle theme"
            >
              {mounted &&
                (theme === "dark" ? (
                  <Sun size={18} className="text-amber-500" />
                ) : (
                  <Moon size={18} className="text-primary" />
                ))}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/40 bg-primary/10 text-primary shadow-sm transition-all hover:bg-primary/20 active:scale-95"
              aria-label="Open navigation menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Dropdown Mobile Float */}
        {isMobileMenuOpen && (
          <div className="absolute left-4 right-4 top-[calc(100%+0.75rem)] rounded-2xl border border-border/40 bg-card/95 p-4 shadow-2xl backdrop-blur-xl md:hidden animate-fade-in-up">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => scrollToSection("fitur")}
                className="rounded-xl px-4 py-3 text-left text-sm font-semibold text-foreground transition-colors hover:bg-secondary/80"
              >
                Produk
              </button>
              <button
                onClick={() => scrollToSection("cara-kerja")}
                className="rounded-xl px-4 py-3 text-left text-sm font-semibold text-foreground transition-colors hover:bg-secondary/80"
              >
                Cara kerja
              </button>
              <button
                onClick={() => scrollToSection("faq")}
                className="rounded-xl px-4 py-3 text-left text-sm font-semibold text-foreground transition-colors hover:bg-secondary/80"
              >
                FAQ
              </button>
              <Button
                onClick={() => scrollToSection("waitlist")}
                className="mt-2 w-full rounded-xl py-6 font-bold"
              >
                Gabung Waitlist
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
