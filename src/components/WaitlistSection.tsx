import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const interests = [
  { id: "edukasi_lms", label: "Edukasi / LMS" },
  { id: "screener", label: "Screener" },
  { id: "pasar", label: "Pasar Spot" },
  { id: "portofolio", label: "Portofolio" },
  { id: "zakat", label: "Zakat" },
  { id: "pustaka", label: "Pustaka" },
  { id: "chatbot", label: "Chatbot" },
  { id: "kajian_reels", label: "Kajian / Reels" },
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
            description: "Email ini sudah ada di waitlist kami.",
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
        title: "Berhasil terdaftar",
        description: "Kamu sudah masuk waitlist Averroes. Cek email kamu.",
      });
    } catch (error) {
      console.error("Waitlist error:", error);
      toast({
        title: "Terjadi kesalahan",
        description: "Mohon coba lagi beberapa saat lagi.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(
      "Aku baru daftar waitlist Averroes. Kalau kamu mau akses beta lebih dulu, daftar juga di Averroes."
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const shareToX = () => {
    const text = encodeURIComponent(
      "Baru daftar waitlist Averroes untuk akses beta lebih dulu. Produk ini fokus ke crypto syariah, edukasi, dan zakat."
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  return (
    <section
      id="waitlist"
      ref={ref as React.RefObject<HTMLElement>}
      className="brand-shell relative py-12 md:py-16"
    >
      <div className="container mx-auto px-4">
        <div className={`scroll-reveal-scale ${isVisible ? "revealed" : ""}`}>
          {!isSubmitted ? (
            <div className="brand-panel mx-auto max-w-3xl p-6 md:p-8">
              <div className="mx-auto max-w-2xl text-center">
                <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-primary">
                  Waitlist beta
                </p>
                <h2 className="font-display mt-4 text-4xl font-bold leading-[1] tracking-[-0.04em] text-foreground md:text-5xl">
                  Masuk lebih dulu saat Averroes dibuka
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted-foreground md:text-base">
                  Form-nya singkat. Email wajib, nama dan minat fitur opsional.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-2xl space-y-5">
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-bold text-foreground">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-bold text-foreground">
                    Nama
                    <span className="ml-2 font-medium text-muted-foreground">(opsional)</span>
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Nama kamu"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={100}
                  />
                </div>

                <div>
                  <p className="mb-3 block text-sm font-bold text-foreground">
                    Minat fitur
                    <span className="ml-2 font-medium text-muted-foreground">(opsional)</span>
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest) => {
                      const isSelected = selectedInterests.includes(interest.id);

                      return (
                        <button
                          key={interest.id}
                          type="button"
                          onClick={() => handleInterestToggle(interest.id)}
                          className={`rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors ${
                            isSelected
                              ? "border-primary/20 bg-secondary text-primary"
                              : "border-border bg-card text-muted-foreground hover:border-primary/20 hover:bg-secondary hover:text-foreground"
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
                  className="mt-2 w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-5 w-5 rounded-full border-2 border-primary-foreground/35 border-t-primary-foreground animate-spin" />
                      Mendaftarkan...
                    </span>
                  ) : (
                    "Masuk waitlist"
                  )}
                </Button>

                <p className="border-t border-border pt-4 text-center text-xs font-medium text-muted-foreground">
                  Tidak ada spam. Kami hanya menghubungi kamu saat ada update yang relevan.
                </p>
              </form>
            </div>
          ) : (
            <div className="brand-panel mx-auto max-w-2xl p-6 text-center md:p-10">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[22px] bg-gradient-hero shadow-soft">
                <Check className="h-10 w-10 text-primary-foreground" />
              </div>

              <h2 className="mt-6 text-3xl font-extrabold text-foreground">
                Kamu sudah masuk waitlist Averroes
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-muted-foreground">
                Saat batch beta berikutnya dibuka, kami akan menghubungi kamu lewat email.
                Sambil menunggu, kamu bisa bagikan waitlist ini ke teman yang relevan.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Button onClick={shareToWhatsApp} variant="mint" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  WhatsApp
                </Button>
                <Button onClick={shareToX} variant="outline" className="gap-2">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  X
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default WaitlistSection;
