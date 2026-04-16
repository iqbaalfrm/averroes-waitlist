import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Share2, Sparkles, Lock, ShieldCheck, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useScrollReveal } from "@/hooks/useScrollReveal";

  const interests = [
    { id: "edukasi_lms", label: "Belajar Kripto" },
    { id: "screener", label: "Screener Syariah" },
    { id: "pasar", label: "Cek Market" },
    { id: "portofolio", label: "Dasbor Portofolio" },
    { id: "zakat", label: "Kalkulator Zakat" },
    { id: "pustaka", label: "Artikel Fiqh" },
    { id: "chatbot", label: "Tanya AI" },
    { id: "kajian_reels", label: "Video Kajian" },
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
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
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
      const { error } = await supabase.from("waitlist").insert({
        email: trimmedEmail,
        name: name.trim() || null,
        interests: selectedInterests.length > 0 ? selectedInterests : null,
      });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Email sudah terdaftar",
            description: "Email ini sudah ada di daftar akses awal kami.",
            variant: "destructive",
          });
        } else {
          throw error;
        }

        setIsLoading(false);
        return;
      }

      supabase.functions
        .invoke("send-waitlist-email", {
          body: {
            email: trimmedEmail,
            name: name.trim() || undefined,
          },
        })
        .then(({ error: emailError }) => {
          if (emailError) {
            console.error("Failed to send confirmation email:", emailError);
          }
        });

      setIsSubmitted(true);
      toast({
        title: "Pendaftaran Berhasil",
        description: "Email Anda tercatat untuk antrean rilis Averroes.",
      });
    } catch (error) {
      console.error("Waitlist error:", error);
      toast({
        title: "Terjadi kesalahan",
        description: "Sistem mengalami kendala, silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(
      "Eh, aku baru daftar akses buat nyobain platform kripto syariah Averroes. Biar mandiri nentuin koin halal! Daftar sini yuk barengan."
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const shareToX = () => {
    const text = encodeURIComponent(
      "Ikutan ngantre buat nyobain Averroes — platform kripto pertama yang ngebantu kita screening aset halal tanpa mikir panjang."
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  return (
    <section
      id="waitlist"
      ref={ref as React.RefObject<HTMLElement>}
      className="relative overflow-hidden border-b border-border/40 bg-background py-16 md:py-24"
    >
      {/* Dekorasi Cahaya Halus */}
      <div className="absolute left-1/2 top-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4">
        <div className={`mx-auto max-w-3xl scroll-reveal-scale ${isVisible ? "revealed" : ""}`}>
          
          {!isSubmitted ? (
            <div className="rounded-[2rem] border border-border/50 bg-gradient-to-b from-card/30 to-background p-2 shadow-2xl shadow-primary/5 ring-1 ring-border/20 md:p-3">
              <div className="relative overflow-hidden rounded-[1.5rem] border border-border/40 bg-card px-6 py-12 text-center sm:px-12 md:py-16">
                
                {/* Efek Garis Latar Card */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/10 to-transparent opacity-50" />

                <div className="relative z-10">
                  <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary">
                    <span className="text-sm">💌</span>
                    Kabar Pra-Rilis
                  </div>

                  <h2 className="font-display mx-auto max-w-2xl text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.1]">
                    Mau jadi yang pertama <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">nyobain?</span>
                  </h2>
                  <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
                    Kami lagi rapi-rapi buat rilis. Masukin emailmu biar kami kasih info duluan begitu Averroes siap dipakai bareng-bareng.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="relative z-10 mx-auto mt-10 max-w-lg text-left">
                  <div className="space-y-6">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="name" className="mb-2 block text-sm font-bold text-foreground">
                          Nama panggilan
                          <span className="ml-1 text-muted-foreground font-medium text-xs">(Opsional)</span>
                        </label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Biar enak nyapanya..."
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          maxLength={100}
                          className="h-12 border-border/60 bg-background/50 focus-visible:ring-primary/40 transition-all hover:bg-background"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="mb-2 block text-sm font-bold text-foreground">
                          Email utama <span className="text-destructive">*</span>
                        </label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="nama@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="h-12 border-border/60 bg-background/50 focus-visible:ring-primary/40 transition-all hover:bg-background"
                        />
                      </div>
                    </div>

                    <div>
                      <p className="mb-3 block text-sm font-bold text-foreground">
                        Kamu paling nungguin fitur apa nih?
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {interests.map((interest) => {
                          const isSelected = selectedInterests.includes(interest.id);
                          return (
                            <button
                              key={interest.id}
                              type="button"
                              onClick={() => handleInterestToggle(interest.id)}
                              className={`rounded-full border px-4 py-1.5 text-sm font-semibold tracking-wide transition-all duration-300 ${
                                isSelected
                                  ? "border-primary bg-primary/10 text-primary shadow-sm scale-105"
                                  : "border-border/60 bg-card text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-foreground hover:scale-105"
                              }`}
                            >
                              {interest.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <Button
                      type="submit"
                      size="xl"
                      variant="hero"
                      className="mt-4 w-full h-14 text-base font-extrabold tracking-wide transition-transform hover:scale-[1.02]"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <span className="h-5 w-5 rounded-full border-2 border-primary-foreground/35 border-t-primary-foreground animate-spin" />
                          Sebentar ya...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Check className="h-5 w-5" />
                          Ikut Antrean Rilis
                        </span>
                      )}
                    </Button>

                    <div className="flex flex-col items-center justify-center pt-2 text-xs font-semibold text-muted-foreground">
                      <div className="flex items-center gap-1.5 text-foreground/70">
                        <ShieldCheck className="h-4 w-4 text-primary/70" />
                        Tenang, kami anti spam-spam club. Emailmu aman 100%.
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="rounded-[2rem] border border-border/50 bg-gradient-to-b from-card/30 to-background p-2 shadow-2xl shadow-primary/5 text-center transition-all md:p-3">
              <div className="relative overflow-hidden rounded-[1.5rem] border border-border/40 bg-card px-6 py-16 sm:px-12 md:py-20">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10 shadow-inner">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20">
                    <Check className="h-8 w-8 text-primary-foreground" />
                  </div>
                </div>

                <h2 className="mt-8 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                  Sip! Kamu udah masuk antrean.
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
                  Sambil nunggu kode aksesnya dikirim, kasih tahu teman sejawat biar mereka nggak kemakan koin FOMO sendirian.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button onClick={shareToWhatsApp} variant="mint" size="lg" className="gap-2 w-full sm:w-auto font-bold border-transparent">
                    <Share2 className="h-4 w-4" />
                    Panggil Teman via WA
                  </Button>
                  <Button onClick={shareToX} variant="outline" size="lg" className="gap-2 w-full sm:w-auto font-bold">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    Ceritakan di X
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
