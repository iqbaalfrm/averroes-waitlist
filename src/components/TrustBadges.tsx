import { BookOpenCheck, Shield, Sparkles, Wallet } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const badges = [
  {
    icon: Shield,
    label: "Aman dibaca",
    description: "Tidak menyimpan private key dan tidak menjalankan transaksi.",
  },
  {
    icon: Wallet,
    label: "Read-only wallet",
    description: "Cocok untuk memantau aset tanpa menyerahkan kontrol wallet.",
  },
  {
    icon: BookOpenCheck,
    label: "Belajar bertahap",
    description: "Konten dibuat lebih jelas untuk fiqh muamalah dan aset digital.",
  },
  {
    icon: Sparkles,
    label: "Calm interface",
    description: "Ritme visual dibuat ringan agar fokus tetap di keputusan utama.",
  },
];

const TrustBadges = () => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.2 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="brand-section relative py-8 md:py-10"
    >
      <div className="container mx-auto px-4">
        <div
          className={`grid gap-3 sm:grid-cols-2 xl:grid-cols-4 stagger-children ${
            isVisible ? "revealed" : ""
          }`}
        >
          {badges.map((badge) => (
            <div key={badge.label} className="brand-grid-card p-5">
              <div className="brand-icon">
                <badge.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-extrabold text-foreground">
                {badge.label}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {badge.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
