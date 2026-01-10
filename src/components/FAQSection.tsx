import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Apakah Averroes bisa trading?",
    answer:
      "Tidak. Averroes fokus pada edukasi & pemantauan portofolio (read-only). Kami tidak menyediakan fitur jual-beli atau trading crypto.",
  },
  {
    question: "Apakah aman?",
    answer:
      "Sangat aman. Averroes bersifat non-custodial, artinya kami tidak pernah menyimpan atau memiliki akses ke private key kamu. Koneksi wallet hanya untuk melihat saldo (read-only).",
  },
  {
    question: "Apa itu Screener Syariah?",
    answer:
      "Screener Syariah adalah fitur untuk mengecek status kehalalan sebuah crypto. Kami menyediakan ringkasan status syariah lengkap dengan alasan dan dalil fiqh muamalah.",
  },
  {
    question: "Kapan rilis?",
    answer:
      "Target beta segera! Daftar waitlist sekarang untuk mendapatkan akses lebih dulu dan notifikasi saat Averroes siap.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-10 md:mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-mint text-primary text-sm font-medium mb-4">
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Pertanyaan yang sering ditanyakan
            </h2>
          </div>

          {/* FAQ Accordion */}
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card rounded-2xl border border-border/50 px-6 shadow-soft hover:shadow-card transition-shadow duration-300 data-[state=open]:border-primary/20"
              >
                <AccordionTrigger className="text-left text-foreground font-semibold py-5 hover:no-underline hover:text-primary transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
