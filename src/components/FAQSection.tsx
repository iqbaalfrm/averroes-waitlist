import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Shield, Wallet, Search, Clock, HelpCircle } from "lucide-react";

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

  const filteredFaqs = activeCategory === "Semua" 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory);

  return (
    <section id="faq" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-8 md:mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mint text-primary text-sm font-medium mb-4">
              <HelpCircle className="w-4 h-4" />
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Pertanyaan yang Sering Ditanyakan
            </h2>
            <p className="text-muted-foreground">
              Temukan jawaban untuk pertanyaan umum tentang Averroes
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
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
                  className="bg-card rounded-2xl border border-border/50 px-6 shadow-soft hover:shadow-card transition-all duration-300 data-[state=open]:border-primary/30 data-[state=open]:shadow-card group"
                >
                  <AccordionTrigger className="text-left text-foreground font-semibold py-5 hover:no-underline gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-mint/50 flex items-center justify-center shrink-0 group-data-[state=open]:bg-primary group-data-[state=open]:text-primary-foreground transition-colors duration-300">
                        <IconComponent className="w-5 h-5 text-primary group-data-[state=open]:text-primary-foreground" />
                      </div>
                      <div className="flex flex-col items-start gap-1">
                        <span className="text-xs text-muted-foreground font-normal">{faq.category}</span>
                        <span className="group-hover:text-primary transition-colors">{faq.question}</span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5 pl-14 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>

          {/* Contact CTA */}
          <div className="mt-10 text-center p-6 bg-card rounded-2xl border border-border/50 shadow-soft">
            <p className="text-muted-foreground mb-2">
              Masih punya pertanyaan lain?
            </p>
            <a 
              href="mailto:hello@averroes.app" 
              className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
            >
              Hubungi kami
              <span className="text-lg">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
