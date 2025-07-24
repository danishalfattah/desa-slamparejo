"use client";

import {
  useState,
  useEffect,
  useMemo,
  type ChangeEvent,
  type FormEvent,
} from "react";
import type { Berita, BeritaPageData } from "@/lib/types";
import Image from "next/image";
import { PageHeader } from "@/components/admin/page-header";
import { ConfirmModal } from "@/components/admin/confirm-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  Loader2,
  Star,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";
import { DataCard } from "@/components/admin/data-card";
import { SuccessModal } from "@/components/admin/success-modal";

const BeritaFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  berita,
  setBerita,
  setImageFile,
  isSaving,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  berita: Partial<Berita>;
  setBerita: (data: Partial<Berita>) => void;
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  isSaving: boolean;
}) => {
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBerita({ ...berita, [name]: value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {berita.id ? "Edit Berita" : "Tambah Berita Baru"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Judul Berita</Label>
            <Input
              id="title"
              name="title"
              value={berita.title || ""}
              onChange={handleChange}
              required
              disabled={isSaving}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Isi Berita</Label>
            <Textarea
              id="content"
              name="content"
              value={berita.content || ""}
              onChange={handleChange}
              rows={8}
              required
              disabled={isSaving}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageFile">Gambar Berita</Label>
            {berita.id && berita.imageUrl && (
              <div className="mb-2">
                <p className="text-sm text-muted-foreground mb-2">
                  Gambar saat ini:
                </p>
                <Image
                  src={berita.imageUrl || "/placeholder.svg"}
                  alt={berita.title || "Gambar saat ini"}
                  width={120}
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
              required={!berita.id}
              disabled={isSaving}
            />
            <p className="text-sm text-muted-foreground">
              {berita.id
                ? "Unggah file baru untuk mengganti gambar."
                : "File gambar wajib diunggah."}
            </p>
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

export default function ManageBeritaPage() {
  const [beritaList, setBeritaList] = useState<Berita[]>([]);
  const [pageData, setPageData] = useState<Partial<BeritaPageData>>({});
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBerita, setEditingBerita] = useState<Partial<Berita>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    action: () => void;
    message: string;
  } | null>(null);
  const [isSavingPage, setIsSavingPage] = useState(false);
  const [isModalSaving, setIsModalSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [beritaRes, pageRes] = await Promise.all([
        fetch("/api/berita"),
        fetch("/api/berita-page"),
      ]);
      setBeritaList(await beritaRes.json());
      setPageData(await pageRes.json());
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const filteredBerita = useMemo(() => {
    return beritaList.filter((berita) => {
      const createdAt = new Date(berita.createdAt);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start) {
        start.setHours(0, 0, 0, 0);
        if (createdAt < start) return false;
      }
      if (end) {
        end.setHours(23, 59, 59, 999);
        if (createdAt > end) return false;
      }
      return true;
    });
  }, [beritaList, startDate, endDate]);

  const paginatedBerita = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredBerita.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredBerita, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredBerita.length / itemsPerPage);

  const handleOpenModal = (berita?: Berita) => {
    setEditingBerita(berita || {});
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBerita({});
  };

  const handleDelete = (id: string) => {
    setConfirmAction({
      message: "Yakin ingin menghapus berita ini?",
      action: async () => {
        await fetch("/api/berita", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        setConfirmAction(null);
        fetchAllData();
        setSuccessMessage("Berita berhasil dihapus!");
        setShowSuccessModal(true);
      },
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsModalSaving(true);
    try {
      const formData = new FormData();
      formData.append("title", editingBerita.title || "");
      formData.append("content", editingBerita.content || "");

      if (editingBerita.id) {
        formData.append("id", editingBerita.id);
      }
      if (imageFile) {
        formData.append("imageFile", imageFile);
      }

      const method = editingBerita.id ? "PUT" : "POST";
      const response = await fetch("/api/berita", {
        method,
        body: formData,
      });

      if (response.ok) {
        handleCloseModal();
        fetchAllData();
        setSuccessMessage("Berita berhasil disimpan!");
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

  const handleSetHeadline = async (id: string) => {
    try {
      const response = await fetch("/api/berita", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        fetchAllData();
        setSuccessMessage("Berita utama berhasil diperbarui!");
        setShowSuccessModal(true);
      } else {
        alert("Gagal mengatur berita utama.");
      }
    } catch (error) {
      console.error("Gagal mengatur berita utama:", error);
    }
  };

  const handleSavePageData = async () => {
    setIsSavingPage(true);
    const formData = new FormData();

    const jsonData = {
      hero: pageData.hero,
    };

    formData.append("jsonData", JSON.stringify(jsonData));

    if (heroImageFile) {
      formData.append("heroImageFile", heroImageFile);
    }

    try {
      const response = await fetch("/api/berita-page", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        setSuccessMessage("Konten Halaman Berita Berhasil Disimpan!");
        setShowSuccessModal(true);
        setHeroImageFile(null);
        fetchAllData();
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
        <span className="ml-2">Memuat data berita...</span>
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

      <BeritaFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        berita={editingBerita}
        setBerita={setEditingBerita}
        imageFile={imageFile}
        setImageFile={setImageFile}
        isSaving={isModalSaving}
      />

      <PageHeader
        title="Kelola Berita"
        description="Atur konten halaman dan daftar berita terbaru desa"
      />

      <DataCard title="Konten Halaman Berita">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hero-title">Judul Hero</Label>
            <Input
              id="hero-title"
              value={pageData.hero?.title || ""}
              onChange={(e) =>
                setPageData((prev) => ({
                  ...prev,
                  hero: {
                    ...prev.hero,
                    title: e.target.value,
                  } as BeritaPageData["hero"],
                }))
              }
              disabled={isSavingPage}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hero-subtitle">Subjudul Hero</Label>
            <Textarea
              id="hero-subtitle"
              value={pageData.hero?.subtitle || ""}
              onChange={(e) =>
                setPageData((prev) => ({
                  ...prev,
                  hero: {
                    ...prev.hero,
                    subtitle: e.target.value,
                  } as BeritaPageData["hero"],
                }))
              }
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
              onChange={(e) => setHeroImageFile(e.target.files?.[0] || null)}
              accept="image/png, image/jpeg, image/jpg"
              disabled={isSavingPage}
            />
            <p className="text-sm text-muted-foreground">
              Unggah file baru untuk mengganti gambar hero.
            </p>
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

      <DataCard title="Daftar Artikel Berita">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div>
              <Label htmlFor="start-date" className="text-xs">
                Dari Tanggal
              </Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div>
              <Label htmlFor="end-date" className="text-xs">
                Sampai Tanggal
              </Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
          <Button onClick={() => handleOpenModal()}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Berita Baru
          </Button>
        </div>
        <div className="border rounded-lg mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">Utama</TableHead>
                <TableHead>Judul</TableHead>
                <TableHead>Tanggal Publikasi</TableHead>
                <TableHead className="w-[100px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedBerita.map((berita) => (
                <TableRow key={berita.id}>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSetHeadline(berita.id)}
                    >
                      <Star
                        className={`h-5 w-5 ${
                          berita.isHeadline
                            ? "text-yellow-500 fill-yellow-400"
                            : "text-gray-400"
                        }`}
                      />
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium">{berita.title}</TableCell>
                  <TableCell>
                    {new Date(berita.createdAt).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenModal(berita)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(berita.id!)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {paginatedBerita.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {`Tidak ada data berita yang cocok dengan filter.`}
            </div>
          )}
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => {
              setItemsPerPage(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 per halaman</SelectItem>
              <SelectItem value="50">50 per halaman</SelectItem>
              <SelectItem value="100">100 per halaman</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Halaman {currentPage} dari {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DataCard>
    </div>
  );
}
