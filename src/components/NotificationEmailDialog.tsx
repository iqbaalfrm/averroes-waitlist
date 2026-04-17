import { useState, useEffect } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Send, Info, Users, User, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { findFallbackEmailTemplate, getFallbackEmailTemplates } from "@/lib/emailTemplates";

interface Recipient {
  id: string;
  email: string;
  name: string | null;
}

interface NotificationEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSend: (template: NotificationTemplate, recipients: string[]) => void;
  isSending: boolean;
  allRecipients: Recipient[];
  preSelectedRecipients?: string[];
}

export interface NotificationTemplate {
  subject: string;
  greeting: string;
  mainMessage: string;
  updateTitle: string;
  updates: string[];
  closingMessage: string;
  ctaText: string;
  ctaUrl: string;
}

const defaultTemplate: NotificationTemplate = {
  subject: "🚀 Update Terbaru dari Averroes!",
  greeting: "Hai {{name}}! 👋",
  mainMessage: "Ada kabar gembira untuk kamu! Kami punya update terbaru tentang perkembangan Averroes.",
  updateTitle: "🔥 Apa yang Baru?",
  updates: [
    "Fitur baru yang telah kami kembangkan",
    "Peningkatan performa aplikasi",
    "Update roadmap dan timeline",
  ],
  closingMessage: "Terima kasih sudah menjadi bagian dari komunitas Averroes! Kami tidak sabar untuk membagikan lebih banyak update di masa depan.",
  ctaText: "Kunjungi Website",
  ctaUrl: "https://averroes.app",
};

const NotificationEmailDialog = ({
  open,
  onOpenChange,
  onSend,
  isSending,
  allRecipients,
  preSelectedRecipients = [],
}: NotificationEmailDialogProps) => {
  const [template, setTemplate] = useState<NotificationTemplate>(defaultTemplate);
  const [updatesText, setUpdatesText] = useState(defaultTemplate.updates.join("\n"));
  const [sendMode, setSendMode] = useState<"all" | "selected">(preSelectedRecipients.length > 0 ? "selected" : "all");
  const [selectedRecipients, setSelectedRecipients] = useState<Set<string>>(new Set(preSelectedRecipients));
  const [savedTemplates, setSavedTemplates] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    if (open) {
      fetchSavedTemplates();
    }
  }, [open]);

  const fetchSavedTemplates = async () => {
    const fallbackTemplates = getFallbackEmailTemplates().map(({ id, name }) => ({ id, name }));
    const { data, error } = await supabase
      .from("email_templates")
      .select("id, name")
      .order("name");

    if (error || !data?.length) {
      setSavedTemplates(fallbackTemplates);
      return;
    }

    const ids = new Set(data.map((template) => template.id));
    setSavedTemplates([
      ...data,
      ...fallbackTemplates.filter((template) => !ids.has(template.id)),
    ]);
  };

  const loadTemplate = async (templateId: string) => {
    const fallbackTemplate = findFallbackEmailTemplate(templateId);
    if (fallbackTemplate) {
      setTemplate({
        subject: fallbackTemplate.subject,
        greeting: fallbackTemplate.greeting,
        mainMessage: fallbackTemplate.main_message,
        updateTitle: fallbackTemplate.update_title,
        updates: fallbackTemplate.updates,
        closingMessage: fallbackTemplate.closing_message,
        ctaText: fallbackTemplate.cta_text,
        ctaUrl: fallbackTemplate.cta_url,
      });
      setUpdatesText(fallbackTemplate.updates.join("\n"));
      return;
    }

    const { data } = await supabase
      .from("email_templates")
      .select("*")
      .eq("id", templateId)
      .maybeSingle();
    
    if (data) {
      setTemplate({
        subject: data.subject,
        greeting: data.greeting,
        mainMessage: data.main_message,
        updateTitle: data.update_title,
        updates: data.updates,
        closingMessage: data.closing_message,
        ctaText: data.cta_text,
        ctaUrl: data.cta_url,
      });
      setUpdatesText(data.updates.join("\n"));
    }
  };

  const handleUpdatesChange = (value: string) => {
    setUpdatesText(value);
    setTemplate({
      ...template,
      updates: value.split("\n").filter((line) => line.trim() !== ""),
    });
  };

  const handleSend = () => {
    const recipients = sendMode === "all" 
      ? allRecipients.map(r => r.id) 
      : Array.from(selectedRecipients);
    onSend(template, recipients);
  };

  const toggleRecipient = (id: string) => {
    const newSelected = new Set(selectedRecipients);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRecipients(newSelected);
  };

  const toggleAll = () => {
    if (selectedRecipients.size === allRecipients.length) {
      setSelectedRecipients(new Set());
    } else {
      setSelectedRecipients(new Set(allRecipients.map(r => r.id)));
    }
  };

  const resetToDefault = () => {
    setTemplate(defaultTemplate);
    setUpdatesText(defaultTemplate.updates.join("\n"));
  };

  const recipientCount = sendMode === "all" ? allRecipients.length : selectedRecipients.size;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            Kirim Email Notifikasi Update
          </DialogTitle>
          <DialogDescription>
            Kirim email notifikasi tentang update terbaru Averroes ke pendaftar.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Load Template */}
          {savedTemplates.length > 0 && (
            <div className="space-y-2">
              <Label>Muat Template Tersimpan</Label>
              <Select onValueChange={loadTemplate}>
                <SelectTrigger>
                  <FileText className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Pilih template..." />
                </SelectTrigger>
                <SelectContent>
                  {savedTemplates.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Send Mode */}
          <div className="space-y-3">
            <Label>Kirim ke</Label>
            <RadioGroup value={sendMode} onValueChange={(v) => setSendMode(v as "all" | "selected")}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all" className="flex items-center gap-2 cursor-pointer font-normal">
                  <Users className="w-4 h-4" />
                  Semua pendaftar ({allRecipients.length})
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="selected" id="selected" />
                <Label htmlFor="selected" className="flex items-center gap-2 cursor-pointer font-normal">
                  <User className="w-4 h-4" />
                  Pilih penerima
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Recipient Selection */}
          {sendMode === "selected" && (
            <div className="space-y-2 border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <Label>Pilih Penerima ({selectedRecipients.size} dipilih)</Label>
                <Button variant="ghost" size="sm" onClick={toggleAll}>
                  {selectedRecipients.size === allRecipients.length ? "Hapus Semua" : "Pilih Semua"}
                </Button>
              </div>
              <ScrollArea className="h-40 rounded border">
                <div className="p-2 space-y-2">
                  {allRecipients.map((recipient) => (
                    <div key={recipient.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={recipient.id}
                        checked={selectedRecipients.has(recipient.id)}
                        onCheckedChange={() => toggleRecipient(recipient.id)}
                      />
                      <Label htmlFor={recipient.id} className="flex-1 cursor-pointer font-normal text-sm">
                        {recipient.name || recipient.email}
                        {recipient.name && <span className="text-muted-foreground ml-1">({recipient.email})</span>}
                      </Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Info Box */}
          <div className="flex items-start gap-3 p-3 bg-muted rounded-lg text-sm">
            <Info className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <div className="text-muted-foreground">
              <p>Gunakan placeholder berikut dalam template:</p>
              <ul className="list-disc list-inside mt-1 space-y-0.5">
                <li><code className="bg-background px-1 rounded">{"{{name}}"}</code> - Nama pendaftar</li>
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
              placeholder="🔥 Apa yang Baru?"
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

          {/* CTA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="ctaText">Teks Tombol CTA</Label>
              <Input
                id="ctaText"
                value={template.ctaText}
                onChange={(e) => setTemplate({ ...template, ctaText: e.target.value })}
                placeholder="Kunjungi Website"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ctaUrl">URL Tombol CTA</Label>
              <Input
                id="ctaUrl"
                value={template.ctaUrl}
                onChange={(e) => setTemplate({ ...template, ctaUrl: e.target.value })}
                placeholder="https://averroes.app"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={resetToDefault} type="button">
            Reset ke Default
          </Button>
          <Button
            onClick={handleSend}
            disabled={isSending || recipientCount === 0}
            className="gap-2"
          >
            <Send className={`w-4 h-4 ${isSending ? "animate-pulse" : ""}`} />
            {isSending ? "Mengirim..." : `Kirim ke ${recipientCount} Penerima`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationEmailDialog;
