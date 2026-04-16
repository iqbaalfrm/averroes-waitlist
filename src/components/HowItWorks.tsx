import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ArrowRight, BookOpen, Search, Wallet } from "lucide-react";

const steps = [
  {
    id: "learn",
    number: "1",
    label: "Ngerti",
    title: "Pahami Dasarnya",
    description: "Nggak perlu mantengin buku tebal. Kami rangkum semuanya sehari-hari biar otak gampang nangkep konteks teknologinya.",
    icon: BookOpen,
  },
  {
    id: "analyze",
    number: "2",
    label: "Validasi",
    title: "Cek Status Halal",
    description: "Ketik nama koinnya, dan biarkan kami nyari tahu langsung: murni utilitas blockchain atau cuma skema ponzi belaka.",
    icon: Search,
  },
  {
    id: "act",
    number: "3",
    label: "Eksekusi",
    title: "Otomasi Dasbor",
    description: "Satu wadah buat ngecek persentase kriptomu. Tenang, rapi, dan dikasih tanda otomatis kapan waktunya kamu keluar zakat.",
    icon: Wallet,
  },
];

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);
  const { ref: sectionRef, isVisible } = useScrollReveal({ threshold: 0.15 });

  return (
    <section id="cara-kerja" className="relative border-b border-border/40 bg-background py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4" ref={sectionRef as React.RefObject<HTMLDivElement>}>
        <div
          className={`mx-auto mb-16 max-w-3xl text-center scroll-reveal ${isVisible ? "revealed" : ""}`}
        >
          <p className="inline-flex rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-primary">
            Cuma Tiga Langkah
          </p>
          <h2 className="font-display mt-6 text-4xl font-extrabold leading-tight text-foreground md:text-5xl">
            Nggak Pake Ribet.
          </h2>
        </div>

        {/* Horizontal Flow Container */}
        <div className={`relative mx-auto max-w-5xl scroll-reveal ${isVisible ? "revealed" : ""}`}>
           
           {/* Garis Konektor Horizontal (Khusus Desktop) */}
           <div className="absolute top-[3rem] left-[15%] right-[15%] hidden h-[2px] bg-border md:block" />

           <div className="grid gap-12 md:grid-cols-3 relative z-10 md:gap-6">
              {steps.map((step, index) => {
                const isActive = activeStep === index;
                const IconComponent = step.icon;
                
                return (
                  <div 
                    key={step.id} 
                    onMouseEnter={() => setActiveStep(index)}
                    onClick={() => setActiveStep(index)}
                    className="relative cursor-pointer group outline-none"
                  >
                     {/* Step Node */}
                     <div className="flex flex-col items-center text-center">
                        <div 
                           className={`relative flex h-24 w-24 items-center justify-center rounded-3xl border bg-background transition-all duration-500 ease-out
                           ${isActive ? 'border-primary shadow-xl shadow-primary/10 scale-110' : 'border-border/60 group-hover:border-primary/40 group-hover:scale-105'}`}
                        >
                           <IconComponent className={`h-8 w-8 transition-colors duration-500 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                           <span className={`absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-extrabold tracking-widest transition-colors duration-300 ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                             {step.number}
                           </span>
                        </div>
                        
                        {/* Step Content */}
                        <div className={`mt-10 transition-all duration-500 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-60 translate-y-2 group-hover:opacity-80 group-hover:translate-y-1'}`}>
                           <p className={`text-xs font-extrabold uppercase tracking-widest mb-3 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                             {step.label}
                           </p>
                           <h3 className={`text-xl font-bold transition-colors ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                             {step.title}
                           </h3>
                           
                           {/* Detail Deskripsi (Fokus Elegan) */}
                           <div className={`mt-4 overflow-hidden transition-all duration-500 ${isActive ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0 md:max-h-32 md:opacity-60'}`}>
                             <p className="text-sm leading-relaxed text-muted-foreground max-w-[260px] mx-auto">
                                {step.description}
                             </p>
                           </div>
                        </div>
                     </div>

                     {/* Mobile Arrow Connector (between items) */}
                     {index < steps.length - 1 && (
                        <div className="mt-8 flex justify-center text-border md:hidden">
                           <ArrowRight className="h-6 w-6" />
                        </div>
                     )}
                  </div>
                );
              })}
           </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
