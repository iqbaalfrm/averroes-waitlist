import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
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
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-hero flex items-center justify-center shadow-soft group-hover:shadow-hover transition-all duration-300">
              <span className="text-primary-foreground font-bold text-lg">A</span>
            </div>
            <span className="font-bold text-xl text-foreground">Averroes</span>
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

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Button onClick={() => scrollToSection("waitlist")} size="lg">
              Gabung Waitlist
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-foreground"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
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
