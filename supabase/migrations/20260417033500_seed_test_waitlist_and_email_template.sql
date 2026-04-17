INSERT INTO public.waitlist (
  id,
  email,
  name,
  interests,
  created_at,
  reminder_count
)
VALUES (
  '11111111-2222-4333-8444-555555555555',
  'fileamansentosa@gmail.com',
  'File Aman Sentosa',
  ARRAY['Saham Syariah', 'Crypto Syariah', 'Zakat'],
  now(),
  0
)
ON CONFLICT (email) DO UPDATE
SET
  id = EXCLUDED.id,
  name = EXCLUDED.name,
  interests = EXCLUDED.interests,
  reminder_count = COALESCE(public.waitlist.reminder_count, 0);

INSERT INTO public.email_templates (
  id,
  name,
  subject,
  greeting,
  main_message,
  update_title,
  updates,
  closing_message,
  cta_text,
  cta_url
)
VALUES (
  '22222222-3333-4444-8555-666666666666',
  'Update Waitlist - Tes Kirim',
  'Update Averroes untuk {{name}}',
  'Assalamu''alaikum {{name}},',
  'Terima kasih sudah masuk waitlist Averroes. Kami sedang menyiapkan pengalaman yang lebih rapi untuk membantu kamu belajar, memantau, dan mengambil keputusan finansial syariah dengan lebih tenang.',
  'Yang sedang kami siapkan',
  ARRAY[
    'Dashboard waitlist dan pengiriman email notifikasi sudah masuk tahap pengujian.',
    'Konten edukasi fiqh muamalah dibuat lebih praktis dan mudah dipahami.',
    'Fitur screener dan insight syariah sedang dirapikan sebelum akses awal dibuka.'
  ],
  'Kamu akan kami kabari begitu akses awal siap. Terima kasih sudah ikut menjadi bagian awal dari Averroes.',
  'Buka Averroes',
  'https://www.averroes.web.id'
)
ON CONFLICT (id) DO UPDATE
SET
  name = EXCLUDED.name,
  subject = EXCLUDED.subject,
  greeting = EXCLUDED.greeting,
  main_message = EXCLUDED.main_message,
  update_title = EXCLUDED.update_title,
  updates = EXCLUDED.updates,
  closing_message = EXCLUDED.closing_message,
  cta_text = EXCLUDED.cta_text,
  cta_url = EXCLUDED.cta_url,
  updated_at = now();
