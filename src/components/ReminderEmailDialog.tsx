import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Bell, Send, Info } from "lucide-react";

interface ReminderEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSend: (template: EmailTemplate) => void;
  isSending: boolean;
  eligibleCount: number;
}

export interface EmailTemplate {
  subject: string;
  greeting: string;
  mainMessage: string;
  updateTitle: string;
  updates: string[];
  closingMessage: string;
  ctaText: string;
}

const defaultTemplate: EmailTemplate = {
  subject: "🌟 Update Averroes - Kabar Terbaru untuk Kamu!",
  greeting: "Hai {{name}}! 👋",
  mainMessage: "Sudah {{days}} hari sejak kamu bergabung di waitlist Averroes! Kami ingin memberikan update terbaru tentang perkembangan kami.",
  updateTitle: "🔥 Update Terbaru",
  updates: [
    "Tim kami terus mengembangkan fitur screener syariah",
    "Kalkulator zakat crypto sedang dalam tahap akhir",
    "Konten edukasi fiqh muamalah akan segera hadir",
  ],
  closingMessage: "Kami sangat menghargai kesabaranmu! Sebagai early adopter, kamu akan mendapat akses prioritas dan benefit eksklusif saat Averroes resmi diluncurkan.",
  ctaText: "📤 Ajak Teman Gabung",
};

const ReminderEmailDialog = ({
  open,
  onOpenChange,
  onSend,
  isSending,
  eligibleCount,
}: ReminderEmailDialogProps) => {
  const [template, setTemplate] = useState<EmailTemplate>(defaultTemplate);
  const [updatesText, setUpdatesText] = useState(defaultTemplate.updates.join("\n"));

  const handleUpdatesChange = (value: string) => {
    setUpdatesText(value);
    setTemplate({
      ...template,
      updates: value.split("\n").filter((line) => line.trim() !== ""),
    });
  };

  const handleSend = () => {
    onSend(template);
  };

  const resetToDefault = () => {
    setTemplate(defaultTemplate);
    setUpdatesText(defaultTemplate.updates.join("\n"));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Kirim Email Reminder
          </DialogTitle>
          <DialogDescription>
            Customize template email sebelum mengirim ke {eligibleCount} pendaftar yang eligible.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Info Box */}
          <div className="flex items-start gap-3 p-3 bg-muted rounded-lg text-sm">
            <Info className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <div className="text-muted-foreground">
              <p>Gunakan placeholder berikut dalam template:</p>
              <ul className="list-disc list-inside mt-1 space-y-0.5">
                <li><code className="bg-background px-1 rounded">{"{{name}}"}</code> - Nama pendaftar</li>
                <li><code className="bg-background px-1 rounded">{"{{days}}"}</code> - Jumlah hari sejak mendaftar</li>
              </ul>
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">Subject Email</Label>
            <Input
              id="subject"
              value={template.subject}
              onChange={(e) => setTemplate({ ...template, subject: e.target.value })}
              placeholder="Subject email..."
            />
          </div>

          {/* Greeting */}
          <div className="space-y-2">
            <Label htmlFor="greeting">Greeting</Label>
            <Input
              id="greeting"
              value={template.greeting}
              onChange={(e) => setTemplate({ ...template, greeting: e.target.value })}
              placeholder="Hai {{name}}! 👋"
            />
          </div>

          {/* Main Message */}
          <div className="space-y-2">
            <Label htmlFor="mainMessage">Pesan Utama</Label>
            <Textarea
              id="mainMessage"
              value={template.mainMessage}
              onChange={(e) => setTemplate({ ...template, mainMessage: e.target.value })}
              placeholder="Pesan pembuka..."
              rows={3}
            />
          </div>

          {/* Update Title */}
          <div className="space-y-2">
            <Label htmlFor="updateTitle">Judul Update</Label>
            <Input
              id="updateTitle"
              value={template.updateTitle}
              onChange={(e) => setTemplate({ ...template, updateTitle: e.target.value })}
              placeholder="🔥 Update Terbaru"
            />
          </div>

          {/* Updates List */}
          <div className="space-y-2">
            <Label htmlFor="updates">Daftar Update (satu per baris)</Label>
            <Textarea
              id="updates"
              value={updatesText}
              onChange={(e) => handleUpdatesChange(e.target.value)}
              placeholder="Update 1&#10;Update 2&#10;Update 3"
              rows={4}
            />
          </div>

          {/* Closing Message */}
          <div className="space-y-2">
            <Label htmlFor="closingMessage">Pesan Penutup</Label>
            <Textarea
              id="closingMessage"
              value={template.closingMessage}
              onChange={(e) => setTemplate({ ...template, closingMessage: e.target.value })}
              placeholder="Pesan penutup..."
              rows={3}
            />
          </div>

          {/* CTA Text */}
          <div className="space-y-2">
            <Label htmlFor="ctaText">Teks Tombol CTA</Label>
            <Input
              id="ctaText"
              value={template.ctaText}
              onChange={(e) => setTemplate({ ...template, ctaText: e.target.value })}
              placeholder="📤 Ajak Teman Gabung"
            />
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={resetToDefault} type="button">
            Reset ke Default
          </Button>
          <Button
            onClick={handleSend}
            disabled={isSending || eligibleCount === 0}
            className="gap-2"
          >
            <Send className={`w-4 h-4 ${isSending ? "animate-pulse" : ""}`} />
            {isSending ? "Mengirim..." : `Kirim ke ${eligibleCount} Pendaftar`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReminderEmailDialog;
