export interface SavedEmailTemplate {
  id: string;
  name: string;
  subject: string;
  greeting: string;
  main_message: string;
  update_title: string;
  updates: string[];
  closing_message: string;
  cta_text: string;
  cta_url: string;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
  is_local?: boolean;
}

export const LOCAL_EMAIL_TEMPLATES_KEY = "averroes_email_templates";

export const DEFAULT_EMAIL_TEMPLATES: SavedEmailTemplate[] = [
  {
    id: "default-waitlist-update",
    name: "Update Waitlist - Tes Kirim",
    subject: "Update Averroes untuk {{name}}",
    greeting: "Assalamu'alaikum {{name}},",
    main_message:
      "Terima kasih sudah masuk waitlist Averroes. Kami sedang menyiapkan pengalaman yang lebih rapi untuk membantu kamu belajar, memantau, dan mengambil keputusan finansial syariah dengan lebih tenang.",
    update_title: "Yang sedang kami siapkan",
    updates: [
      "Dashboard waitlist dan pengiriman email notifikasi sudah masuk tahap pengujian.",
      "Konten edukasi fiqh muamalah dibuat lebih praktis dan mudah dipahami.",
      "Fitur screener dan insight syariah sedang dirapikan sebelum akses awal dibuka.",
    ],
    closing_message:
      "Kamu akan kami kabari begitu akses awal siap. Terima kasih sudah ikut menjadi bagian awal dari Averroes.",
    cta_text: "Buka Averroes",
    cta_url: "https://www.averroes.web.id",
    created_at: "2026-04-17T00:00:00.000Z",
    updated_at: "2026-04-17T00:00:00.000Z",
    created_by: null,
    is_local: true,
  },
];

export const getLocalEmailTemplates = (): SavedEmailTemplate[] => {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(LOCAL_EMAIL_TEMPLATES_KEY);
    if (!stored) return [];

    const templates = JSON.parse(stored);
    if (!Array.isArray(templates)) return [];

    return templates.map((template) => ({
      ...template,
      is_local: true,
    }));
  } catch (error) {
    console.error("Error loading local email templates:", error);
    return [];
  }
};

export const saveLocalEmailTemplate = (
  template: Omit<SavedEmailTemplate, "id" | "created_at" | "updated_at" | "is_local"> & {
    id?: string;
    created_at?: string;
  }
): SavedEmailTemplate => {
  const now = new Date().toISOString();
  const localTemplates = getLocalEmailTemplates();
  const id =
    template.id && template.id.startsWith("local-")
      ? template.id
      : `local-${crypto.randomUUID()}`;

  const savedTemplate: SavedEmailTemplate = {
    ...template,
    id,
    created_at: template.created_at ?? now,
    updated_at: now,
    created_by: template.created_by ?? null,
    is_local: true,
  };

  const nextTemplates = [
    savedTemplate,
    ...localTemplates.filter((item) => item.id !== id),
  ];

  localStorage.setItem(LOCAL_EMAIL_TEMPLATES_KEY, JSON.stringify(nextTemplates));
  return savedTemplate;
};

export const deleteLocalEmailTemplate = (id: string) => {
  const nextTemplates = getLocalEmailTemplates().filter((template) => template.id !== id);
  localStorage.setItem(LOCAL_EMAIL_TEMPLATES_KEY, JSON.stringify(nextTemplates));
};

export const getFallbackEmailTemplates = () => [
  ...getLocalEmailTemplates(),
  ...DEFAULT_EMAIL_TEMPLATES,
];

export const findFallbackEmailTemplate = (id: string) =>
  getFallbackEmailTemplates().find((template) => template.id === id);
