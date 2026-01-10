import { Star, Quote } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const testimonials = [
  {
    name: "Ahmad Fauzi",
    role: "Crypto Investor",
    avatar: "AF",
    content: "Akhirnya ada app yang bantu saya memastikan investasi crypto tetap sesuai syariah. Fitur screener-nya sangat membantu!",
    rating: 5,
  },
  {
    name: "Siti Nurhaliza",
    role: "Financial Planner",
    avatar: "SN",
    content: "Kalkulator zakat crypto-nya akurat dan mudah digunakan. Tidak perlu lagi hitung manual yang ribet.",
    rating: 5,
  },
  {
    name: "Muhammad Rizki",
    role: "Early Adopter",
    avatar: "MR",
    content: "Edukasi fiqh muamalah-nya lengkap dan mudah dipahami. Sangat recommended untuk pemula di dunia crypto syariah!",
    rating: 5,
  },
];

const TestimonialSection = () => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.2 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-16 md:py-24 bg-gradient-to-b from-mint/20 to-background"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className={`text-center mb-12 scroll-reveal ${isVisible ? "revealed" : ""}`}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Star className="w-4 h-4 fill-primary" />
            Testimonial
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Apa Kata Mereka?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Dengarkan pengalaman dari early adopters yang sudah mencoba Averroes
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className={`grid md:grid-cols-3 gap-6 stagger-children ${isVisible ? "revealed" : ""}`}>
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-6 shadow-card border border-border/50 hover:shadow-hover transition-all duration-300 group"
            >
              {/* Quote Icon */}
              <Quote className="w-8 h-8 text-primary/20 mb-4 group-hover:text-primary/40 transition-colors" />

              {/* Content */}
              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-gold fill-gold" />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-hero flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">
                    {testimonial.avatar}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;