import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, FileText, Save, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface EmailTemplate {
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
}

const defaultNewTemplate: Omit<EmailTemplate, "id" | "created_at" | "updated_at"> = {
  name: "",
  subject: "🚀 Update Terbaru dari Averroes!",
  greeting: "Hai {{name}}! 👋",
  main_message: "Ada kabar gembira untuk kamu! Kami punya update terbaru tentang perkembangan Averroes.",
  update_title: "🔥 Apa yang Baru?",
  updates: ["Update 1", "Update 2", "Update 3"],
  closing_message: "Terima kasih sudah menjadi bagian dari komunitas Averroes!",
  cta_text: "Kunjungi Website",
  cta_url: "https://averroes.app",
};

const AdminTemplates = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [formData, setFormData] = useState(defaultNewTemplate);
  const [updatesText, setUpdatesText] = useState(defaultNewTemplate.updates.join("\n"));
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTemplate, setDeleteTemplate] = useState<EmailTemplate | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("email_templates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error: any) {
      console.error("Error fetching templates:", error);
      toast({
        title: "Error",
        description: "Gagal memuat template",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openNewDialog = () => {
    setEditingTemplate(null);
    setFormData(defaultNewTemplate);
    setUpdatesText(defaultNewTemplate.updates.join("\n"));
    setShowDialog(true);
  };

  const openEditDialog = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      subject: template.subject,
      greeting: template.greeting,
      main_message: template.main_message,
      update_title: template.update_title,
      updates: template.updates,
      closing_message: template.closing_message,
      cta_text: template.cta_text,
      cta_url: template.cta_url,
    });
    setUpdatesText(template.updates.join("\n"));
    setShowDialog(true);
  };

  const handleUpdatesChange = (value: string) => {
    setUpdatesText(value);
    setFormData({
      ...formData,
      updates: value.split("\n").filter((line) => line.trim() !== ""),
    });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Nama template harus diisi",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      if (editingTemplate) {
        // Update existing template
        const { error } = await supabase
          .from("email_templates")
          .update({
            name: formData.name,
            subject: formData.subject,
            greeting: formData.greeting,
            main_message: formData.main_message,
            update_title: formData.update_title,
            updates: formData.updates,
            closing_message: formData.closing_message,
            cta_text: formData.cta_text,
            cta_url: formData.cta_url,
          })
          .eq("id", editingTemplate.id);

        if (error) throw error;

        toast({
          title: "Berhasil",
          description: "Template berhasil diperbarui",
        });
      } else {
        // Create new template
        const { error } = await supabase.from("email_templates").insert({
          name: formData.name,
          subject: formData.subject,
          greeting: formData.greeting,
          main_message: formData.main_message,
          update_title: formData.update_title,
          updates: formData.updates,
          closing_message: formData.closing_message,
          cta_text: formData.cta_text,
          cta_url: formData.cta_url,
        });

        if (error) throw error;

        toast({
          title: "Berhasil",
          description: "Template berhasil disimpan",
        });
      }

      setShowDialog(false);
      fetchTemplates();
    } catch (error: any) {
      console.error("Error saving template:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTemplate) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("email_templates")
        .delete()
        .eq("id", deleteTemplate.id);

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: "Template berhasil dihapus",
      });

      setDeleteTemplate(null);
      fetchTemplates();
    } catch (error: any) {
      console.error("Error deleting template:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Template Email</h1>
          <p className="text-muted-foreground">Kelola template email untuk notifikasi</p>
        </div>
        <Button onClick={openNewDialog}>
          <Plus className="w-4 h-4 mr-2" />
          Buat Template
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : templates.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-4">Belum ada template tersimpan</p>
            <Button onClick={openNewDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Buat Template Pertama
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <Card key={template.id} className="group hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base font-semibold truncate pr-2">
                    {template.name}
                  </CardTitle>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(template)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteTemplate(template)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground truncate mb-2">
                  {template.subject}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(template.updated_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Template Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? "Edit Template" : "Buat Template Baru"}
            </DialogTitle>
            <DialogDescription>
              Buat template email yang bisa digunakan ulang untuk mengirim notifikasi.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Template *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Contoh: Update Bulanan"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject Email</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="greeting">Greeting</Label>
              <Input
                id="greeting"
                value={formData.greeting}
                onChange={(e) => setFormData({ ...formData, greeting: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="main_message">Pesan Utama</Label>
              <Textarea
                id="main_message"
                value={formData.main_message}
                onChange={(e) => setFormData({ ...formData, main_message: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="update_title">Judul Update</Label>
              <Input
                id="update_title"
                value={formData.update_title}
                onChange={(e) => setFormData({ ...formData, update_title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="updates">Daftar Update (satu per baris)</Label>
              <Textarea
                id="updates"
                value={updatesText}
                onChange={(e) => handleUpdatesChange(e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="closing_message">Pesan Penutup</Label>
              <Textarea
                id="closing_message"
                value={formData.closing_message}
                onChange={(e) => setFormData({ ...formData, closing_message: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="cta_text">Teks Tombol CTA</Label>
                <Input
                  id="cta_text"
                  value={formData.cta_text}
                  onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cta_url">URL Tombol CTA</Label>
                <Input
                  id="cta_url"
                  value={formData.cta_url}
                  onChange={(e) => setFormData({ ...formData, cta_url: e.target.value })}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              <X className="w-4 h-4 mr-2" />
              Batal
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Menyimpan..." : "Simpan Template"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTemplate} onOpenChange={(open) => !open && setDeleteTemplate(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Template?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah kamu yakin ingin menghapus template "{deleteTemplate?.name}"? 
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminTemplates;
