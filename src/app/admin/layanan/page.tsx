"use client";
import { useState, useEffect, type FormEvent } from "react";
import type { Layanan, LayananForm, PersyaratanLayananItem } from "@/lib/types";
import Image from "next/image";
import { PageHeader } from "@/components/admin/page-header";
import { DataCard } from "@/components/admin/data-card";
import { SuccessModal } from "@/components/admin/success-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
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

// Modal for Persyaratan CRUD
const PersyaratanModal = ({
  isOpen,
  onClose,
  onSave,
  itemData,
  setItemData,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: PersyaratanLayananItem) => void;
  itemData: Partial<PersyaratanLayananItem>;
  setItemData: (item: Partial<PersyaratanLayananItem>) => void;
}) => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(itemData as PersyaratanLayananItem);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {itemData.id ? "Edit Persyaratan" : "Tambah Persyaratan"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="persyaratan-title">Judul Persyaratan</Label>
            <Input
              id="persyaratan-title"
              value={itemData.title || ""}
              onChange={(e) =>
                setItemData({ ...itemData, title: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="persyaratan-content">
              Isi Persyaratan (satu per baris)
            </Label>
            <Textarea
              id="persyaratan-content"
              value={itemData.content || ""}
              onChange={(e) =>
                setItemData({ ...itemData, content: e.target.value })
              }
              rows={5}
              required
              placeholder="1. Poin pertama..."
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
    persyaratan: [],
    akses: { title: "", description: "" },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [heroImageError, setHeroImageError] = useState("");
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

  // Modal State for Forms
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingForm, setEditingForm] = useState<Partial<LayananForm> | null>(
    null
  );

  // Modal State for Persyaratan
  const [isPersyaratanModalOpen, setIsPersyaratanModalOpen] = useState(false);
  const [editingPersyaratan, setEditingPersyaratan] =
    useState<Partial<PersyaratanLayananItem> | null>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setHeroImageError("");
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setHeroImageError("Ukuran file tidak boleh melebihi 2MB.");
        e.target.value = "";
        setHeroImageFile(null);
        return;
      }
      setHeroImageFile(file);
    }
  };

  // --- Form Handlers ---
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
      updatedForms = [...existingForms, formToSave];
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

  // --- Persyaratan Handlers ---
  const handleOpenPersyaratanModal = (item?: PersyaratanLayananItem) => {
    setEditingPersyaratan(
      item || { id: crypto.randomUUID(), title: "", content: "" }
    );
    setIsPersyaratanModalOpen(true);
  };

  const handleSavePersyaratan = (itemToSave: PersyaratanLayananItem) => {
    const existingItems = data.persyaratan || [];
    const itemIndex = existingItems.findIndex((i) => i.id === itemToSave.id);

    let updatedItems;
    if (itemIndex > -1) {
      updatedItems = existingItems.map((i) =>
        i.id === itemToSave.id ? itemToSave : i
      );
    } else {
      updatedItems = [...existingItems, itemToSave];
    }
    setData((prev) => ({ ...prev, persyaratan: updatedItems }));
    setIsPersyaratanModalOpen(false);
    setEditingPersyaratan(null);
  };

  const removePersyaratan = (id: string) => {
    setData((prev) => ({
      ...prev,
      persyaratan: (prev.persyaratan || []).filter((item) => item.id !== id),
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

      {editingPersyaratan && (
        <PersyaratanModal
          isOpen={isPersyaratanModalOpen}
          onClose={() => setIsPersyaratanModalOpen(false)}
          onSave={handleSavePersyaratan}
          itemData={editingPersyaratan}
          setItemData={setEditingPersyaratan}
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
            <Label htmlFor="page-description">Deskripsi Halaman</Label>
            <Textarea
              id="page-description"
              value={data.hero?.subtitle || ""}
              onChange={(e) => {
                const newDescription = e.target.value;
                setData((prev) => ({
                  ...prev,
                  hero: { ...prev.hero, subtitle: newDescription },
                }));
              }}
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
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/jpg"
              disabled={isSaving}
            />
            <p className="text-sm text-muted-foreground">
              Unggah file baru untuk mengganti gambar hero. Maks 2MB.
            </p>
            {heroImageError && (
              <Alert variant="destructive" className="mt-2">
                <AlertDescription>{heroImageError}</AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </DataCard>

      <DataCard
        title="Akses Layanan & Formulir"
        description="Kelola judul, deskripsi, dan daftar formulir layanan."
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="aksesTitle">Judul Bagian Akses Layanan</Label>
            <Input
              id="aksesTitle"
              value={data.akses?.title || ""}
              onChange={(e) =>
                handlePageDataChange("akses", "title", e.target.value)
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="aksesDescription">
              Deskripsi Bagian Akses Layanan
            </Label>
            <Textarea
              id="aksesDescription"
              value={data.akses?.description || ""}
              onChange={(e) =>
                handlePageDataChange("akses", "description", e.target.value)
              }
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-md font-medium">Daftar Formulir</h3>
            {(data.forms || []).map((form) => (
              <Card key={form.id}>
                <CardContent className="flex justify-between items-center ">
                  <div>
                    <h4 className="font-semibold">{form.title}</h4>
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
            <Button onClick={() => handleOpenFormModal()} variant="outline">
              <Plus className="h-4 w-4 mr-2" /> Tambah Formulir
            </Button>
          </div>
        </div>
      </DataCard>

      <DataCard
        title="Persyaratan Layanan"
        description="Kelola daftar persyaratan dalam format akordion."
      >
        <div className="space-y-4">
          {(data.persyaratan || []).map((item) => (
            <Card key={item.id}>
              <CardContent className="flex justify-between items-start ">
                <div className="flex-1">
                  <h4 className="font-semibold">{item.title}</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {item.content}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenPersyaratanModal(item)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removePersyaratan(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          <Button
            onClick={() => handleOpenPersyaratanModal()}
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" /> Tambah Persyaratan
          </Button>
        </div>
      </DataCard>
    </div>
  );
}
