import { useState } from "react";
import {
  BookMarked,
  Calculator,
  CandlestickChart,
  GraduationCap,
  Search,
  Wallet,
} from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const steps = [
  {
    id: "learn",
    label: "Pelajari",
    headline: "Pahami dulu barangnya.",
    description: "Belajar fundamental kripto pakai bahasa manusia, bukan bahasa alien. Biar nggak gampang kena FOMO atau ikut-ikutan tren ga jelas.",
    features: [
      { icon: GraduationCap, title: "Belajar Bertahap", subtitle: "Mulai dari nol" },
      { icon: BookMarked, title: "Kajian Nyantai", subtitle: "Bacaan ringan tapi berbobot" },
    ],
  },
  {
    id: "analyze",
    label: "Analisa",
    headline: "Cek bener-tidaknya koin itu.",
    description: "Tinggal cari nama koinnya, biar sistem kami yang deteksi apakah ada unsur judi (maysir) atau tipu-tipu (gharar).",
    features: [
      { icon: Search, title: "Screener Pintar", subtitle: "Bisa selesai dalam detikan" },
      { icon: CandlestickChart, title: "Deteksi Aset", subtitle: "Sinyal buat koin aneh" },
    ],
  },
  {
    id: "act",
    label: "Terapkan",
    headline: "Sambungin dompet, pantau terus.",
    description: "Biarkan kami cuma 'ngintip' dompetmu (read-only) buat ngitungin otomatis berapa rupiah zakat yang bener-bener wajib keluar.",
    features: [
      { icon: Wallet, title: "Sangat Aman", subtitle: "Izin cuma buat baca angka" },
      { icon: Calculator, title: "Hitung Zakat", subtitle: "Bunyi kalau udah kena nisab" },
    ],
  },
];

const FeaturesSection = () => {
  const [activeStep, setActiveStep] = useState(0);
  const { ref: sectionRef, isVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <section id="fitur" className="relative border-b border-border/40 py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4" ref={sectionRef as React.RefObject<HTMLDivElement>}>
        <div className={`mx-auto max-w-3xl text-center scroll-reveal ${isVisible ? "revealed" : ""}`}>
          <p className="inline-flex rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-primary">
            Pusat Kendali
          </p>
          <h2 className="font-display mt-6 text-4xl font-extrabold leading-tight text-foreground md:text-5xl">
            Satu Tempat Buat Semuanya.
          </h2>
        </div>

        <div className={`mt-16 grid gap-10 lg:grid-cols-12 lg:gap-16 scroll-reveal ${isVisible ? "revealed" : ""}`}>
          
          {/* Kolom Kiri: Navigasi Progresi */}
          <div className="relative lg:col-span-5 space-y-4">
            {/* Garis Vertikal Latar */}
            <div className="absolute left-[27px] top-10 bottom-10 hidden w-[2px] bg-border md:block" />

            {steps.map((step, index) => {
              const isActive = activeStep === index;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(index)}
                  className={`group relative flex w-full items-start rounded-2xl border p-5 text-left transition-all duration-300 ${
                    isActive
                      ? "bg-card border-border shadow-card scale-[1.02]"
                      : "border-transparent bg-transparent hover:bg-card/40"
                  }`}
                >
                  <div
                    className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-300 ${
                      isActive
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground/30 bg-background text-muted-foreground group-hover:border-primary/50"
                    }`}
                  >
                    <span className="text-sm font-bold">{index + 1}</span>
                  </div>
                  <div className="ml-5">
                    <p className={`text-sm font-extrabold uppercase tracking-wider mb-1 transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                      {step.label}
                    </p>
                    <h3 className={`font-bold transition-colors ${isActive ? "text-foreground text-xl" : "text-muted-foreground text-lg"}`}>
                      {step.headline}
                    </h3>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Kolom Kanan: Visualisasi Konten Aktif */}
          <div className="lg:col-span-7">
            <div className="h-full min-h-[360px] rounded-[2rem] border border-border bg-gradient-card p-6 md:p-10 transition-all duration-500 flex flex-col justify-center relative overflow-hidden">
              
              {/* Orb Dekoratif Latar */}
              <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />

              <div key={activeStep} className="relative z-10 animate-fade-in-up">
                <p className="text-lg text-muted-foreground mb-8 border-l-2 border-primary pl-4">
                  {steps[activeStep].description}
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                  {steps[activeStep].features.map((feat) => (
                    <div
                      key={feat.title}
                      className="group rounded-2xl border border-border bg-background p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/30"
                    >
                      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                        <feat.icon className="h-6 w-6" />
                      </div>
                      <h4 className="font-extrabold text-foreground">{feat.title}</h4>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {feat.subtitle}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
