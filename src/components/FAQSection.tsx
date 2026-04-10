import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BookOpen,
  Calculator,
  Clock,
  Globe,
  Search,
  Shield,
  Sparkles,
  Wallet,
} from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const faqs = [
  {
    question: "Apakah bisa trading langsung di Averroes?",
    answer:
      "Tidak. Averroes fokus pada edukasi, screening syariah, dan pemantauan portofolio read-only. Untuk jual beli, pengguna tetap memakai exchange atau wallet yang mereka pilih sendiri.",
    icon: Wallet,
    category: "Fitur",
  },
  {
    question: "Bagaimana Averroes menjaga keamanan data saya?",
    answer:
      "Averroes tidak menyimpan private key atau seed phrase. Jika wallet dihubungkan, perannya hanya read-only untuk membaca data aset yang relevan.",
    icon: Shield,
    category: "Keamanan",
  },
  {
    question: "Bagaimana cara kerja screener syariah?",
    answer:
      "Screener syariah menganalisis aset dari sisi fungsi, mekanisme, dan konteks muamalahnya. Output utamanya berupa status serta penjelasan ringkas yang lebih mudah dipahami pengguna.",
    icon: Search,
    category: "Fitur",
  },
  {
    question: "Bagaimana cara menghitung zakat crypto?",
    answer:
      "Averroes menyiapkan kalkulator zakat yang membantu membaca nilai aset, nisab, dan estimasi kewajiban 2.5 persen sesuai konteks yang digunakan produk.",
    icon: Calculator,
    category: "Fitur",
  },
  {
    question: "Apa pembeda Averroes dari aplikasi crypto lain?",
    answer:
      "Pembeda utamanya ada pada fokus syariah, edukasi, dan ritme antarmuka yang lebih tenang. Produk ini tidak dibangun untuk mendorong trading agresif.",
    icon: Sparkles,
    category: "Umum",
  },
  {
    question: "Apakah tersedia dalam Bahasa Indonesia?",
    answer:
      "Ya. Bahasa Indonesia menjadi bahasa utama agar materi edukasi dan penjelasan syariah lebih mudah diakses pengguna lokal.",
    icon: Globe,
    category: "Umum",
  },
  {
    question: "Apakah ada konten edukasinya?",
    answer:
      "Ada. Repo Averroes saat ini sudah memuat LMS dengan kelas, modul, materi, kuis, progress, sertifikat, pustaka digital, reels, dan kajian video.",
    icon: BookOpen,
    category: "Fitur",
  },
  {
    question: "Kapan Averroes akan launching?",
    answer:
      "Saat ini fokusnya masih pada waitlist dan persiapan beta. Pengguna yang masuk waitlist akan menjadi pihak pertama yang dihubungi ketika batch akses berikutnya dibuka.",
    icon: Clock,
    category: "Umum",
  },
];

const FAQSection = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal({ threshold: 0.3 });
  const { ref: contentRef, isVisible: contentVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <section id="faq" className="relative py-14 md:py-18">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <div
            ref={headerRef as React.RefObject<HTMLDivElement>}
            className={`mb-8 scroll-reveal ${headerVisible ? "revealed" : ""}`}
          >
            <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-primary">
              FAQ
            </p>
            <h2 className="mt-4 max-w-2xl text-3xl font-extrabold leading-tight text-foreground md:text-4xl">
              Pertanyaan umum tentang Averroes
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
              Jawaban singkat untuk hal-hal yang paling sering ingin dipahami sebelum
              user masuk waitlist.
            </p>
          </div>

          <div
            ref={contentRef as React.RefObject<HTMLDivElement>}
            className={`scroll-reveal ${contentVisible ? "revealed" : ""}`}
          >
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, index) => {
                const IconComponent = faq.icon;

                return (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="brand-grid-card overflow-hidden border-none px-0"
                  >
                    <AccordionTrigger className="gap-4 px-5 py-5 text-left hover:no-underline sm:px-6">
                      <div className="flex flex-1 items-start gap-4">
                        <div className="brand-icon h-11 w-11 shrink-0 rounded-2xl">
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-muted-foreground">
                            {faq.category}
                          </span>
                          <p className="mt-2 text-base font-extrabold leading-7 text-foreground sm:text-xl">
                            {faq.question}
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-5 pb-6 sm:px-6 sm:pl-[5.5rem]">
                      <p className="text-sm leading-7 text-muted-foreground sm:text-base">
                        {faq.answer}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>

            <div className="brand-panel mt-6 p-6">
              <p className="text-sm font-semibold text-muted-foreground">
                Masih ada pertanyaan lain?
              </p>
              <a
                href="mailto:hello@averroes.app"
                className="mt-3 inline-flex items-center gap-2 text-sm font-extrabold text-primary hover:underline"
              >
                Hubungi kami
                <span aria-hidden="true">-&gt;</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
