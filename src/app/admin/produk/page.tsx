"use client";

import {
  useState,
  useEffect,
  useMemo,
  type ChangeEvent,
  type FormEvent,
} from "react";
import type { ProdukHukum, Pembangunan, ProdukPageData } from "@/lib/types";
import Image from "next/image";
import { PageHeader } from "@/components/admin/page-header";
import { DataCard } from "@/components/admin/data-card";
import { ConfirmModal } from "@/components/admin/confirm-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { SuccessModal } from "@/components/admin/success-modal";

const ProdukHukumModal = ({
  isOpen,
  onClose,
  onSubmit,
  data,
  setData,
  isSaving,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  data: Partial<ProdukHukum>;
  setData: (data: Partial<ProdukHukum>) => void;
  isSaving: boolean;
}) => {
  const handleChange = (name: string, value: string | number) => {
    setData({ ...data, [name]: name === "year" ? Number(value) : value });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {data.id ? "Edit Produk Hukum" : "Tambah Produk Hukum"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Judul Dokumen</Label>
            <Input
              id="title"
              value={data.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              required
              disabled={isSaving}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi Singkat</Label>
            <Textarea
              id="description"
              value={data.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              required
              disabled={isSaving}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="link">URL Google Drive</Label>
            <Input
              id="link"
              value={data.link || ""}
              onChange={(e) => handleChange("link", e.target.value)}
              required
              disabled={isSaving}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Tahun</Label>
              <Input
                id="year"
                type="number"
                value={data.year || new Date().getFullYear()}
                onChange={(e) => handleChange("year", e.target.value)}
                required
                disabled={isSaving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <Select
                value={data.category || "Perdes"}
                onValueChange={(value) => handleChange("category", value)}
                disabled={isSaving}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Perdes">Perdes</SelectItem>
                  <SelectItem value="Keputusan Desa">Keputusan Desa</SelectItem>
                </SelectContent>
              </Select>
            </div>
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

const PembangunanModal = ({
  isOpen,
  onClose,
  onSubmit,
  data,
  setData,
  setImageFile,
  isSaving,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  data: Partial<Pembangunan>;
  setData: (data: Partial<Pembangunan>) => void;
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  isSaving: boolean;
}) => {
  const handleChange = (name: string, value: string | number) => {
    setData({ ...data, [name]: name === "year" ? Number(value) : value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setImageFile(e.target.files[0]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {data.id ? "Edit Pembangunan" : "Tambah Pembangunan"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Nama Proyek Pembangunan</Label>
            <Input
              id="title"
              value={data.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              required
              disabled={isSaving}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi Proyek</Label>
            <Textarea
              id="description"
              value={data.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              required
              disabled={isSaving}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageFile">Gambar Pembangunan</Label>
            {data.id && data.image && (
              <div className="mb-2">
                <p className="text-sm text-muted-foreground mb-2">
                  Gambar saat ini:
                </p>
                <Image
                  src={data.image || "/placeholder.svg"}
                  alt={data.title || "Gambar saat ini"}
                  width={80}
                  height={80}
                  className="rounded-md object-cover border"
                />
              </div>
            )}
            <Input
              id="imageFile"
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              required={!data.id}
              disabled={isSaving}
            />
            <p className="text-sm text-muted-foreground">
              {data.id
                ? "Unggah file baru untuk mengganti gambar."
                : "File gambar wajib diunggah."}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="budget">Anggaran</Label>
            <Input
              id="budget"
              value={data.budget || ""}
              onChange={(e) => handleChange("budget", e.target.value)}
              placeholder="Rp 150.000.000"
              required
              disabled={isSaving}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Tahun</Label>
              <Input
                id="year"
                type="number"
                value={data.year || new Date().getFullYear()}
                onChange={(e) => handleChange("year", e.target.value)}
                required
                disabled={isSaving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={data.status || "Selesai"}
                onValueChange={(value) => handleChange("status", value)}
                disabled={isSaving}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Selesai">Selesai</SelectItem>
                  <SelectItem value="Berlangsung">Berlangsung</SelectItem>
                  <SelectItem value="Direncanakan">Direncanakan</SelectItem>
                </SelectContent>
              </Select>
            </div>
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

export default function ManageProdukPage() {
  // Data states
  const [produkHukum, setProdukHukum] = useState<ProdukHukum[]>([]);
  const [pembangunan, setPembangunan] = useState<Pembangunan[]>([]);
  const [pageData, setPageData] = useState<Partial<ProdukPageData>>({});

  // UI states
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingPage, setIsSavingPage] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);

  // Modal states
  const [isHukumModalOpen, setIsHukumModalOpen] = useState(false);
  const [editingHukum, setEditingHukum] = useState<Partial<ProdukHukum>>({});
  const [isPembangunanModalOpen, setIsPembangunanModalOpen] = useState(false);
  const [editingPembangunan, setEditingPembangunan] = useState<
    Partial<Pembangunan>
  >({});
  const [pembangunanImageFile, setPembangunanImageFile] = useState<File | null>(
    null
  );
  const [confirmAction, setConfirmAction] = useState<{
    action: () => void;
    message: string;
  } | null>(null);
  const [isHukumSaving, setIsHukumSaving] = useState(false);
  const [isPembangunanSaving, setIsPembangunanSaving] = useState(false);

  // Filter & Pagination states for Produk Hukum
  const [hukumCurrentPage, setHukumCurrentPage] = useState(1);
  const [hukumItemsPerPage, setHukumItemsPerPage] = useState(10);
  const [hukumTahunFilter, setHukumTahunFilter] = useState("all");
  const [hukumKategoriFilter, setHukumKategoriFilter] = useState("all");

  // Filter & Pagination states for Pembangunan
  const [pembangunanCurrentPage, setPembangunanCurrentPage] = useState(1);
  const [pembangunanItemsPerPage, setPembangunanItemsPerPage] = useState(10);
  const [pembangunanTahunFilter, setPembangunanTahunFilter] = useState("all");
  const [pembangunanStatusFilter, setPembangunanStatusFilter] = useState("all");

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [hukumRes, pembangunanRes, pageRes] = await Promise.all([
        fetch("/api/produk-hukum"),
        fetch("/api/pembangunan"),
        fetch("/api/produk-page"),
      ]);
      setProdukHukum(await hukumRes.json());
      setPembangunan(await pembangunanRes.json());
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

  // Get unique years for filters
  const hukumAvailableYears = useMemo(
    () =>
      [...new Set(produkHukum.map((item) => item.year))].sort((a, b) => b - a),
    [produkHukum]
  );
  const pembangunanAvailableYears = useMemo(
    () =>
      [...new Set(pembangunan.map((item) => item.year))].sort((a, b) => b - a),
    [pembangunan]
  );

  // Memoized filtered data for Produk Hukum
  const filteredProdukHukum = useMemo(() => {
    return produkHukum
      .filter((item) =>
        hukumTahunFilter !== "all"
          ? item.year.toString() === hukumTahunFilter
          : true
      )
      .filter((item) =>
        hukumKategoriFilter !== "all"
          ? item.category === hukumKategoriFilter
          : true
      );
  }, [produkHukum, hukumTahunFilter, hukumKategoriFilter]);

  // Memoized filtered data for Pembangunan
  const filteredPembangunan = useMemo(() => {
    return pembangunan
      .filter((item) =>
        pembangunanTahunFilter !== "all"
          ? item.year.toString() === pembangunanTahunFilter
          : true
      )
      .filter((item) =>
        pembangunanStatusFilter !== "all"
          ? item.status === pembangunanStatusFilter
          : true
      );
  }, [pembangunan, pembangunanTahunFilter, pembangunanStatusFilter]);

  // Pagination logic for Produk Hukum
  const hukumPaginated = useMemo(() => {
    const startIndex = (hukumCurrentPage - 1) * hukumItemsPerPage;
    return filteredProdukHukum.slice(
      startIndex,
      startIndex + hukumItemsPerPage
    );
  }, [filteredProdukHukum, hukumCurrentPage, hukumItemsPerPage]);

  // Pagination logic for Pembangunan
  const pembangunanPaginated = useMemo(() => {
    const startIndex = (pembangunanCurrentPage - 1) * pembangunanItemsPerPage;
    return filteredPembangunan.slice(
      startIndex,
      startIndex + pembangunanItemsPerPage
    );
  }, [filteredPembangunan, pembangunanCurrentPage, pembangunanItemsPerPage]);

  const hukumTotalPages = Math.ceil(
    filteredProdukHukum.length / hukumItemsPerPage
  );
  const pembangunanTotalPages = Math.ceil(
    filteredPembangunan.length / pembangunanItemsPerPage
  );

  // Handlers for Modals and CRUD operations
  const handleOpenHukumModal = (item?: ProdukHukum) => {
    setEditingHukum(
      item || { year: new Date().getFullYear(), category: "Perdes" }
    );
    setIsHukumModalOpen(true);
  };

  const handleSaveHukum = async (e: FormEvent) => {
    e.preventDefault();
    setIsHukumSaving(true);
    try {
      const method = editingHukum.id ? "PUT" : "POST";
      await fetch("/api/produk-hukum", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editingHukum,
          id: editingHukum.id || undefined,
        }),
      });
      setIsHukumModalOpen(false);
      fetchAllData();
    } catch (error) {
      console.error("Gagal menyimpan produk hukum:", error);
    } finally {
      setIsHukumSaving(false);
    }
  };

  const handleDeleteHukum = (id: string) => {
    setConfirmAction({
      message: "Yakin ingin menghapus produk hukum ini?",
      action: async () => {
        await fetch("/api/produk-hukum", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        setConfirmAction(null);
        fetchAllData();
      },
    });
  };

  const handleOpenPembangunanModal = (item?: Pembangunan) => {
    setEditingPembangunan(
      item || { year: new Date().getFullYear(), status: "Direncanakan" }
    );
    setPembangunanImageFile(null);
    setIsPembangunanModalOpen(true);
  };

  const handleSavePembangunan = async (e: FormEvent) => {
    e.preventDefault();
    setIsPembangunanSaving(true);
    try {
      const formData = new FormData();
      Object.entries(editingPembangunan).forEach(([key, value]) =>
        formData.append(key, String(value))
      );
      if (pembangunanImageFile)
        formData.append("imageFile", pembangunanImageFile);

      const method = editingPembangunan.id ? "PUT" : "POST";
      await fetch("/api/pembangunan", { method, body: formData });
      setIsPembangunanModalOpen(false);
      fetchAllData();
    } catch (error) {
      console.error("Gagal menyimpan pembangunan:", error);
    } finally {
      setIsPembangunanSaving(false);
    }
  };

  const handleDeletePembangunan = (id: string) => {
    setConfirmAction({
      message: "Yakin ingin menghapus data pembangunan ini?",
      action: async () => {
        await fetch("/api/pembangunan", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        setConfirmAction(null);
        fetchAllData();
      },
    });
  };

  const handleSavePageData = async () => {
    setIsSavingPage(true);
    const formData = new FormData();
    const jsonData = {
      hero: { subtitle: pageData.hero?.subtitle },
      description: pageData.description,
    };
    formData.append("jsonData", JSON.stringify(jsonData));
    if (heroImageFile) formData.append("heroImageFile", heroImageFile);

    try {
      const response = await fetch("/api/produk-page", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
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
        <span className="ml-2">Memuat data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message="Data Halaman Produk Berhasil Disimpan!"
      />
      <ConfirmModal
        isOpen={!!confirmAction}
        onConfirm={confirmAction?.action || (() => {})}
        onCancel={() => setConfirmAction(null)}
        message={confirmAction?.message || ""}
      />
      <ProdukHukumModal
        isOpen={isHukumModalOpen}
        onClose={() => setIsHukumModalOpen(false)}
        onSubmit={handleSaveHukum}
        data={editingHukum}
        setData={setEditingHukum}
        isSaving={isHukumSaving}
      />
      <PembangunanModal
        isOpen={isPembangunanModalOpen}
        onClose={() => setIsPembangunanModalOpen(false)}
        onSubmit={handleSavePembangunan}
        data={editingPembangunan}
        setData={setEditingPembangunan}
        imageFile={pembangunanImageFile}
        setImageFile={setPembangunanImageFile}
        isSaving={isPembangunanSaving}
      />

      <PageHeader
        title="Kelola Produk Hukum & Fisik"
        description="Atur dokumen hukum dan data pembangunan desa"
      />

      <DataCard title="Konten Halaman Produk Hukum dan Fisik">
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

      <Tabs defaultValue="hukum" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="hukum">Produk Hukum</TabsTrigger>
          <TabsTrigger value="pembangunan">Pembangunan Fisik</TabsTrigger>
        </TabsList>

        <TabsContent value="hukum" className="space-y-4">
          <DataCard
            title="Daftar Produk Hukum"
            description="Dokumen peraturan dan keputusan desa"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <div className="flex flex-wrap gap-2">
                <Select
                  value={hukumTahunFilter}
                  onValueChange={(value) => {
                    setHukumTahunFilter(value);
                    setHukumCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Semua Tahun" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Tahun</SelectItem>
                    {hukumAvailableYears
                      .filter((year) => year != null)
                      .map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Select
                  value={hukumKategoriFilter}
                  onValueChange={(value) => {
                    setHukumKategoriFilter(value);
                    setHukumCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Semua Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kategori</SelectItem>
                    <SelectItem value="Perdes">Perdes</SelectItem>
                    <SelectItem value="Keputusan Desa">
                      Keputusan Desa
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => handleOpenHukumModal()}>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Baru
              </Button>
            </div>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Judul</TableHead>
                    <TableHead>Tahun</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead className="w-[100px]">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hukumPaginated.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.title}
                      </TableCell>
                      <TableCell>{item.year}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenHukumModal(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteHukum(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {hukumPaginated.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Tidak ada data yang cocok dengan filter.
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
              <Select
                value={hukumItemsPerPage.toString()}
                onValueChange={(value) => {
                  setHukumItemsPerPage(Number(value));
                  setHukumCurrentPage(1);
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
                  onClick={() => setHukumCurrentPage(1)}
                  disabled={hukumCurrentPage === 1}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setHukumCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={hukumCurrentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  Halaman {hukumCurrentPage} dari {hukumTotalPages || 1}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setHukumCurrentPage((p) => Math.min(hukumTotalPages, p + 1))
                  }
                  disabled={hukumCurrentPage === hukumTotalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setHukumCurrentPage(hukumTotalPages)}
                  disabled={hukumCurrentPage === hukumTotalPages}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DataCard>
        </TabsContent>

        <TabsContent value="pembangunan" className="space-y-4">
          <DataCard
            title="Daftar Pembangunan Fisik"
            description="Data proyek pembangunan dan infrastruktur desa"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <div className="flex flex-wrap gap-2">
                <Select
                  value={pembangunanTahunFilter}
                  onValueChange={(value) => {
                    setPembangunanTahunFilter(value);
                    setPembangunanCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Semua Tahun" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Tahun</SelectItem>
                    {pembangunanAvailableYears
                      .filter((year) => year != null)
                      .map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Select
                  value={pembangunanStatusFilter}
                  onValueChange={(value) => {
                    setPembangunanStatusFilter(value);
                    setPembangunanCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Semua Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="Selesai">Selesai</SelectItem>
                    <SelectItem value="Berlangsung">Berlangsung</SelectItem>
                    <SelectItem value="Direncanakan">Direncanakan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => handleOpenPembangunanModal()}>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Baru
              </Button>
            </div>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Proyek</TableHead>
                    <TableHead>Anggaran</TableHead>
                    <TableHead>Tahun</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pembangunanPaginated.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.title}
                      </TableCell>
                      <TableCell>{item.budget}</TableCell>
                      <TableCell>{item.year}</TableCell>
                      <TableCell>{item.status}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenPembangunanModal(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeletePembangunan(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {pembangunanPaginated.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Tidak ada data yang cocok dengan filter.
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
              <Select
                value={pembangunanItemsPerPage.toString()}
                onValueChange={(value) => {
                  setPembangunanItemsPerPage(Number(value));
                  setPembangunanCurrentPage(1);
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
                  onClick={() => setPembangunanCurrentPage(1)}
                  disabled={pembangunanCurrentPage === 1}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setPembangunanCurrentPage((p) => Math.max(1, p - 1))
                  }
                  disabled={pembangunanCurrentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  Halaman {pembangunanCurrentPage} dari{" "}
                  {pembangunanTotalPages || 1}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setPembangunanCurrentPage((p) =>
                      Math.min(pembangunanTotalPages, p + 1)
                    )
                  }
                  disabled={pembangunanCurrentPage === pembangunanTotalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setPembangunanCurrentPage(pembangunanTotalPages)
                  }
                  disabled={pembangunanCurrentPage === pembangunanTotalPages}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DataCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
