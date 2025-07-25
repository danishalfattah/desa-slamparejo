"use client";

import {
  useState,
  useEffect,
  useMemo,
  type ChangeEvent,
  type FormEvent,
} from "react";
import type { Usaha, UsahaDesaPageData } from "@/lib/types";
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
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { DataCard } from "@/components/admin/data-card";
import { SuccessModal } from "@/components/admin/success-modal";

const UsahaFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  usaha,
  setUsaha,
  setImageFile,
  isSaving,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  usaha: Partial<Usaha>;
  setUsaha: (data: Partial<Usaha>) => void;
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  isSaving: boolean;
}) => {
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUsaha({ ...usaha, [name]: value });
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
            {usaha.id ? "Edit Usaha" : "Tambah Usaha Baru"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Nama Usaha</Label>
            <Input
              id="title"
              name="title"
              value={usaha.title || ""}
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
              value={usaha.description || ""}
              onChange={handleChange}
              rows={4}
              required
              disabled={isSaving}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Nomor Telepon</Label>
            <Input
              id="phone"
              name="phone"
              value={usaha.phone || ""}
              onChange={handleChange}
              placeholder="62812..."
              required
              disabled={isSaving}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageFile">Gambar Usaha</Label>
            {usaha.id && usaha.image && (
              <div className="mb-2">
                <p className="text-sm text-muted-foreground mb-2">
                  Gambar saat ini:
                </p>
                <Image
                  src={usaha.image || "/placeholder.svg"}
                  alt={usaha.title || "Gambar saat ini"}
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
              required={!usaha.id}
              disabled={isSaving}
            />
            <p className="text-sm text-muted-foreground">
              {usaha.id
                ? "Unggah file baru untuk mengganti gambar."
                : "File gambar wajib diunggah."}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="maps">URL Google Maps</Label>
            <Input
              id="maps"
              name="maps"
              value={usaha.maps || ""}
              onChange={handleChange}
              required
              disabled={isSaving}
            />
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

export default function ManageUsahaDesaPage() {
  const [usahaList, setUsahaList] = useState<Usaha[]>([]);
  const [pageData, setPageData] = useState<Partial<UsahaDesaPageData>>({});
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUsaha, setEditingUsaha] = useState<Partial<Usaha>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    action: () => void;
    message: string;
  } | null>(null);
  const [isSavingPage, setIsSavingPage] = useState(false);
  const [isModalSaving, setIsModalSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Filter and Pagination State
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/usaha-desa");
      const data = await response.json();
      setUsahaList(data.usahaList);
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

  const filteredUsaha = useMemo(() => {
    return usahaList.filter((usaha) =>
      usaha.title.toLowerCase().includes(filter.toLowerCase())
    );
  }, [usahaList, filter]);

  const paginatedUsaha = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsaha.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsaha, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredUsaha.length / itemsPerPage);

  const handleOpenModal = (usaha?: Usaha) => {
    setEditingUsaha(usaha || {});
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUsaha({});
  };

  const handleDelete = (id: string) => {
    setConfirmAction({
      message: "Yakin ingin menghapus data usaha ini?",
      action: async () => {
        const response = await fetch("/api/usaha-desa", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        setConfirmAction(null);
        if (response.ok) {
          fetchData();
          setSuccessMessage("Data usaha berhasil dihapus!");
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
      formData.append("title", editingUsaha.title || "");
      formData.append("description", editingUsaha.description || "");
      formData.append("phone", editingUsaha.phone || "");
      formData.append("maps", editingUsaha.maps || "");

      if (editingUsaha.id) {
        formData.append("id", editingUsaha.id);
      }
      if (imageFile) {
        formData.append("imageFile", imageFile);
      }

      const method = editingUsaha.id ? "PUT" : "POST";
      const response = await fetch("/api/usaha-desa", {
        method,
        body: formData,
      });

      if (response.ok) {
        handleCloseModal();
        fetchData();
        setSuccessMessage("Data usaha berhasil disimpan!");
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
      hero: { subtitle: pageData.hero?.subtitle },
      description: pageData.description,
    };

    formData.append("jsonData", JSON.stringify(jsonData));

    if (heroImageFile) {
      formData.append("heroImageFile", heroImageFile);
    }

    try {
      const response = await fetch("/api/usaha-desa", {
        method: "PATCH",
        body: formData,
      });
      if (response.ok) {
        setSuccessMessage("Data Halaman Usaha Desa Berhasil Disimpan!");
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
        <span className="ml-2">Memuat data usaha...</span>
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

      <UsahaFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        usaha={editingUsaha}
        setUsaha={setEditingUsaha}
        imageFile={imageFile}
        setImageFile={setImageFile}
        isSaving={isModalSaving}
      />

      <PageHeader
        title="Kelola Usaha Desa"
        description="Atur data UMKM dan usaha ekonomi lokal desa"
      />

      <DataCard title="Konten Halaman Usaha Desa">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hero-subtitle">Subjudul Hero</Label>
            <Textarea
              id="hero-subtitle"
              value={pageData.hero?.subtitle || ""}
              onChange={(e) =>
                setPageData((prev) => ({
                  ...prev,
                  hero: { ...prev.hero, subtitle: e.target.value },
                }))
              }
              rows={3}
              disabled={isSavingPage}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi Halaman</Label>
            <Textarea
              id="description"
              value={pageData.description || ""}
              onChange={(e) =>
                setPageData((prev) => ({
                  ...prev,
                  description: e.target.value,
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

      <DataCard title="Daftar Usaha (UMKM)">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <Input
            placeholder="Cari nama usaha..."
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="max-w-xs"
          />
          <Button onClick={() => handleOpenModal()}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Usaha Baru
          </Button>
        </div>
        <div className="border rounded-lg mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Usaha</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Telepon</TableHead>
                <TableHead className="w-[100px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsaha.map((usaha) => (
                <TableRow key={usaha.id}>
                  <TableCell className="font-medium">{usaha.title}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {usaha.description}
                  </TableCell>
                  <TableCell>{usaha.phone}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenModal(usaha)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(usaha.id!)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {paginatedUsaha.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {`Tidak ada data yang cocok dengan filter.`}
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
