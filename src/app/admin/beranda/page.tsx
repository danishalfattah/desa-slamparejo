"use client";
import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import type { Beranda, FaqItem } from "@/lib/types";
import Image from "next/image";
import { PageHeader } from "@/components/admin/page-header";
import { DataCard } from "@/components/admin/data-card";
import { SuccessModal } from "@/components/admin/success-modal";
import { ConfirmModal } from "@/components/admin/confirm-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Save, Loader2 } from "lucide-react";

const FaqFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  faqData,
  setFaqData,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  faqData: FaqItem;
  setFaqData: (data: FaqItem) => void;
}) => {
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFaqData({ ...faqData, [name]: value });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {faqData.id ? "Edit FAQ" : "Tambah FAQ Baru"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question">Pertanyaan</Label>
            <Input
              id="question"
              name="question"
              value={faqData.question}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="answer">Jawaban</Label>
            <Textarea
              id="answer"
              name="answer"
              value={faqData.answer}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>
          <div className="flex justify-end gap-2">
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

export default function ManageBerandaPage() {
  const [data, setData] = useState<Partial<Beranda>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);

  const [confirmAction, setConfirmAction] = useState<{
    action: () => void;
    message: string;
  } | null>(null);

  const [launchingImageFile, setLaunchingImageFile] = useState<File | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/beranda");
        if (response.ok) setData(await response.json());
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section: keyof Beranda,
    field: string
  ) => {
    setData((prev) => ({
      ...prev,
      [section]: { ...(prev[section] as object), [field]: e.target.value },
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLaunchingImageFile(e.target.files[0]);
    }
  };

  const handleOpenFaqModal = (faqItem: FaqItem | null) => {
    setEditingFaq(faqItem || { id: "", question: "", answer: "" });
    setIsFaqModalOpen(true);
  };

  const handleCloseFaqModal = () => {
    setIsFaqModalOpen(false);
    setEditingFaq(null);
  };

  const handleSaveFaq = (e: FormEvent) => {
    e.preventDefault();
    if (!editingFaq) return;
    const updatedFaqList = editingFaq.id
      ? (data.faq || []).map((item) =>
          item.id === editingFaq.id ? editingFaq : item
        )
      : [...(data.faq || []), { ...editingFaq, id: crypto.randomUUID() }];
    setData((prev) => ({ ...prev, faq: updatedFaqList }));
    handleCloseFaqModal();
  };

  const handleDeleteFaq = (id: string) => {
    setConfirmAction({
      message: "Yakin ingin menghapus FAQ ini?",
      action: () => {
        setData((prev) => ({
          ...prev,
          faq: (prev.faq || []).filter((item) => item.id !== id),
        }));
        setConfirmAction(null);
      },
    });
  };

  const handleSaveAll = async () => {
    setIsSaving(true);

    const formData = new FormData();
    formData.append("jsonData", JSON.stringify(data));

    if (launchingImageFile) {
      formData.append("launchingImageFile", launchingImageFile);
    }

    try {
      const response = await fetch("/api/beranda", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        setShowSuccessModal(true);
        setLaunchingImageFile(null);
        const freshResponse = await fetch("/api/beranda");
        if (freshResponse.ok) setData(await freshResponse.json());
      } else {
        alert("Gagal menyimpan data.");
      }
    } catch (error) {
      console.error("Gagal menyimpan:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Memuat data beranda...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message="Data Halaman Beranda Berhasil Disimpan!"
      />

      <ConfirmModal
        isOpen={!!confirmAction}
        onConfirm={confirmAction?.action || (() => {})}
        onCancel={() => setConfirmAction(null)}
        message={confirmAction?.message || ""}
      />

      {isFaqModalOpen && editingFaq && (
        <FaqFormModal
          isOpen={isFaqModalOpen}
          onClose={handleCloseFaqModal}
          onSubmit={handleSaveFaq}
          faqData={editingFaq}
          setFaqData={setEditingFaq}
        />
      )}

      <PageHeader
        title="Kelola Halaman Beranda"
        description="Atur konten utama yang akan ditampilkan di halaman beranda website"
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

      <div className="grid gap-6">
        {/* Hero Section */}
        <DataCard
          title="Bagian Hero"
          description="Konten utama yang pertama dilihat pengunjung"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hero-title">Judul Hero</Label>
              <Input
                id="hero-title"
                value={data.hero?.title || ""}
                onChange={(e) => handleInputChange(e, "hero", "title")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero-subtitle">Subjudul Hero</Label>
              <Textarea
                id="hero-subtitle"
                value={data.hero?.subtitle || ""}
                onChange={(e) => handleInputChange(e, "hero", "subtitle")}
                rows={3}
              />
            </div>
          </div>
        </DataCard>

        {/* Slogan Section */}
        <DataCard title="Bagian Slogan" description="Slogan dan deskripsi desa">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="slogan-title">Judul Slogan</Label>
              <Input
                id="slogan-title"
                value={data.slogan?.title || ""}
                onChange={(e) => handleInputChange(e, "slogan", "title")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slogan-description">Deskripsi Slogan</Label>
              <Textarea
                id="slogan-description"
                value={data.slogan?.description || ""}
                onChange={(e) => handleInputChange(e, "slogan", "description")}
                rows={3}
              />
            </div>
          </div>
        </DataCard>

        {/* Launching Section */}
        <DataCard
          title="Bagian Launching"
          description="Informasi program atau kegiatan terbaru"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="launching-title">Judul Launching</Label>
              <Input
                id="launching-title"
                value={data.launching?.title || ""}
                onChange={(e) => handleInputChange(e, "launching", "title")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="launching-description">Deskripsi Launching</Label>
              <Textarea
                id="launching-description"
                value={data.launching?.description || ""}
                onChange={(e) =>
                  handleInputChange(e, "launching", "description")
                }
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="launching-image">Gambar Launching</Label>
              {data.launching?.image && (
                <div className="mb-2">
                  <p className="text-sm text-muted-foreground mb-2">
                    Gambar saat ini:
                  </p>
                  <Image
                    src={data.launching.image || "/placeholder.svg"}
                    alt="Preview"
                    width={200}
                    height={112}
                    className="rounded-md object-cover border"
                  />
                </div>
              )}
              <Input
                id="launching-image"
                type="file"
                onChange={handleFileChange}
                accept="image/png, image/jpeg, image/jpg"
              />
              <p className="text-sm text-muted-foreground">
                Unggah file baru untuk mengganti gambar saat ini.
              </p>
            </div>
          </div>
        </DataCard>

        {/* FAQ Section */}
        <DataCard
          title="Bagian FAQ"
          description="Pertanyaan yang sering diajukan"
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Daftar FAQ</h3>
              <Button onClick={() => handleOpenFaqModal(null)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Tambah FAQ
              </Button>
            </div>
            <div className="space-y-3">
              {(data.faq || []).map((item) => (
                <Card key={item.id}>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 space-y-1">
                        <h4 className="font-medium">{item.question}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {item.answer}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenFaqModal(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteFaq(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {(!data.faq || data.faq.length === 0) && (
                <p className="text-center text-muted-foreground py-8">
                  {`Belum ada FAQ. Klik tombol "Tambah FAQ" untuk menambahkan.`}
                </p>
              )}
            </div>
          </div>
        </DataCard>
      </div>
    </div>
  );
}
