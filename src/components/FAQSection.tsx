import { useState } from "react";
import { ChevronDown, MessageCircleQuestion, Mail } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const faqs = [
  {
    question: "Averroes ini tempat buat trading kripto ya?",
    answer: "Bukan kok. Averroes itu murni platform edukasi dan analisis kripto. Kami nggak menyediakan fitur jual-beli (trading) atau penitipan dana.\n\nFokus kami adalah bantu kamu belajar, menganalisis portofolio, dan ngecek status kehalalan koin sebelum kamu telanjur beli di exchange (bursa) luar.",
    isFeatured: true,
  },
  {
    question: "Apa bedanya Averroes sama aplikasi kripto lain?",
    answer: "Kalau aplikasi lain biasanya fokus bikin kamu cepat-cepat transaksi (ngedorong FOMO), Averroes justru ngajak kamu \"ngerem\" sebentar buat belajar.\n\nKami mengawinkan edukasi finansial santai dengan fitur screening otomatis. Jadi, kamu beneran tahu apa yang kamu beli dan kenapa kamu membelinya, bukan sekadar ikut-ikutan.",
  },
  {
    question: "Emang investasi kripto itu halal?",
    answer: "Tergantung jenis koin dan peruntukannya. Itulah kenapa Averroes hadir.\n\nAsal aset tersebut punya utilitas (kegunaan) yang jelas dan bersih dari mesin terlarang seperti judi (maysir), spekulasi murni (gharar), atau bunga (riba), maka kripto bisa dikategorikan halal.",
  },
  {
    question: "Kalau nyambungin portofolio ke sini, saldoku aman kan?",
    answer: "Aman 100%. Averroes cuma numpang lewat pakai akses Read-Only dari dompet kripto yang kamu sambungkan.\n\nArtinya, sistem kami ibarat cuma \"melihat\" saldo buat ditampilin ke dasbor dan dihitung zakatnya. Kami sama sekali nggak punya akses untuk memindahkan, menarik, apalagi ngejual koinmu.",
  },
  {
    question: "Aku pemula banget soal ginian. Bisa ikutan pakai nggak?",
    answer: "Justru ini tempat mendarat yang pas buat kamu! Averroes memang dirancang untuk meruntuhkan bahasa dewa kripto jadi bahasa manusia sehari-hari.\n\nMateri LMS (pembelajaran) kami dibikin senyaman mungkin buat pemula. Kamu bisa belajar pelan-pelan dari titik nol tanpa perlu merasa minder.",
  },
  {
    question: "Terus, fungsi Screener Syariah itu buat apa?",
    answer: "Gampangnya, ini kayak alarm otomatis. Saat kamu lagi mantau suatu token, screener kami bantu ngebedah latar belakang koin tersebut.\n\nKalau algoritmanya mendeteksi koin itu dipakai buat proyek judi atau pinjaman berbunga tinggi, layarmu bakal nampilin peringatan merah biar kamu nggak terjebak salah beli.",
  },
  {
    question: "Fitur kalkulator zakatnya harus dihitung manual?",
    answer: "Nggak usah repot, semuanya otomatis. Begitu portofolionya tersambung, sistem bakal menghitung naik-turun nilai asetmu tiap hari.\n\nKalau hartamu udah menembus batas kewajiban berzakat (nisab), dasbormu bakal ngasih notifikasi beserta nominal pas 2.5% yang harus kamu sisihkan.",
  },
  {
    question: "Chatbot AI di Averroes bisa nentuin fatwa atau kasih bocoran koin?",
    answer: "Chatbot kami kami rancang sebagai \"asisten belajar pribadi\", bukan ulama atau penasihat keuangan.\n\nJadi, kamu bebas nanya-nanya soal definisi Web3 atau teori ekonomi makro, tapi dia nggak akan ngeluarin dalil fatwa baru atau ngajak kamu \"serok koin ini sekarang juga\".",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <section id="faq" className="relative border-t border-border/40 bg-background py-16 md:py-24">
      <div className="container mx-auto px-4" ref={ref as React.RefObject<HTMLDivElement>}>
        <div className="mx-auto max-w-3xl">
          <div className={`mb-16 text-center scroll-reveal ${isVisible ? "revealed" : ""}`}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-extrabold tracking-wide text-primary shadow-sm shadow-primary/5">
              <MessageCircleQuestion className="h-4 w-4" />
              Tanya Jawab Santai
            </div>
            <h2 className="font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Nggak Perlu Bingung
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Daripada nebak-nebak, coba cek catatan obrolan ini. Siapa tahu isi kepalamu udah kejawab di sini.
            </p>
          </div>

          <div className={`space-y-4 scroll-reveal ${isVisible ? "revealed" : ""}`} style={{ transitionDelay: "100ms" }}>
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              
              return (
                <div 
                  key={index}
                  className={`group relative cursor-pointer overflow-hidden rounded-2xl border transition-all duration-300 ease-out ${
                    isOpen 
                      ? 'border-primary/40 bg-card shadow-lg shadow-primary/5' 
                      : 'border-border bg-background hover:border-primary/30 hover:bg-card/50 hover:shadow-md'
                  } ${faq.isFeatured && !isOpen ? 'border-l-[3px] border-l-primary/60' : ''}`}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <div className="flex items-center justify-between gap-4 px-6 py-5 sm:px-8">
                    <h3 className={`text-base font-bold sm:text-lg transition-colors ${isOpen ? 'text-primary' : 'text-foreground group-hover:text-primary/90'}`}>
                      {faq.question}
                    </h3>
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${isOpen ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground group-hover:bg-primary/5 group-hover:text-primary/70'}`}>
                      <ChevronDown className={`h-5 w-5 transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
                    </div>
                  </div>
                  
                  <div 
                    className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-6 pt-1 text-sm leading-relaxed text-muted-foreground sm:px-8 sm:text-base">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Soft CTA */}
          <div className={`mt-10 flex flex-col items-center justify-between gap-5 rounded-2xl border border-border/60 bg-gradient-to-r from-card/30 via-background to-card/30 p-6 sm:flex-row sm:p-8 scroll-reveal ${isVisible ? "revealed" : ""}`} style={{ transitionDelay: "200ms" }}>
            <div className="text-center sm:text-left">
              <h4 className="text-lg font-bold text-foreground">Masih punya pertanyaan?</h4>
              <p className="mt-1 text-sm text-muted-foreground">Nggak usah sungkan, langsung tanya aja ke tim kami.</p>
            </div>
            <a 
              href="mailto:hello@averroes.app" 
              className="inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-border bg-background px-6 py-3.5 text-sm font-bold shadow-sm transition-all hover:border-primary/50 hover:bg-card hover:text-primary hover:shadow-md sm:w-auto"
            >
              <Mail className="h-4 w-4" />
              Kirim Email
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
