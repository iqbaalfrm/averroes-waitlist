import {
  BookMarked,
  Bot,
  Calculator,
  CandlestickChart,
  GraduationCap,
  Search,
  Wallet,
} from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const sections = [
  {
    title: "Learn",
    description: "Masuk dari edukasi dan konten yang lebih ringan untuk diikuti.",
    items: [
      { icon: GraduationCap, title: "LMS", text: "kelas, modul, progress, kuis" },
      { icon: BookMarked, title: "Pustaka dan reels", text: "konten panjang dan pendek dalam satu ritme" },
    ],
  },
  {
    title: "Analyze",
    description: "Bantu user memahami aset sebelum mengambil keputusan.",
    items: [
      { icon: Search, title: "Screener syariah", text: "fungsi aset dan konteks muamalah" },
      { icon: CandlestickChart, title: "Pasar dan chatbot", text: "market context dan jawaban cepat" },
    ],
  },
  {
    title: "Act",
    description: "Lanjut ke utility yang relevan setelah user sudah paham.",
    items: [
      { icon: Wallet, title: "Portofolio", text: "pantau aset dengan model read-only" },
      { icon: Calculator, title: "Zakat", text: "utility syariah yang langsung berguna" },
    ],
  },
];

const FeaturesSection = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal({ threshold: 0.2 });
  const { ref: gridRef, isVisible: gridVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <section id="fitur" className="relative py-14 md:py-18">
      <div className="container mx-auto px-4">
        <div
          ref={headerRef as React.RefObject<HTMLDivElement>}
          className={`mx-auto mb-10 max-w-3xl text-center scroll-reveal ${headerVisible ? "revealed" : ""}`}
        >
          <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-primary">
            Struktur produk
          </p>
          <h2 className="font-display mt-4 text-4xl font-bold leading-[1] tracking-[-0.04em] text-foreground md:text-5xl">
            Tiga layer utama, tanpa layout yang berlebihan
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
            Susunan produknya dibuat sederhana supaya cepat dipahami user dan tetap jelas
            di mata investor.
          </p>
        </div>

        <div
          ref={gridRef as React.RefObject<HTMLDivElement>}
          className={`grid gap-4 md:grid-cols-3 stagger-children ${gridVisible ? "revealed" : ""}`}
        >
          {sections.map((section) => (
            <div key={section.title} className="brand-grid-card p-6">
              <h3 className="font-display text-3xl font-bold text-foreground">
                {section.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {section.description}
              </p>

              <div className="mt-6 space-y-4 border-t border-border pt-5">
                {section.items.map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <span className="brand-icon h-10 w-10 shrink-0 rounded-2xl">
                      <item.icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-extrabold text-foreground">{item.title}</p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
