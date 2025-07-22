"use client";
import { useState, useEffect } from "react";
import type { Profil, DemografiRow } from "@/lib/types";
import { PageHeader } from "@/components/admin/page-header";
import { DataCard } from "@/components/admin/data-card";
import { SuccessModal } from "@/components/admin/success-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Loader2 } from "lucide-react";

export default function ManageProfilPage() {
  const [data, setData] = useState<Partial<Profil>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/profil-desa");
        if (response.ok) setData(await response.json());
      } catch (error) {
        console.error("Gagal mengambil data profil:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleNestedChange = (
    section: keyof Profil,
    field: string,
    value: string
  ) => {
    setData((prev) => ({
      ...prev,
      [section]: { ...(prev[section] as object), [field]: value },
    }));
  };

  const handleDemografiTableChange = (
    index: number,
    field: keyof DemografiRow,
    value: string
  ) => {
    const newTableData = [...(data.demografi?.tabelData || [])];
    newTableData[index] = { ...newTableData[index], [field]: value };

    setData((prev) => ({
      ...prev,
      demografi: {
        ...(prev.demografi as object),
        tabelData: newTableData,
      } as Profil["demografi"],
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/profil-desa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        setShowModal(true);
      } else {
        alert("Gagal menyimpan data.");
      }
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
        <span className="ml-2">Memuat data profil...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SuccessModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        message="Data Halaman Profil Berhasil Disimpan!"
      />

      <PageHeader
        title="Kelola Halaman Profil"
        description="Atur profil, visi misi, demografi, dan sejarah desa"
      >
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {isSaving ? "Menyimpan..." : "Simpan Semua Perubahan"}
        </Button>
      </PageHeader>

      <div className="grid gap-6">
        {/* Video Profil */}
        <DataCard
          title="Video Profil"
          description="Video profil desa dari YouTube"
        >
          <div className="space-y-2">
            <Label htmlFor="youtube-url">Link Video YouTube</Label>
            <Input
              id="youtube-url"
              type="text"
              value={data.video?.url || ""}
              onChange={(e) =>
                handleNestedChange("video", "url", e.target.value)
              }
              placeholder="https://www.youtube.com/watch?v=..."
            />
            <p className="text-sm text-muted-foreground">
              Masukkan link YouTube untuk video profil desa yang akan
              ditampilkan di halaman profil
            </p>
          </div>
        </DataCard>

        {/* Visi Misi */}
        <DataCard title="Visi & Misi" description="Visi dan misi desa">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="visi-description">Deskripsi Singkat</Label>
              <Textarea
                id="visi-description"
                value={data.visiMisi?.description || ""}
                onChange={(e) =>
                  handleNestedChange("visiMisi", "description", e.target.value)
                }
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="visi">Visi</Label>
              <Textarea
                id="visi"
                value={data.visiMisi?.visi || ""}
                onChange={(e) =>
                  handleNestedChange("visiMisi", "visi", e.target.value)
                }
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="misi">
                Misi (pisahkan tiap poin dengan baris baru)
              </Label>
              <Textarea
                id="misi"
                value={data.visiMisi?.misi || ""}
                onChange={(e) =>
                  handleNestedChange("visiMisi", "misi", e.target.value)
                }
                rows={6}
              />
            </div>
          </div>
        </DataCard>

        {/* Demografi */}
        <DataCard
          title="Demografi"
          description="Data kependudukan dan wilayah desa"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="demo-description">Deskripsi Demografi</Label>
              <Textarea
                id="demo-description"
                value={data.demografi?.description || ""}
                onChange={(e) =>
                  handleNestedChange("demografi", "description", e.target.value)
                }
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="peta-url">URL Peta Google Maps (Embed)</Label>
              <Input
                id="peta-url"
                type="text"
                value={data.demografi?.petaUrl || ""}
                onChange={(e) =>
                  handleNestedChange("demografi", "petaUrl", e.target.value)
                }
                placeholder="https://www.google.com/maps/embed?pb=..."
              />
              <p className="text-sm text-muted-foreground">
                Masukkan link embed Google Maps untuk menampilkan peta lokasi
                desa
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="total-penduduk">Total Penduduk</Label>
                <Input
                  id="total-penduduk"
                  type="text"
                  value={data.demografi?.totalPenduduk || ""}
                  onChange={(e) =>
                    handleNestedChange(
                      "demografi",
                      "totalPenduduk",
                      e.target.value
                    )
                  }
                  placeholder="5.982 JIWA"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="laki-laki">Laki-laki</Label>
                <Input
                  id="laki-laki"
                  type="text"
                  value={data.demografi?.lakiLaki || ""}
                  onChange={(e) =>
                    handleNestedChange("demografi", "lakiLaki", e.target.value)
                  }
                  placeholder="2.991 JIWA"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="perempuan">Perempuan</Label>
                <Input
                  id="perempuan"
                  type="text"
                  value={data.demografi?.perempuan || ""}
                  onChange={(e) =>
                    handleNestedChange("demografi", "perempuan", e.target.value)
                  }
                  placeholder="2.991 JIWA"
                />
              </div>
            </div>
            <div className="space-y-4">
              <Label>Tabel Wilayah</Label>
              {(data.demografi?.tabelData || []).map((row, index) => (
                <Card key={row.id}>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Data Wilayah {index + 1}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`wilayah-${index}`}>Nama Wilayah</Label>
                        <Input
                          id={`wilayah-${index}`}
                          value={row.wilayah}
                          onChange={(e) =>
                            handleDemografiTableChange(
                              index,
                              "wilayah",
                              e.target.value
                            )
                          }
                          placeholder="Contoh: Krajan"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`penduduk-${index}`}>
                          Jumlah Penduduk
                        </Label>
                        <Input
                          id={`penduduk-${index}`}
                          value={row.penduduk}
                          onChange={(e) =>
                            handleDemografiTableChange(
                              index,
                              "penduduk",
                              e.target.value
                            )
                          }
                          placeholder="Contoh: 2.991 JIWA"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`rt-${index}`}>Jumlah RT</Label>
                        <Input
                          id={`rt-${index}`}
                          value={row.rt}
                          onChange={(e) =>
                            handleDemografiTableChange(
                              index,
                              "rt",
                              e.target.value
                            )
                          }
                          placeholder="Contoh: 17 RT"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`rw-${index}`}>Jumlah RW</Label>
                        <Input
                          id={`rw-${index}`}
                          value={row.rw}
                          onChange={(e) =>
                            handleDemografiTableChange(
                              index,
                              "rw",
                              e.target.value
                            )
                          }
                          placeholder="Contoh: 2 RW"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </DataCard>

        {/* Sejarah */}
        <DataCard title="Sejarah" description="Sejarah dan latar belakang desa">
          <div className="space-y-2">
            <Label htmlFor="sejarah">
              Narasi Sejarah (pisahkan paragraf dengan baris baru)
            </Label>
            <Textarea
              id="sejarah"
              value={data.sejarah?.description || ""}
              onChange={(e) =>
                handleNestedChange("sejarah", "description", e.target.value)
              }
              rows={10}
              placeholder="Masukkan sejarah desa, asal usul nama, perkembangan dari masa ke masa..."
            />
          </div>
        </DataCard>
      </div>
    </div>
  );
}
