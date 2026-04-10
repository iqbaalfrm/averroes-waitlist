import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Moon, Sun } from "lucide-react";
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
      setIsScrolled(window.scrollY > 16);
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

  const toggleTheme = () => {
    document.documentElement.classList.add("transitioning");
    setTheme(theme === "dark" ? "light" : "dark");

    setTimeout(() => {
      document.documentElement.classList.remove("transitioning");
    }, 400);
  };

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "border-b border-border/80 bg-background/92 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <a href="#" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-white p-2 shadow-soft">
              <img
                src={averroesIcon}
                alt="Averroes logo"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <p className="text-base font-extrabold text-foreground">Averroes</p>
              <p className="text-xs font-medium text-muted-foreground">Waitlist beta</p>
            </div>
          </a>

          <div className="hidden items-center gap-7 md:flex">
            <button
              onClick={() => scrollToSection("fitur")}
              className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              Fitur
            </button>
            <button
              onClick={() => scrollToSection("cara-kerja")}
              className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              Cara kerja
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              FAQ
            </button>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <button
              onClick={toggleTheme}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-card text-foreground transition-colors hover:bg-secondary"
              aria-label="Toggle theme"
            >
              {mounted &&
                (theme === "dark" ? (
                  <Sun size={18} className="text-gold" />
                ) : (
                  <Moon size={18} className="text-primary" />
                ))}
            </button>
            <Button onClick={() => scrollToSection("waitlist")} size="lg" variant="hero">
              Gabung waitlist
            </Button>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-colors hover:bg-secondary"
              aria-label="Toggle theme"
            >
              {mounted &&
                (theme === "dark" ? (
                  <Sun size={18} className="text-gold" />
                ) : (
                  <Moon size={18} className="text-primary" />
                ))}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-foreground"
              aria-label="Open navigation menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="brand-panel mt-3 overflow-hidden md:hidden">
            <div className="flex flex-col gap-2 p-3">
              <button
                onClick={() => scrollToSection("fitur")}
                className="rounded-2xl px-4 py-3 text-left text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                Fitur
              </button>
              <button
                onClick={() => scrollToSection("cara-kerja")}
                className="rounded-2xl px-4 py-3 text-left text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                Cara kerja
              </button>
              <button
                onClick={() => scrollToSection("faq")}
                className="rounded-2xl px-4 py-3 text-left text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                FAQ
              </button>
              <Button
                onClick={() => scrollToSection("waitlist")}
                className="mt-1 w-full"
                size="lg"
                variant="hero"
              >
                Gabung waitlist
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
