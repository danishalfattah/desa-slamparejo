"use client";
import { useState, useEffect } from "react";
import { Profil, DemografiRow } from "@/lib/types";
const SuccessModal = ({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-xl text-center">
      <p className="mb-4">{message}</p>
      <button
        onClick={onClose}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Tutup
      </button>
    </div>
  </div>
);

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

  if (isLoading)
    return <div className="text-center p-10">Memuat data profil...</div>;

  return (
    <div>
      {showModal && (
        <SuccessModal
          message="Data Halaman Profil Berhasil Disimpan!"
          onClose={() => setShowModal(false)}
        />
      )}
      <h1 className="text-3xl font-bold mb-6">Kelola Halaman Profil</h1>

      <div className="space-y-6">
        {/* Visi Misi */}
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">Visi & Misi</h2>
          <div>
            <label className="block font-medium mb-1">Deskripsi Singkat</label>
            <textarea
              value={data.visiMisi?.description || ""}
              onChange={(e) =>
                handleNestedChange("visiMisi", "description", e.target.value)
              }
              className="w-full p-2 border rounded-md"
              rows={3}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Visi</label>
            <textarea
              value={data.visiMisi?.visi || ""}
              onChange={(e) =>
                handleNestedChange("visiMisi", "visi", e.target.value)
              }
              className="w-full p-2 border rounded-md"
              rows={4}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">
              Misi (pisahkan tiap poin dengan baris baru)
            </label>
            <textarea
              value={data.visiMisi?.misi || ""}
              onChange={(e) =>
                handleNestedChange("visiMisi", "misi", e.target.value)
              }
              className="w-full p-2 border rounded-md"
              rows={6}
            />
          </div>
        </div>

        {/* Demografi */}
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">Demografi</h2>
          <div>
            <label className="block font-medium mb-1">
              Deskripsi Demografi
            </label>
            <textarea
              value={data.demografi?.description || ""}
              onChange={(e) =>
                handleNestedChange("demografi", "description", e.target.value)
              }
              className="w-full p-2 border rounded-md"
              rows={3}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">
              URL Peta Google Maps (Embed)
            </label>
            <input
              type="text"
              value={data.demografi?.petaUrl || ""}
              onChange={(e) =>
                handleNestedChange("demografi", "petaUrl", e.target.value)
              }
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium mb-1">Total Penduduk</label>
              <input
                type="text"
                value={data.demografi?.totalPenduduk || ""}
                onChange={(e) =>
                  handleNestedChange(
                    "demografi",
                    "totalPenduduk",
                    e.target.value
                  )
                }
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Laki-laki</label>
              <input
                type="text"
                value={data.demografi?.lakiLaki || ""}
                onChange={(e) =>
                  handleNestedChange("demografi", "lakiLaki", e.target.value)
                }
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Perempuan</label>
              <input
                type="text"
                value={data.demografi?.perempuan || ""}
                onChange={(e) =>
                  handleNestedChange("demografi", "perempuan", e.target.value)
                }
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
          <div>
            <label className="block font-medium mb-1">Tabel Wilayah</label>
            {(data.demografi?.tabelData || []).map((row, index) => (
              <div
                key={row.id}
                className="p-4 border rounded-lg mb-4 space-y-3"
              >
                <p className="font-semibold text-gray-700">
                  Data Wilayah {index + 1}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Nama Wilayah
                    </label>
                    <input
                      value={row.wilayah}
                      onChange={(e) =>
                        handleDemografiTableChange(
                          index,
                          "wilayah",
                          e.target.value
                        )
                      }
                      placeholder="Contoh: Krajan"
                      className="w-full mt-1 p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Jumlah Penduduk
                    </label>
                    <input
                      value={row.penduduk}
                      onChange={(e) =>
                        handleDemografiTableChange(
                          index,
                          "penduduk",
                          e.target.value
                        )
                      }
                      placeholder="Contoh: 2.991 JIWA"
                      className="w-full mt-1 p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Jumlah RT
                    </label>
                    <input
                      value={row.rt}
                      onChange={(e) =>
                        handleDemografiTableChange(index, "rt", e.target.value)
                      }
                      placeholder="Contoh: 17 RT"
                      className="w-full mt-1 p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Jumlah RW
                    </label>
                    <input
                      value={row.rw}
                      onChange={(e) =>
                        handleDemografiTableChange(index, "rw", e.target.value)
                      }
                      placeholder="Contoh: 2 RW"
                      className="w-full mt-1 p-2 border rounded-md"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sejarah */}
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">Sejarah</h2>
          <div>
            <label className="block font-medium mb-1">
              Narasi Sejarah (pisahkan paragraf dengan baris baru)
            </label>
            <textarea
              value={data.sejarah?.description || ""}
              onChange={(e) =>
                handleNestedChange("sejarah", "description", e.target.value)
              }
              className="w-full p-2 border rounded-md"
              rows={10}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-start">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isSaving ? "Menyimpan..." : "Simpan Semua Perubahan"}
        </button>
      </div>
    </div>
  );
}
