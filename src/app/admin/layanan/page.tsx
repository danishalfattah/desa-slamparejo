"use client";
import { useState, useEffect } from "react";
import type { Layanan } from "@/lib/types";
import Image from "next/image";
import { PageHeader } from "@/components/admin/page-header";
import { DataCard } from "@/components/admin/data-card";
import { SuccessModal } from "@/components/admin/success-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save, Loader2 } from "lucide-react";

export default function ManageLayananPage() {
  const [data, setData] = useState<Partial<Layanan>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);

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

  const handleSave = async () => {
    setIsSaving(true);

    const formData = new FormData();
    const jsonData = {
      hero: { subtitle: data.hero?.subtitle },
      formLink: data.formLink,
    };
    formData.append("jsonData", JSON.stringify(jsonData));

    if (heroImageFile) {
      formData.append("heroImageFile", heroImageFile);
    }

    try {
      const response = await fetch("/api/layanan", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setShowModal(true);
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
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        message="Data Halaman Layanan Berhasil Disimpan!"
      />

      <PageHeader
        title="Kelola Halaman Layanan"
        description="Atur konten dan formulir layanan desa"
      >
        <Button onClick={handleSave} disabled={isSaving}>
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
        description="Atur teks dan formulir layanan"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="heroSubtitle">Subjudul Halaman</Label>
            <Textarea
              id="heroSubtitle"
              value={data.hero?.subtitle || ""}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  hero: { ...prev.hero, subtitle: e.target.value },
                }))
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
            <Label htmlFor="formLink">Link Google Form (Embed)</Label>
            <Input
              id="formLink"
              type="text"
              value={data.formLink || ""}
              onChange={(e) =>
                setData((prev) => ({ ...prev, formLink: e.target.value }))
              }
              placeholder="https://docs.google.com/forms/d/e/.../viewform?embedded=true"
            />
          </div>
        </div>
      </DataCard>
    </div>
  );
}
