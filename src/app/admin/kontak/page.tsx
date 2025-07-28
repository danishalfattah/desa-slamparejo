"use client";
import { useState, useEffect, type ChangeEvent } from "react";
import type { Kontak, JamOperasionalItem } from "@/lib/types";
import Image from "next/image";
import { PageHeader } from "@/components/admin/page-header";
import { DataCard } from "@/components/admin/data-card";
import { SuccessModal } from "@/components/admin/success-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Save, Loader2 } from "lucide-react";

export default function ManageKontakPage() {
  const [data, setData] = useState<Partial<Kontak>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [heroImageError, setHeroImageError] = useState("");
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

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

  const handleJamOperasionalChange = (
    index: number,
    field: keyof Omit<JamOperasionalItem, "id" | "isLibur">,
    value: string
  ) => {
    const updatedJam = [...(data.jamOperasional || [])];
    updatedJam[index] = { ...updatedJam[index], [field]: value };
    setData((prev) => ({ ...prev, jamOperasional: updatedJam }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const formData = new FormData();

    const jsonData = { ...data };
    delete (jsonData as Partial<Kontak>).hero?.heroImage; // Don't send old image url

    formData.append("jsonData", JSON.stringify(jsonData));

    if (heroImageFile) {
      formData.append("heroImageFile", heroImageFile);
    }

    try {
      const response = await fetch("/api/kontak", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        setShowModal(true);
        setHeroImageFile(null);
        const freshData = await fetch("/api/kontak").then((res) => res.json());
        setData(freshData);
      } else alert("Gagal menyimpan data.");
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
              <Label htmlFor="page-description">Deskripsi Halaman</Label>
              <Textarea
                id="page-description"
                value={data.hero?.subtitle || ""}
                onChange={(e) => {
                  const newDescription = e.target.value;
                  setData((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, subtitle: newDescription },
                    description: newDescription,
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
              <Label htmlFor="phone">Nomor WhatsApp</Label>
              <Input
                id="phone"
                type="text"
                name="phone"
                value={data.phone || ""}
                onChange={(e) => handleChange(e)}
                placeholder="6281234567890"
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

        <DataCard
          title="Jam Operasional"
          description="Atur jadwal layanan kantor desa"
        >
          <div className="space-y-4">
            {data.jamOperasional && data.jamOperasional.length > 0 ? (
              data.jamOperasional.map((item, index) => (
                <div
                  key={item.id}
                  className="grid grid-cols-2 items-center gap-4 p-2 border rounded-md"
                >
                  <div className="space-y-2">
                    <Label htmlFor={`hari-${index}`}>Hari</Label>
                    <Input
                      id={`hari-${index}`}
                      value={item.hari}
                      onChange={(e) =>
                        handleJamOperasionalChange(
                          index,
                          "hari",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`jam-${index}`}>Jam</Label>
                    <Input
                      id={`jam-${index}`}
                      value={item.jam}
                      onChange={(e) =>
                        handleJamOperasionalChange(index, "jam", e.target.value)
                      }
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Tidak ada data jam operasional.
              </p>
            )}
          </div>
        </DataCard>
      </div>
    </div>
  );
}
