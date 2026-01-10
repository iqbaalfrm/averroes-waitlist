import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, Share2, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const interests = [
  { id: "edukasi", label: "Edukasi" },
  { id: "portofolio", label: "Portofolio" },
  { id: "zakat", label: "Zakat" },
  { id: "screener", label: "Screener" },
];

const WaitlistSection = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { ref, isVisible } = useScrollReveal({ threshold: 0.2 });

  const handleInterestToggle = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const trimmedEmail = email.trim().toLowerCase();
    
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      toast({
        title: "Email tidak valid",
        description: "Mohon masukkan alamat email yang benar.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from("waitlist")
        .insert({
          email: trimmedEmail,
          name: name.trim() || null,
          interests: selectedInterests.length > 0 ? selectedInterests : null,
        });

      if (error) {
        // Check if it's a duplicate email error
        if (error.code === "23505") {
          toast({
            title: "Email sudah terdaftar",
            description: "Email ini sudah ada di waitlist kami.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        setIsLoading(false);
        return;
      }

      // Send confirmation email (don't block on failure)
      supabase.functions.invoke("send-waitlist-email", {
        body: {
          email: trimmedEmail,
          name: name.trim() || undefined,
        },
      }).then(({ error: emailError }) => {
        if (emailError) {
          console.error("Failed to send confirmation email:", emailError);
        } else {
          console.log("Confirmation email sent successfully");
        }
      });

      setIsSubmitted(true);
      
      toast({
        title: "Berhasil! 🎉",
        description: "Kamu sudah masuk waitlist Averroes. Cek email kamu!",
      });
    } catch (error) {
      console.error("Waitlist error:", error);
      toast({
        title: "Terjadi kesalahan",
        description: "Mohon coba lagi nanti.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(
      "Aku baru daftar waitlist Averroes - aplikasi crypto syariah & keuangan Islami! Yuk daftar juga: https://averroes.app"
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const shareToX = () => {
    const text = encodeURIComponent(
      "Baru daftar waitlist @AverroesApp - Crypto Syariah & Keuangan Islami! 🌙✨ https://averroes.app"
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  return (
    <section 
      id="waitlist" 
      ref={ref as React.RefObject<HTMLElement>}
      className="py-20 md:py-28 bg-gradient-to-b from-background to-mint/20 islamic-pattern relative overflow-hidden"
    >
      {/* Top gradient for smooth transition */}
      <div className="absolute inset-x-0 top-0 h-20 section-gradient-top pointer-events-none" />
      
      <div className="container mx-auto px-4">
        <div className={`max-w-xl mx-auto scroll-reveal-scale ${isVisible ? "revealed" : ""}`}>
          {!isSubmitted ? (
            <div className="bg-card rounded-3xl p-5 sm:p-6 md:p-10 shadow-card border border-border/50">
              {/* Header */}
              <div className="text-center mb-6 md:mb-8">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-gold text-accent-foreground text-sm font-medium mb-4">
                  <Send className="w-4 h-4" />
                  Early Access
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                  Dapatkan akses lebih dulu.
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Kami kirim undangan beta saat Averroes siap.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="kamu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-xl text-base"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Nama <span className="text-muted-foreground">(opsional)</span>
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Nama kamu"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 rounded-xl text-base"
                    maxLength={100}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Saya tertarik: <span className="text-muted-foreground">(opsional)</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {interests.map((interest) => (
                      <label
                        key={interest.id}
                        className={`flex items-center gap-2 sm:gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 active:scale-[0.98] touch-manipulation ${
                          selectedInterests.includes(interest.id)
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/30"
                        }`}
                      >
                        <Checkbox
                          id={interest.id}
                          checked={selectedInterests.includes(interest.id)}
                          onCheckedChange={() => handleInterestToggle(interest.id)}
                        />
                        <span className="text-sm font-medium text-foreground">
                          {interest.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  size="xl"
                  variant="hero"
                  className="w-full active:scale-[0.98] transition-transform touch-manipulation"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Mendaftarkan...
                    </span>
                  ) : (
                    "Masuk Waitlist"
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Kami tidak spam. Kamu bisa unsubscribe kapan saja.
                </p>
              </form>
            </div>
          ) : (
            <div className="bg-card rounded-3xl p-5 sm:p-6 md:p-10 shadow-card border border-primary/20 text-center">
              {/* Success state */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-hero mx-auto mb-6 flex items-center justify-center">
                <Check className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground" />
              </div>

              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-3">
                Berhasil! Kamu sudah masuk waitlist ✅
              </h2>
              <p className="text-muted-foreground mb-8 text-sm sm:text-base">
                Kami akan menghubungi kamu saat Averroes siap diluncurkan.
              </p>

              {/* Share buttons */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">
                  Bagikan ke teman:
                </p>
                <div className="flex items-center justify-center gap-3">
                  <Button
                    onClick={shareToWhatsApp}
                    variant="mint"
                    className="gap-2 active:scale-[0.98] transition-transform touch-manipulation"
                  >
                    <Share2 className="w-4 h-4" />
                    WhatsApp
                  </Button>
                  <Button
                    onClick={shareToX}
                    variant="outline"
                    className="gap-2 active:scale-[0.98] transition-transform touch-manipulation"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    X (Twitter)
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default WaitlistSection;
