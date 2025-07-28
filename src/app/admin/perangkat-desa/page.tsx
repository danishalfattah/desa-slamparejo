"use client";

import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import type { PerangkatDesa, PerangkatDesaPageData } from "@/lib/types";
import Image from "next/image";
import { PageHeader } from "@/components/admin/page-header";
import { ConfirmModal } from "@/components/admin/confirm-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2, Save, Loader2 } from "lucide-react";
import { DataCard } from "@/components/admin/data-card";
import { SuccessModal } from "@/components/admin/success-modal";

const PerangkatFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  perangkat,
  setPerangkat,
  setImageFile,
  isSaving,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  perangkat: Partial<PerangkatDesa>;
  setPerangkat: (data: Partial<PerangkatDesa>) => void;
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  isSaving: boolean;
}) => {
  const [fileError, setFileError] = useState("");
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPerangkat({ ...perangkat, [name]: value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError("");
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setFileError("Ukuran file tidak boleh melebihi 2MB.");
        e.target.value = "";
        setImageFile(null);
        return;
      }
      setImageFile(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {perangkat.id ? "Edit Perangkat" : "Tambah Perangkat Baru"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input
              id="name"
              name="name"
              value={perangkat.name || ""}
              onChange={handleChange}
              required
              disabled={isSaving}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Jabatan</Label>
            <Input
              id="title"
              name="title"
              value={perangkat.title || ""}
              onChange={handleChange}
              required
              disabled={isSaving}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              name="description"
              value={perangkat.description || ""}
              onChange={handleChange}
              rows={4}
              required
              disabled={isSaving}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageFile">Foto Perangkat</Label>
            {perangkat.id && perangkat.imageUrl && (
              <div className="mb-2">
                <p className="text-sm text-muted-foreground mb-2">
                  Gambar saat ini:
                </p>
                <Image
                  src={perangkat.imageUrl || "/placeholder.svg"}
                  alt={perangkat.name || "Gambar saat ini"}
                  width={80}
                  height={80}
                  className="rounded-md object-cover border"
                />
              </div>
            )}
            <Input
              id="imageFile"
              name="imageFile"
              type="file"
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/jpg"
              required={!perangkat.id}
              disabled={isSaving}
            />
            <p className="text-sm text-muted-foreground">
              {perangkat.id
                ? "Unggah file baru untuk mengganti gambar. Maks 2MB."
                : "File gambar wajib diunggah. Maks 2MB."}
            </p>
            {fileError && (
              <Alert variant="destructive" className="mt-2">
                <AlertDescription>{fileError}</AlertDescription>
              </Alert>
            )}
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSaving}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isSaving ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default function ManagePerangkatDesaPage() {
  const [perangkatList, setPerangkatList] = useState<PerangkatDesa[]>([]);
  const [pageData, setPageData] = useState<Partial<PerangkatDesaPageData>>({});
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPerangkat, setEditingPerangkat] = useState<
    Partial<PerangkatDesa>
  >({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    action: () => void;
    message: string;
  } | null>(null);
  const [isSavingPage, setIsSavingPage] = useState(false);
  const [isModalSaving, setIsModalSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [heroImageError, setHeroImageError] = useState("");
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/perangkat-desa");
      const data = await response.json();
      setPerangkatList(data.perangkatList || []);
      setPageData(data.pageData || {});
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
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

  const handleOpenModal = (perangkat?: PerangkatDesa) => {
    setEditingPerangkat(perangkat || {});
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPerangkat({});
  };

  const handleDelete = (id: string) => {
    setConfirmAction({
      message: "Yakin ingin menghapus data perangkat ini?",
      action: async () => {
        const response = await fetch("/api/perangkat-desa", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        setConfirmAction(null);
        if (response.ok) {
          fetchData();
          setSuccessMessage("Data perangkat berhasil dihapus!");
          setShowSuccessModal(true);
        }
      },
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsModalSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", editingPerangkat.name || "");
      formData.append("title", editingPerangkat.title || "");
      formData.append("description", editingPerangkat.description || "");

      if (editingPerangkat.id) {
        formData.append("id", editingPerangkat.id);
      }
      if (imageFile) {
        formData.append("imageFile", imageFile);
      }

      const method = editingPerangkat.id ? "PUT" : "POST";
      const response = await fetch("/api/perangkat-desa", {
        method,
        body: formData,
      });

      if (response.ok) {
        handleCloseModal();
        fetchData();
        setSuccessMessage("Data perangkat berhasil disimpan!");
        setShowSuccessModal(true);
      } else {
        const errorData = await response.json();
        alert(`Gagal menyimpan data: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Gagal submit:", error);
    } finally {
      setIsModalSaving(false);
    }
  };

  const handleSavePageData = async () => {
    setIsSavingPage(true);
    const formData = new FormData();

    const jsonData = {
      hero: { subtitle: pageData.description }, // Menggunakan deskripsi untuk subtitle
      description: pageData.description,
    };

    formData.append("jsonData", JSON.stringify(jsonData));

    if (heroImageFile) {
      formData.append("heroImageFile", heroImageFile);
    }

    try {
      const response = await fetch("/api/perangkat-desa", {
        method: "PATCH",
        body: formData,
      });
      if (response.ok) {
        setSuccessMessage("Data Halaman Perangkat Desa Berhasil Disimpan!");
        setShowSuccessModal(true);
        setHeroImageFile(null);
        fetchData();
      } else {
        alert("Gagal menyimpan data halaman.");
      }
    } catch (error) {
      console.error("Gagal menyimpan data halaman:", error);
    } finally {
      setIsSavingPage(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Memuat data perangkat...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={successMessage}
      />
      <ConfirmModal
        isOpen={!!confirmAction}
        onConfirm={confirmAction?.action || (() => {})}
        onCancel={() => setConfirmAction(null)}
        message={confirmAction?.message || ""}
      />

      <PerangkatFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        perangkat={editingPerangkat}
        setPerangkat={setEditingPerangkat}
        imageFile={imageFile}
        setImageFile={setImageFile}
        isSaving={isModalSaving}
      />

      <PageHeader
        title="Kelola Perangkat Desa"
        description="Atur data aparatur dan perangkat desa"
      />

      <DataCard title="Konten Halaman Perangkat Desa">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="page-description">Deskripsi Halaman</Label>
            <Textarea
              id="page-description"
              value={pageData.description || ""}
              onChange={(e) => {
                const newDescription = e.target.value;
                setPageData((prev) => ({
                  ...prev,
                  hero: { ...prev.hero, subtitle: newDescription },
                  description: newDescription,
                }));
              }}
              rows={3}
              disabled={isSavingPage}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hero-image">Gambar Hero</Label>
            {pageData.hero?.heroImage && (
              <div className="mb-2">
                <p className="text-sm text-muted-foreground mb-2">
                  Gambar saat ini:
                </p>
                <Image
                  src={pageData.hero.heroImage}
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
              disabled={isSavingPage}
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
          <div className="flex justify-end">
            <Button onClick={handleSavePageData} disabled={isSavingPage}>
              {isSavingPage ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isSavingPage ? "Menyimpan..." : "Simpan Konten Halaman"}
            </Button>
          </div>
        </div>
      </DataCard>

      <DataCard title="Daftar Perangkat Desa">
        <div className="flex justify-end">
          <Button onClick={() => handleOpenModal()}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Perangkat Baru
          </Button>
        </div>
        <div className="border rounded-lg mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Jabatan</TableHead>
                <TableHead className="w-[100px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(perangkatList) &&
                perangkatList.map((perangkat) => (
                  <TableRow key={perangkat.id}>
                    <TableCell className="font-medium">
                      {perangkat.name}
                    </TableCell>
                    <TableCell>{perangkat.title}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenModal(perangkat)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(perangkat.id!)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          {(!Array.isArray(perangkatList) || perangkatList.length === 0) && (
            <div className="text-center py-8 text-muted-foreground">
              {`Belum ada data perangkat. Klik tombol "Tambah Perangkat Baru" untuk
              menambahkan.`}
            </div>
          )}
        </div>
      </DataCard>
    </div>
  );
}
