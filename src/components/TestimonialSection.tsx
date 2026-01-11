import { Star, Quote } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const testimonials = [
  {
    name: "Ustadz Devin Halim Wijaya",
    avatar: "DH",
    content: "Averroes menjawab kebutuhan umat akan panduan investasi digital yang sesuai syariah. Pendekatan fiqh muamalah yang digunakan sangat komprehensif dan mudah dipahami.",
    rating: 5,
  },
  {
    name: "Ustadz Fida Munadzir",
    avatar: "FM",
    content: "Saya sering ditanya tentang hukum crypto. Averroes membantu memberikan edukasi yang berbasis dalil dan pendapat ulama kontemporer dengan sangat baik.",
    rating: 5,
  },
  {
    name: "Ustadz Ade Setiawan",
    avatar: "AS",
    content: "Fitur screener syariah dan kalkulator zakat-nya sangat membantu umat dalam menunaikan kewajiban. Ini langkah positif untuk literasi keuangan syariah di era digital.",
    rating: 5,
  },
];

const TestimonialSection = () => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.2 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-8 sm:py-12 md:py-16 bg-gradient-to-b from-mint/20 to-background relative overflow-hidden"
    >
      {/* Top gradient for smooth transition */}
      <div className="absolute inset-x-0 top-0 h-20 section-gradient-top pointer-events-none" />
      
      <div className="container mx-auto px-3 sm:px-4">
        {/* Header */}
        <div className={`text-center mb-6 sm:mb-8 md:mb-10 scroll-reveal ${isVisible ? "revealed" : ""}`}>
          <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-3 sm:mb-4">
            <Star className="w-3.5 sm:w-4 h-3.5 sm:h-4 fill-primary" />
            Testimonial
          </span>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-4">
            Apa Kata Mereka?
          </h2>
          <p className="text-xs sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Dengarkan pengalaman dari early adopters yang sudah mencoba Averroes
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className={`grid md:grid-cols-3 gap-3 sm:gap-6 stagger-children ${isVisible ? "revealed" : ""}`}>
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-card border border-border/50 hover:shadow-hover hover:-translate-y-2 transition-all duration-500 group"
            >
              {/* Quote Icon */}
              <Quote className="w-6 sm:w-8 h-6 sm:h-8 text-primary/20 mb-2 sm:mb-4 group-hover:text-primary/40 transition-colors duration-300" />

              {/* Content */}
              <p className="text-xs sm:text-base text-foreground mb-4 sm:mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Rating */}
              <div className="flex gap-0.5 sm:gap-1 mb-3 sm:mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-3 sm:w-4 h-3 sm:h-4 text-gold fill-gold" />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-9 sm:w-12 h-9 sm:h-12 rounded-full bg-gradient-hero flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-[10px] sm:text-sm">
                    {testimonial.avatar}
                  </span>
                </div>
                <p className="font-semibold text-foreground text-xs sm:text-base">{testimonial.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;