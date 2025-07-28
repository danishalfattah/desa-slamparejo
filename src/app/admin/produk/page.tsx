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
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  Settings,
} from "lucide-react";
import { SuccessModal } from "@/components/admin/success-modal";
import { Separator } from "@/components/ui/separator";
import React from "react";

interface Category {
  id: string;
  name: string;
}

// --- Komponen Modal untuk Kelola Kategori ---
const ManageCategoryModal = ({
  isOpen,
  onClose,
  categories,
  onDeleteCategory,
  onEditCategory,
  isSaving,
}: {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onDeleteCategory: (id: string, name: string) => void;
  onEditCategory: (id: string, oldName: string, newName: string) => void;
  isSaving: boolean;
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const handleEditClick = (category: Category) => {
    setEditingId(category.id);
    setEditingName(category.name);
  };

  const handleSaveEdit = () => {
    if (editingId && editingName.trim()) {
      const oldCategory = categories.find((c) => c.id === editingId);
      if (oldCategory) {
        onEditCategory(editingId, oldCategory.name, editingName.trim());
        setEditingId(null);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kelola Kategori Produk Hukum</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Ubah atau hapus nama kategori yang sudah ada. Kategori default tidak
            dapat dihapus.
          </p>
          <div className="mt-2 space-y-1 max-h-72 overflow-y-auto border rounded-md p-1">
            {categories.map((cat, index) => (
              <React.Fragment key={cat.id}>
                <div className="flex items-center justify-between hover:bg-muted/50 p-2 rounded-md">
                  {editingId === cat.id ? (
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="h-8"
                      autoFocus
                      onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
                    />
                  ) : (
                    <span className="text-sm">{cat.name}</span>
                  )}

                  <div className="flex items-center gap-1">
                    {editingId === cat.id ? (
                      <>
                        <Button
                          size="sm"
                          onClick={handleSaveEdit}
                          disabled={isSaving}
                        >
                          Simpan
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancelEdit}
                        >
                          Batal
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(cat)}
                          disabled={isSaving}
                          className="h-8 w-8"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {cat.name !== "Perdes" &&
                          cat.name !== "Keputusan Desa" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onDeleteCategory(cat.id, cat.name)}
                              disabled={isSaving}
                              className="h-8 w-8"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                      </>
                    )}
                  </div>
                </div>
                {index < categories.length - 1 && <Separator />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// --- Komponen Modal untuk Tambah Kategori ---
const AddCategoryModal = ({
  isOpen,
  onClose,
  onSave,
  isSaving,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => Promise<void>;
  isSaving: boolean;
}) => {
  const [name, setName] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(name).then(() => setName(""));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Tambah Kategori Baru</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-category-name">Nama Kategori</Label>
            <Input
              id="new-category-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSaving}
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSaving}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSaving || !name.trim()}>
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Simpan"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const ProdukHukumModal = ({
  isOpen,
  onClose,
  onSubmit,
  data,
  setData,
  isSaving,
  categories,
  onOpenAddCategoryModal,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  data: Partial<ProdukHukum>;
  setData: (data: Partial<ProdukHukum>) => void;
  isSaving: boolean;
  categories: Category[];
  onOpenAddCategoryModal: () => void;
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
                value={data.category || undefined}
                onValueChange={(value) => {
                  if (value === "add-new") {
                    onOpenAddCategoryModal();
                  } else {
                    handleChange("category", value);
                  }
                }}
                disabled={isSaving}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                  <Separator className="my-1" />
                  <SelectItem
                    value="add-new"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <div className="flex items-center">
                      <Plus className="h-4 w-4 mr-2" />
                      <span>Tambah Kategori Baru</span>
                    </div>
                  </SelectItem>
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
            <Button type="submit" disabled={isSaving || !data.category}>
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
  setImageBeforeFile,
  setImageAfterFile,
  isSaving,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  data: Partial<Pembangunan>;
  setData: (data: Partial<Pembangunan>) => void;
  setImageBeforeFile: (file: File | null) => void;
  setImageAfterFile: (file: File | null) => void;
  isSaving: boolean;
}) => {
  const [beforeFileError, setBeforeFileError] = useState("");
  const [afterFileError, setAfterFileError] = useState("");
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

  const handleChange = (name: string, value: string | number) => {
    const updatedData = {
      ...data,
      [name]: name === "year" ? Number(value) : value,
    };
    if (name === "status" && value !== "Selesai") {
      // Clear after image if status is no longer 'Selesai'
      delete updatedData.imageAfter;
      setImageAfterFile(null);
    }
    setData(updatedData);
  };

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    type: "before" | "after"
  ) => {
    const file = e.target.files?.[0];
    const errorSetter =
      type === "before" ? setBeforeFileError : setAfterFileError;
    const fileSetter =
      type === "before" ? setImageBeforeFile : setImageAfterFile;

    errorSetter("");
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        errorSetter("Ukuran file tidak boleh melebihi 2MB.");
        e.target.value = "";
        fileSetter(null);
        return;
      }
      fileSetter(file);
    }
  };

  const isSelesai = data.status === "Selesai";

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
            <Label>Gambar Pembangunan</Label>
            {data.id && (data.imageBefore || data.imageAfter) && (
              <div className="mb-2">
                <p className="text-sm text-muted-foreground mb-2">
                  Gambar saat ini:
                </p>
                <div className="flex gap-2">
                  {data.imageBefore && (
                    <div>
                      <p className="text-xs text-center mb-1">Sebelum</p>
                      <Image
                        src={data.imageBefore}
                        alt="Gambar Sebelum"
                        width={80}
                        height={80}
                        className="rounded-md object-cover border"
                      />
                    </div>
                  )}
                  {data.imageAfter && (
                    <div>
                      <p className="text-xs text-center mb-1">Sesudah</p>
                      <Image
                        src={data.imageAfter}
                        alt="Gambar Sesudah"
                        width={80}
                        height={80}
                        className="rounded-md object-cover border"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="imageBeforeFile">Foto Sebelum</Label>
                <Input
                  id="imageBeforeFile"
                  type="file"
                  onChange={(e) => handleFileChange(e, "before")}
                  accept="image/*"
                  required={!data.id}
                  disabled={isSaving}
                />
                {beforeFileError && (
                  <Alert variant="destructive" className="mt-2 text-xs">
                    <AlertDescription>{beforeFileError}</AlertDescription>
                  </Alert>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageAfterFile">Foto Sesudah</Label>
                <Input
                  id="imageAfterFile"
                  type="file"
                  onChange={(e) => handleFileChange(e, "after")}
                  accept="image/*"
                  required={!data.id && isSelesai}
                  disabled={isSaving || !isSelesai}
                />
                {afterFileError && (
                  <Alert variant="destructive" className="mt-2 text-xs">
                    <AlertDescription>{afterFileError}</AlertDescription>
                  </Alert>
                )}
                {!isSelesai && (
                  <p className="text-xs text-muted-foreground">
                    {`Hanya bisa diisi jika status "Selesai".`}
                  </p>
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground pt-2">
              {data.id
                ? "Unggah file baru untuk mengganti gambar. Maks 2MB."
                : "Gambar 'Sebelum' wajib diunggah. Maks 2MB."}
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
                value={data.status || "Direncanakan"}
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
  const [produkHukum, setProdukHukum] = useState<ProdukHukum[]>([]);
  const [pembangunan, setPembangunan] = useState<Pembangunan[]>([]);
  const [pageData, setPageData] = useState<Partial<ProdukPageData>>({});
  const [categories, setCategories] = useState<Category[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSavingPage, setIsSavingPage] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [heroImageError, setHeroImageError] = useState("");
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

  const [isHukumModalOpen, setIsHukumModalOpen] = useState(false);
  const [editingHukum, setEditingHukum] = useState<Partial<ProdukHukum>>({});
  const [isPembangunanModalOpen, setIsPembangunanModalOpen] = useState(false);
  const [editingPembangunan, setEditingPembangunan] = useState<
    Partial<Pembangunan>
  >({});
  const [pembangunanImageBeforeFile, setPembangunanImageBeforeFile] =
    useState<File | null>(null);
  const [pembangunanImageAfterFile, setPembangunanImageAfterFile] =
    useState<File | null>(null);

  const [confirmAction, setConfirmAction] = useState<{
    action: () => void;
    message: string;
  } | null>(null);
  const [isHukumSaving, setIsHukumSaving] = useState(false);
  const [isPembangunanSaving, setIsPembangunanSaving] = useState(false);

  const [hukumCurrentPage, setHukumCurrentPage] = useState(1);
  const [hukumItemsPerPage, setHukumItemsPerPage] = useState(10);
  const [hukumTahunFilter, setHukumTahunFilter] = useState("all");
  const [hukumKategoriFilter, setHukumKategoriFilter] = useState("all");

  const [pembangunanCurrentPage, setPembangunanCurrentPage] = useState(1);
  const [pembangunanItemsPerPage, setPembangunanItemsPerPage] = useState(10);
  const [pembangunanTahunFilter, setPembangunanTahunFilter] = useState("all");
  const [pembangunanStatusFilter, setPembangunanStatusFilter] = useState("all");
  const [isManageCategoryModalOpen, setIsManageCategoryModalOpen] =
    useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isCategorySaving, setIsCategorySaving] = useState(false);

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

  const fetchCategories = async () => {
    try {
      const kategoriRes = await fetch("/api/produk-hukum-kategori");
      if (kategoriRes.ok) {
        setCategories(await kategoriRes.json());
      }
    } catch (error) {
      console.error("Gagal mengambil kategori:", error);
    }
  };

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [hukumRes, pembangunanRes, pageRes, kategoriRes] =
        await Promise.all([
          fetch("/api/produk-hukum"),
          fetch("/api/pembangunan"),
          fetch("/api/produk-page"),
          fetch("/api/produk-hukum-kategori"),
        ]);
      setProdukHukum(await hukumRes.json());
      setPembangunan(await pembangunanRes.json());
      setPageData(await pageRes.json());
      setCategories(await kategoriRes.json());
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleAddCategory = async (name: string) => {
    setIsCategorySaving(true);
    try {
      const response = await fetch("/api/produk-hukum-kategori", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (response.ok) {
        const newCat = await response.json();
        setSuccessMessage("Kategori baru berhasil ditambahkan!");
        setShowSuccessModal(true);
        await fetchCategories();
        setEditingHukum((prev) => ({ ...prev, category: newCat.name }));
        setIsAddCategoryModalOpen(false);
      } else {
        alert("Gagal menambahkan kategori. Mungkin sudah ada.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsCategorySaving(false);
    }
  };

  const handleDeleteCategory = (id: string, name: string) => {
    setConfirmAction({
      message: `Yakin ingin menghapus kategori "${name}"? Ini tidak akan menghapus produk hukum yang sudah ada.`,
      action: async () => {
        setIsCategorySaving(true);
        try {
          await fetch("/api/produk-hukum-kategori", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
          });
          setSuccessMessage("Kategori berhasil dihapus!");
          setShowSuccessModal(true);
          await fetchCategories();
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          alert("Gagal menghapus kategori.");
        } finally {
          setIsCategorySaving(false);
          setConfirmAction(null);
        }
      },
    });
  };

  const handleEditCategory = async (
    id: string,
    oldName: string,
    newName: string
  ) => {
    if (newName === oldName) return;
    setIsCategorySaving(true);
    try {
      await fetch("/api/produk-hukum-kategori", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, newName, oldName }),
      });
      setSuccessMessage("Kategori berhasil diperbarui!");
      setShowSuccessModal(true);
      await fetchAllData();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("Gagal mengedit kategori.");
    } finally {
      setIsCategorySaving(false);
    }
  };

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

  const hukumPaginated = useMemo(() => {
    const startIndex = (hukumCurrentPage - 1) * hukumItemsPerPage;
    return filteredProdukHukum.slice(
      startIndex,
      startIndex + hukumItemsPerPage
    );
  }, [filteredProdukHukum, hukumCurrentPage, hukumItemsPerPage]);

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

  const handleOpenHukumModal = (item?: ProdukHukum) => {
    setEditingHukum(item || { year: new Date().getFullYear(), category: "" });
    setIsHukumModalOpen(true);
  };

  const handleSaveHukum = async (e: FormEvent) => {
    e.preventDefault();
    setIsHukumSaving(true);
    try {
      const method = editingHukum.id ? "PUT" : "POST";
      const response = await fetch("/api/produk-hukum", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editingHukum,
          id: editingHukum.id || undefined,
        }),
      });
      if (response.ok) {
        setIsHukumModalOpen(false);
        fetchAllData();
        setSuccessMessage("Produk hukum berhasil disimpan!");
        setShowSuccessModal(true);
      }
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
        const response = await fetch("/api/produk-hukum", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        setConfirmAction(null);
        if (response.ok) {
          fetchAllData();
          setSuccessMessage("Produk hukum berhasil dihapus!");
          setShowSuccessModal(true);
        }
      },
    });
  };

  const handleOpenPembangunanModal = (item?: Pembangunan) => {
    setEditingPembangunan(
      item || { year: new Date().getFullYear(), status: "Direncanakan" }
    );
    setPembangunanImageBeforeFile(null);
    setPembangunanImageAfterFile(null);
    setIsPembangunanModalOpen(true);
  };

  const handleSavePembangunan = async (e: FormEvent) => {
    e.preventDefault();

    if (
      editingPembangunan.status === "Selesai" &&
      !pembangunanImageAfterFile &&
      !editingPembangunan.imageAfter
    ) {
      alert("Untuk status 'Selesai', gambar 'Sesudah' wajib diunggah.");
      return;
    }

    setIsPembangunanSaving(true);
    try {
      const formData = new FormData();
      Object.entries(editingPembangunan).forEach(([key, value]) => {
        if (value) {
          formData.append(key, String(value));
        }
      });
      if (pembangunanImageBeforeFile)
        formData.append("imageBeforeFile", pembangunanImageBeforeFile);
      if (pembangunanImageAfterFile && editingPembangunan.status === "Selesai")
        formData.append("imageAfterFile", pembangunanImageAfterFile);

      const method = editingPembangunan.id ? "PUT" : "POST";
      const response = await fetch("/api/pembangunan", {
        method,
        body: formData,
      });
      if (response.ok) {
        setIsPembangunanModalOpen(false);
        fetchAllData();
        setSuccessMessage("Data pembangunan berhasil disimpan!");
        setShowSuccessModal(true);
      }
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
        const response = await fetch("/api/pembangunan", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        setConfirmAction(null);
        if (response.ok) {
          fetchAllData();
          setSuccessMessage("Data pembangunan berhasil dihapus!");
          setShowSuccessModal(true);
        }
      },
    });
  };

  const handleSavePageData = async () => {
    setIsSavingPage(true);
    const formData = new FormData();
    const jsonData = {
      hero: { subtitle: pageData.description },
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
        setSuccessMessage("Konten halaman berhasil disimpan!");
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
        message={successMessage}
      />
      <ConfirmModal
        isOpen={!!confirmAction}
        onConfirm={confirmAction?.action || (() => {})}
        onCancel={() => setConfirmAction(null)}
        message={confirmAction?.message || ""}
      />

      <AddCategoryModal
        isOpen={isAddCategoryModalOpen}
        onClose={() => setIsAddCategoryModalOpen(false)}
        onSave={handleAddCategory}
        isSaving={isCategorySaving}
      />
      <ManageCategoryModal
        isOpen={isManageCategoryModalOpen}
        onClose={() => setIsManageCategoryModalOpen(false)}
        categories={categories}
        onDeleteCategory={handleDeleteCategory}
        onEditCategory={handleEditCategory}
        isSaving={isCategorySaving}
      />

      <ProdukHukumModal
        isOpen={isHukumModalOpen}
        onClose={() => setIsHukumModalOpen(false)}
        onSubmit={handleSaveHukum}
        data={editingHukum}
        setData={setEditingHukum}
        isSaving={isHukumSaving}
        categories={categories}
        onOpenAddCategoryModal={() => setIsAddCategoryModalOpen(true)}
      />
      <PembangunanModal
        isOpen={isPembangunanModalOpen}
        onClose={() => setIsPembangunanModalOpen(false)}
        onSubmit={handleSavePembangunan}
        data={editingPembangunan}
        setData={setEditingPembangunan}
        setImageBeforeFile={setPembangunanImageBeforeFile}
        setImageAfterFile={setPembangunanImageAfterFile}
        isSaving={isPembangunanSaving}
      />

      <PageHeader
        title="Kelola Produk Hukum & Fisik"
        description="Atur dokumen hukum dan data pembangunan desa"
      />

      <DataCard title="Konten Halaman Produk Hukum dan Fisik">
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
                  <SelectTrigger className="w-full sm:w-[180px]">
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
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Semua Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kategori</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsManageCategoryModalOpen(true)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Kelola Kategori
                </Button>
                <Button onClick={() => handleOpenHukumModal()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Baru
                </Button>
              </div>
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
                            variant="destructive"
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
                            variant="destructive"
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
