import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Shield, Wallet, Search, Clock, HelpCircle, Calculator, Sparkles, Globe, BookOpen } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const faqs = [
  {
    question: "Apakah bisa trading langsung di Averroes?",
    answer:
      "Averroes bukan platform trading. Kami fokus membantu kamu memahami dunia crypto dari perspektif syariah — mulai dari edukasi, screening kehalalan, hingga pantau portofolio. Untuk jual-beli, kamu tetap pakai exchange favoritmu.",
    icon: Wallet,
    category: "Fitur",
  },
  {
    question: "Bagaimana Averroes menjaga keamanan data saya?",
    answer:
      "Averroes bersifat non-custodial — kami tidak pernah menyimpan private key atau seed phrase kamu. Koneksi wallet hanya bersifat read-only untuk melihat saldo. Asetmu tetap 100% dalam kendalimu.",
    icon: Shield,
    category: "Keamanan",
  },
  {
    question: "Bagaimana cara kerja Screener Syariah?",
    answer:
      "Screener Syariah menganalisis setiap crypto berdasarkan aspek teknologi, use case, dan mekanisme operasionalnya. Hasilnya berupa status kehalalan beserta penjelasan detail dan dalil fiqh muamalah yang mudah dipahami.",
    icon: Search,
    category: "Fitur",
  },
  {
    question: "Bagaimana cara menghitung zakat crypto?",
    answer:
      "Averroes menyediakan kalkulator zakat otomatis yang menghitung berdasarkan nilai portofolio crypto kamu. Kami mengikuti pendapat ulama bahwa crypto yang memenuhi nisab (setara 85 gram emas) dan haul (1 tahun kepemilikan) wajib dizakati 2.5%.",
    icon: Calculator,
    category: "Fitur",
  },
  {
    question: "Apa bedanya Averroes dengan aplikasi crypto lainnya?",
    answer:
      "Averroes adalah satu-satunya platform yang menggabungkan analisis crypto dengan perspektif syariah Islam. Selain fitur standar seperti tracking portofolio, kami menyediakan screener kehalalan, kalkulator zakat, dan konten edukasi fiqh muamalah yang tidak ada di aplikasi lain.",
    icon: Sparkles,
    category: "Umum",
  },
  {
    question: "Apakah tersedia dalam Bahasa Indonesia?",
    answer:
      "Tentu! Averroes dibangun khusus untuk komunitas Muslim Indonesia. Seluruh interface, konten edukasi, dan dalil-dalil fiqh disajikan dalam Bahasa Indonesia yang mudah dipahami. Ke depannya, kami juga akan mendukung bahasa lainnya.",
    icon: Globe,
    category: "Umum",
  },
  {
    question: "Apakah ada konten edukasinya?",
    answer:
      "Ada! Averroes menyediakan perpustakaan edukasi lengkap tentang crypto syariah, mulai dari dasar-dasar blockchain, prinsip fiqh muamalah dalam aset digital, hingga panduan praktis investasi halal. Semua disusun oleh tim yang memahami crypto dan syariah.",
    icon: BookOpen,
    category: "Fitur",
  },
  {
    question: "Kapan Averroes akan launching?",
    answer:
      "Kami sedang dalam tahap pengembangan intensif dan target beta sudah di depan mata! Gabung waitlist sekarang untuk jadi yang pertama mencoba dan dapatkan benefit eksklusif sebagai early adopter.",
    icon: Clock,
    category: "Umum",
  },
];

const categories = ["Semua", "Fitur", "Keamanan", "Umum"];

const FAQSection = () => {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal({ threshold: 0.3 });
  const { ref: contentRef, isVisible: contentVisible } = useScrollReveal({ threshold: 0.1 });

  const filteredFaqs = activeCategory === "Semua" 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory);

  return (
    <section id="faq" className="py-20 md:py-28 bg-muted/30 relative overflow-hidden">
      {/* Top gradient for smooth transition */}
      <div className="absolute inset-x-0 top-0 h-20 section-gradient-top pointer-events-none" />
      
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Section header */}
          <div 
            ref={headerRef as React.RefObject<HTMLDivElement>}
            className={`text-center mb-8 md:mb-10 scroll-reveal ${headerVisible ? "revealed" : ""}`}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mint text-primary text-sm font-medium mb-4">
              <HelpCircle className="w-4 h-4" />
              FAQ
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">
              Pertanyaan yang Sering Ditanyakan
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Temukan jawaban untuk pertanyaan umum tentang Averroes
            </p>
          </div>

          {/* Category Filter */}
          <div 
            ref={contentRef as React.RefObject<HTMLDivElement>}
            className={`scroll-reveal ${contentVisible ? "revealed" : ""}`}
          >
            <div className="flex flex-wrap justify-center gap-2 mb-8 px-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 active:scale-95 touch-manipulation ${
                    activeCategory === category
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-card text-muted-foreground hover:bg-secondary hover:text-foreground border border-border/50"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* FAQ Accordion */}
            <Accordion type="single" collapsible className="space-y-3">
              {filteredFaqs.map((faq, index) => {
                const IconComponent = faq.icon;
                return (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="bg-card rounded-2xl border border-border/50 px-4 sm:px-6 shadow-soft hover:shadow-card transition-all duration-300 data-[state=open]:border-primary/30 data-[state=open]:shadow-card group"
                  >
                    <AccordionTrigger className="text-left text-foreground font-semibold py-4 sm:py-5 hover:no-underline gap-3 sm:gap-4">
                      <div className="flex items-center gap-3 sm:gap-4 flex-1">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-mint/50 flex items-center justify-center shrink-0 group-data-[state=open]:bg-primary group-data-[state=open]:text-primary-foreground transition-colors duration-300">
                          <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-primary group-data-[state=open]:text-primary-foreground" />
                        </div>
                        <div className="flex flex-col items-start gap-0.5 sm:gap-1">
                          <span className="text-[10px] sm:text-xs text-muted-foreground font-normal">{faq.category}</span>
                          <span className="text-sm sm:text-base group-hover:text-primary transition-colors leading-tight">{faq.question}</span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4 sm:pb-5 pl-12 sm:pl-14 leading-relaxed text-sm sm:text-base">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>

            {/* Contact CTA */}
            <div className="mt-10 text-center p-5 sm:p-6 bg-card rounded-2xl border border-border/50 shadow-soft">
              <p className="text-muted-foreground mb-2 text-sm sm:text-base">
                Masih punya pertanyaan lain?
              </p>
              <a 
                href="mailto:hello@averroes.app" 
                className="inline-flex items-center gap-2 text-primary font-medium hover:underline active:scale-95 transition-transform touch-manipulation"
              >
                Hubungi kami
                <span className="text-lg">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom gradient for smooth transition */}
      <div className="absolute inset-x-0 bottom-0 h-20 section-gradient-bottom pointer-events-none" />
    </section>
  );
};

export default FAQSection;
