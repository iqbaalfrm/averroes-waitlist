import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import averroesLogo from "@/assets/averroes-logo.png";

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

  const toggleTheme = () => {
    // Add transitioning class for smooth animation
    document.documentElement.classList.add('transitioning');
    setTheme(theme === "dark" ? "light" : "dark");
    
    // Remove transitioning class after animation completes
    setTimeout(() => {
      document.documentElement.classList.remove('transitioning');
    }, 400);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-lg shadow-soft"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-1.5 group">
            <div className="w-11 h-11 rounded-xl overflow-hidden shadow-soft group-hover:shadow-hover group-hover:scale-110 transition-all duration-300">
              <img 
                src={averroesLogo} 
                alt="Averroes Logo" 
                className="w-full h-full object-cover group-hover:rotate-6 transition-transform duration-300" 
              />
            </div>
            <span className="font-bold text-xl text-primary group-hover:text-primary/80 transition-colors duration-300">Averroes</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("fitur")}
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Fitur
            </button>
            <button
              onClick={() => scrollToSection("cara-kerja")}
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Cara Kerja
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              FAQ
            </button>
          </div>

          {/* Desktop CTA & Theme Toggle */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground transition-all duration-300 hover:shadow-soft"
              aria-label="Toggle dark mode"
            >
              {mounted && (
                theme === "dark" ? (
                  <Sun size={20} className="text-gold" />
                ) : (
                  <Moon size={20} className="text-primary" />
                )
              )}
            </button>
            <Button onClick={() => scrollToSection("waitlist")} size="lg">
              Gabung Waitlist
            </Button>
          </div>

          {/* Mobile Menu Button & Theme Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-secondary text-foreground transition-colors"
              aria-label="Toggle dark mode"
            >
              {mounted && (
                theme === "dark" ? (
                  <Sun size={20} className="text-gold" />
                ) : (
                  <Moon size={20} className="text-primary" />
                )
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-foreground"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-lg border-b border-border animate-fade-in">
            <div className="flex flex-col p-4 gap-2">
              <button
                onClick={() => scrollToSection("fitur")}
                className="py-3 px-4 text-left text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                Fitur
              </button>
              <button
                onClick={() => scrollToSection("cara-kerja")}
                className="py-3 px-4 text-left text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                Cara Kerja
              </button>
              <button
                onClick={() => scrollToSection("faq")}
                className="py-3 px-4 text-left text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                FAQ
              </button>
              <Button
                onClick={() => scrollToSection("waitlist")}
                className="mt-2"
                size="lg"
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
