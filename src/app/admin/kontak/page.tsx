"use client";
import { useState, useEffect, ChangeEvent } from "react";
import { Kontak } from "@/lib/types";

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

  if (isLoading) return <div className="p-4 md:p-8">Memuat data kontak...</div>;

  return (
    <div>
      {showModal && (
        <SuccessModal
          message="Data Halaman Kontak Berhasil Disimpan!"
          onClose={() => setShowModal(false)}
        />
      )}
      <h1 className="text-3xl font-bold mb-6">Kelola Halaman Kontak</h1>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">Teks Halaman</h2>
          <div>
            <label className="block font-medium mb-1">Subjudul Hero</label>
            <textarea
              name="heroSubtitle"
              value={data.heroSubtitle || ""}
              onChange={(e) => handleChange(e)}
              className="w-full p-2 border rounded-md"
              rows={3}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Deskripsi Kontak</label>
            <textarea
              name="description"
              value={data.description || ""}
              onChange={(e) => handleChange(e)}
              className="w-full p-2 border rounded-md"
              rows={3}
            />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">
            Informasi Kontak & Lokasi
          </h2>
          <div>
            <label className="block font-medium mb-1">Email Resmi</label>
            <input
              type="email"
              name="email"
              value={data.email || ""}
              onChange={(e) => handleChange(e)}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Telepon Kantor</label>
            <input
              type="text"
              name="phone"
              value={data.phone || ""}
              onChange={(e) => handleChange(e)}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Instagram Handle</label>
            <input
              type="text"
              name="instagram"
              value={data.instagram || ""}
              onChange={(e) => handleChange(e)}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">URL Instagram</label>
            <input
              type="text"
              name="instagramUrl"
              value={data.instagramUrl || ""}
              onChange={(e) => handleChange(e)}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">
              Alamat (pisahkan baris dengan enter)
            </label>
            <textarea
              value={data.lokasi?.address || ""}
              onChange={(e) => handleChange(e, "lokasi", "address")}
              className="w-full p-2 border rounded-md"
              rows={3}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">
              URL Google Maps (Embed)
            </label>
            <input
              type="text"
              value={data.lokasi?.mapUrl || ""}
              onChange={(e) => handleChange(e, "lokasi", "mapUrl")}
              className="w-full p-2 border rounded-md"
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
          {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </div>
  );
}
