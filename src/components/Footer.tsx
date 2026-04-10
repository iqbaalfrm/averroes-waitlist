import averroesIcon from "@/assets/averroes-icon.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/80 py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-sm">
            <a href="#" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-white p-2 shadow-soft">
                <img
                  src={averroesIcon}
                  alt="Averroes logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <p className="text-base font-extrabold text-foreground">Averroes</p>
                <p className="text-xs font-medium text-muted-foreground">
                  Crypto syariah yang lebih tenang dan lebih jelas
                </p>
              </div>
            </a>

            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Dibuat untuk membantu pengguna belajar, menganalisis, dan mengelola
              aset digital dengan konteks syariah yang lebih rapi.
            </p>
          </div>

          <div className="flex flex-col items-start gap-3 md:items-end">
            <div className="flex flex-wrap items-center gap-5">
              <a
                href="#"
                className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                Kebijakan privasi
              </a>
              <a
                href="#"
                className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                Kontak
              </a>
              <a
                href="mailto:hello@averroes.app"
                className="text-sm font-extrabold text-primary transition-colors hover:text-primary/80"
              >
                hello@averroes.app
              </a>
            </div>

            <p className="text-sm font-medium text-muted-foreground">
              Copyright {currentYear} Averroes. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
