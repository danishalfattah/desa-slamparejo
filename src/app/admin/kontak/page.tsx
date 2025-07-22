"use client";
import { useState, useEffect, type ChangeEvent } from "react";
import type { Kontak } from "@/lib/types";
import { PageHeader } from "@/components/admin/page-header";
import { DataCard } from "@/components/admin/data-card";
import { SuccessModal } from "@/components/admin/success-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save, Loader2 } from "lucide-react";

export default function ManageKontakPage() {
  const [data, setData] = useState<Partial<Kontak>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/kontak");
        if (response.ok) setData(await response.json());
      } catch (error) {
        console.error("Gagal mengambil data kontak:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section?: keyof Kontak,
    field?: string
  ) => {
    const { name, value } = e.target;
    if (section && field) {
      setData((prev) => ({
        ...prev,
        [section]: { ...(prev[section] as object), [field]: value },
      }));
    } else {
      setData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/kontak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) setShowModal(true);
      else alert("Gagal menyimpan data.");
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Memuat data kontak...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SuccessModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        message="Data Halaman Kontak Berhasil Disimpan!"
      />

      <PageHeader
        title="Kelola Halaman Kontak"
        description="Atur informasi kontak dan lokasi desa"
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

      <div className="grid gap-6">
        <DataCard
          title="Teks Halaman"
          description="Konten utama halaman kontak"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="heroSubtitle">Subjudul Hero</Label>
              <Textarea
                id="heroSubtitle"
                name="heroSubtitle"
                value={data.heroSubtitle || ""}
                onChange={(e) => handleChange(e)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi Kontak</Label>
              <Textarea
                id="description"
                name="description"
                value={data.description || ""}
                onChange={(e) => handleChange(e)}
                rows={3}
              />
            </div>
          </div>
        </DataCard>

        <DataCard
          title="Informasi Kontak & Lokasi"
          description="Detail kontak dan alamat desa"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Resmi</Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={data.email || ""}
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telepon Kantor</Label>
              <Input
                id="phone"
                type="text"
                name="phone"
                value={data.phone || ""}
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram Handle</Label>
              <Input
                id="instagram"
                type="text"
                name="instagram"
                value={data.instagram || ""}
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagramUrl">URL Instagram</Label>
              <Input
                id="instagramUrl"
                type="text"
                name="instagramUrl"
                value={data.instagramUrl || ""}
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">
                Alamat (pisahkan baris dengan enter)
              </Label>
              <Textarea
                id="address"
                value={data.lokasi?.address || ""}
                onChange={(e) => handleChange(e, "lokasi", "address")}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mapUrl">URL Google Maps (Embed)</Label>
              <Input
                id="mapUrl"
                type="text"
                value={data.lokasi?.mapUrl || ""}
                onChange={(e) => handleChange(e, "lokasi", "mapUrl")}
              />
            </div>
          </div>
        </DataCard>
      </div>
    </div>
  );
}
