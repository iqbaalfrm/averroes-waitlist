import { useScrollReveal } from "@/hooks/useScrollReveal";

const steps = [
  {
    number: "01",
    title: "Masuk dari beranda yang ramah",
    description: "User langsung dapat konteks, bukan layar market yang melelahkan.",
  },
  {
    number: "02",
    title: "Belajar sambil menganalisis",
    description: "Kelas, konten, screener, dan market context saling terhubung.",
  },
  {
    number: "03",
    title: "Lanjut ke utility",
    description: "Portofolio dan zakat hadir di flow yang terasa natural.",
  },
];

const HowItWorks = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal({ threshold: 0.2 });
  const { ref: stepsRef, isVisible: stepsVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <section id="cara-kerja" className="relative py-14 md:py-18">
      <div className="container mx-auto px-4">
        <div
          ref={headerRef as React.RefObject<HTMLDivElement>}
          className={`mx-auto mb-10 max-w-3xl text-center scroll-reveal ${headerVisible ? "revealed" : ""}`}
        >
          <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-primary">
            Cara kerja
          </p>
          <h2 className="font-display mt-4 text-4xl font-bold leading-[1] tracking-[-0.04em] text-foreground md:text-5xl">
            Ringkas, jelas, dan gampang diikuti
          </h2>
        </div>

        <div
          ref={stepsRef as React.RefObject<HTMLDivElement>}
          className={`grid gap-4 md:grid-cols-3 stagger-children ${stepsVisible ? "revealed" : ""}`}
        >
          {steps.map((step) => (
            <div key={step.number} className="brand-grid-card p-6">
              <p className="font-display text-5xl font-bold tracking-[-0.08em] text-primary/25">
                {step.number}
              </p>
              <h3 className="mt-5 text-2xl font-extrabold leading-tight text-foreground">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
