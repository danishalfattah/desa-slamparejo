"use client";

import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import type { PerangkatDesa } from "@/lib/types";
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
import { Plus, Edit, Trash2, Save, Loader2 } from "lucide-react";

const PerangkatFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  perangkat,
  setPerangkat,
  setImageFile,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  perangkat: Partial<PerangkatDesa>;
  setPerangkat: (data: Partial<PerangkatDesa>) => void;
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
}) => {
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPerangkat({ ...perangkat, [name]: value });
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
            />
            <p className="text-sm text-muted-foreground">
              {perangkat.id
                ? "Unggah file baru untuk mengganti gambar."
                : "File gambar wajib diunggah."}
            </p>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Simpan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default function ManagePerangkatDesaPage() {
  const [perangkatList, setPerangkatList] = useState<PerangkatDesa[]>([]);
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

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/perangkat-desa");
      const data = await response.json();
      setPerangkatList(data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
        await fetch("/api/perangkat-desa", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        setConfirmAction(null);
        fetchData();
      },
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
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
    } else {
      const errorData = await response.json();
      alert(`Gagal menyimpan data: ${errorData.error}`);
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
      />

      <PageHeader
        title="Kelola Perangkat Desa"
        description="Atur data aparatur dan perangkat desa"
      >
        <Button onClick={() => handleOpenModal()}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Perangkat Baru
        </Button>
      </PageHeader>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Jabatan</TableHead>
              <TableHead className="w-[100px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {perangkatList.map((perangkat) => (
              <TableRow key={perangkat.id}>
                <TableCell className="font-medium">{perangkat.name}</TableCell>
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
                      variant="outline"
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
        {perangkatList.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            {`Belum ada data perangkat. Klik tombol "Tambah Perangkat Baru" untuk
            menambahkan.`}
          </div>
        )}
      </div>
    </div>
  );
}
