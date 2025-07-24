"use client";
import { useState, useEffect, type FormEvent } from "react";
import type { Layanan, LayananForm } from "@/lib/types";
import Image from "next/image";
import { PageHeader } from "@/components/admin/page-header";
import { DataCard } from "@/components/admin/data-card";
import { SuccessModal } from "@/components/admin/success-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save, Loader2, Plus, Trash2, Edit, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Modal Component for Form CRUD
const LayananFormModal = ({
  isOpen,
  onClose,
  onSave,
  formData,
  setFormData,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (form: LayananForm) => void;
  formData: Partial<LayananForm>;
  setFormData: (form: Partial<LayananForm>) => void;
}) => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(formData as LayananForm);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {formData.id ? "Edit Formulir" : "Tambah Formulir Baru"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="form-title">Judul Formulir</Label>
            <Input
              id="form-title"
              value={formData.title || ""}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="form-description">Deskripsi</Label>
            <Textarea
              id="form-description"
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="form-link">Link Google Form</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Salin tautan Google Form dan tempel di sini.</p>
                    <p className="font-mono text-xs">
                      Contoh: https://docs.google.com/forms/d/e/.../viewform
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="form-link"
              value={formData.link || ""}
              onChange={(e) =>
                setFormData({ ...formData, link: e.target.value })
              }
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">Simpan</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default function ManageLayananPage() {
  const [data, setData] = useState<Partial<Layanan>>({
    forms: [],
    akses: { title: "", description: "" },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);

  // Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingForm, setEditingForm] = useState<Partial<LayananForm> | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/layanan");
        if (response.ok) {
          setData(await response.json());
        }
      } catch (error) {
        console.error("Gagal mengambil data layanan:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePageDataChange = (
    section: "hero" | "akses",
    field: string,
    value: string
  ) => {
    setData((prev) => ({
      ...prev,
      [section]: { ...(prev[section] as object), [field]: value },
    }));
  };

  const handleOpenFormModal = (form?: LayananForm) => {
    setEditingForm(
      form || { id: crypto.randomUUID(), title: "", description: "", link: "" }
    );
    setIsFormModalOpen(true);
  };

  const handleSaveForm = (formToSave: LayananForm) => {
    const existingForms = data.forms || [];
    const formIndex = existingForms.findIndex((f) => f.id === formToSave.id);

    let updatedForms;
    if (formIndex > -1) {
      updatedForms = existingForms.map((f) =>
        f.id === formToSave.id ? formToSave : f
      );
    } else {
      if (existingForms.length < 4) {
        updatedForms = [...existingForms, formToSave];
      } else {
        alert("Anda hanya dapat menambahkan maksimal 4 formulir.");
        updatedForms = existingForms;
      }
    }
    setData((prev) => ({ ...prev, forms: updatedForms }));
    setIsFormModalOpen(false);
    setEditingForm(null);
  };

  const removeForm = (id: string) => {
    setData((prev) => ({
      ...prev,
      forms: (prev.forms || []).filter((form) => form.id !== id),
    }));
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    const formData = new FormData();
    formData.append("jsonData", JSON.stringify(data));

    if (heroImageFile) {
      formData.append("heroImageFile", heroImageFile);
    }

    try {
      const response = await fetch("/api/layanan", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setShowSuccessModal(true);
        setHeroImageFile(null);
        const freshData = await fetch("/api/layanan").then((res) => res.json());
        setData(freshData);
      } else {
        alert("Gagal menyimpan perubahan.");
      }
    } catch (error) {
      console.error("Gagal menyimpan:", error);
      alert("Terjadi kesalahan saat menyimpan.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Memuat data layanan...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message="Data Halaman Layanan Berhasil Disimpan!"
      />
      {editingForm && (
        <LayananFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSave={handleSaveForm}
          formData={editingForm}
          setFormData={setEditingForm}
        />
      )}

      <PageHeader
        title="Kelola Halaman Layanan"
        description="Atur konten dan formulir layanan desa"
      >
        <Button onClick={handleSaveAll} disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </PageHeader>

      <DataCard
        title="Konten Halaman Layanan"
        description="Atur teks dan gambar utama halaman."
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="heroSubtitle">Subjudul Halaman</Label>
            <Textarea
              id="heroSubtitle"
              value={data.hero?.subtitle || ""}
              onChange={(e) =>
                handlePageDataChange("hero", "subtitle", e.target.value)
              }
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hero-image">Gambar Hero</Label>
            {data.hero?.heroImage && (
              <div className="mb-2">
                <p className="text-sm text-muted-foreground mb-2">
                  Gambar saat ini:
                </p>
                <Image
                  src={data.hero.heroImage}
                  alt="Preview Hero"
                  width={200}
                  height={112}
                  className="rounded-md object-cover border"
                />
              </div>
            )}
            <Input
              id="hero-image"
              type="file"
              onChange={(e) => setHeroImageFile(e.target.files?.[0] || null)}
              accept="image/png, image/jpeg, image/jpg"
              disabled={isSaving}
            />
            <p className="text-sm text-muted-foreground">
              Unggah file baru untuk mengganti gambar hero.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="aksesTitle">Judul Akses Layanan</Label>
            <Input
              id="aksesTitle"
              value={data.akses?.title || ""}
              onChange={(e) =>
                handlePageDataChange("akses", "title", e.target.value)
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="aksesDescription">Deskripsi Akses Layanan</Label>
            <Textarea
              id="aksesDescription"
              value={data.akses?.description || ""}
              onChange={(e) =>
                handlePageDataChange("akses", "description", e.target.value)
              }
              rows={3}
            />
          </div>
        </div>
      </DataCard>

      <DataCard
        title="Formulir Layanan"
        description="Kelola formulir layanan yang tersedia. Maksimal 4 formulir."
      >
        <div className="space-y-4">
          {(data.forms || []).map((form) => (
            <Card key={form.id}>
              <CardContent className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{form.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {form.description}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenFormModal(form)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeForm(form.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {(data.forms?.length || 0) < 4 && (
            <Button onClick={() => handleOpenFormModal()} variant="outline">
              <Plus className="h-4 w-4 mr-2" /> Tambah Formulir
            </Button>
          )}
        </div>
      </DataCard>
    </div>
  );
}
