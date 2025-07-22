"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { ProdukHukum, Pembangunan } from "@/lib/types";
import Image from "next/image";

// --- Komponen Modal ---

const ConfirmModal = ({
  message,
  onConfirm,
  onCancel,
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-xl text-center w-full max-w-sm">
      <p className="mb-6 text-lg">{message}</p>
      <div className="flex justify-center gap-4">
        <button
          onClick={onConfirm}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 w-24"
        >
          Ya, Hapus
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400 w-24"
        >
          Batal
        </button>
      </div>
    </div>
  </div>
);

const ProdukHukumModal = ({
  isOpen,
  onClose,
  onSubmit,
  data,
  setData,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  data: Partial<ProdukHukum>;
  setData: (data: Partial<ProdukHukum>) => void;
}) => {
  if (!isOpen) return null;
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: name === "year" ? Number(value) : value });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          {data.id ? "Edit Produk Hukum" : "Tambah Produk Hukum"}
        </h2>
        <form onSubmit={onSubmit} id="produkHukumForm" className="space-y-4">
          <input
            type="text"
            name="title"
            value={data.title || ""}
            onChange={handleChange}
            placeholder="Judul Dokumen"
            className="w-full p-2 border rounded-md"
            required
          />
          <textarea
            name="description"
            value={data.description || ""}
            onChange={handleChange}
            placeholder="Deskripsi Singkat"
            className="w-full p-2 border rounded-md"
            required
          />
          <input
            type="text"
            name="link"
            value={data.link || ""}
            onChange={handleChange}
            placeholder="URL Google Drive"
            className="w-full p-2 border rounded-md"
            required
          />
          <div className="flex gap-4">
            <input
              type="number"
              name="year"
              value={data.year || new Date().getFullYear()}
              onChange={handleChange}
              placeholder="Tahun"
              className="w-1/2 p-2 border rounded-md"
              required
            />
            <select
              name="category"
              value={data.category || "Perdes"}
              onChange={handleChange}
              className="w-1/2 p-2 border rounded-md"
            >
              <option value="Perdes">Perdes</option>
              <option value="Keputusan Desa">Keputusan Desa</option>
            </select>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PembangunanModal = ({
  isOpen,
  onClose,
  onSubmit,
  data,
  setData,
  setImageFile,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  data: Partial<Pembangunan>;
  setData: (data: Partial<Pembangunan>) => void;
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
}) => {
  if (!isOpen) return null;
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: name === "year" ? Number(value) : value });
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setImageFile(e.target.files[0]);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          {data.id ? "Edit Pembangunan" : "Tambah Pembangunan"}
        </h2>
        <form onSubmit={onSubmit} id="pembangunanForm" className="space-y-4">
          <input
            type="text"
            name="title"
            value={data.title || ""}
            onChange={handleChange}
            placeholder="Nama Proyek Pembangunan"
            className="w-full p-2 border rounded-md"
            required
          />
          <textarea
            name="description"
            value={data.description || ""}
            onChange={handleChange}
            placeholder="Deskripsi Proyek"
            className="w-full p-2 border rounded-md"
            required
          />
          <div>
            <label className="block font-medium mb-1 text-sm">
              Gambar Pembangunan
            </label>
            {data.id && data.image && (
              <div className="mb-2">
                <p className="text-xs text-gray-500 mb-1">Gambar saat ini:</p>
                <Image
                  src={data.image}
                  alt={data.title || "Gambar saat ini"}
                  width={80}
                  height={80}
                  className="rounded-md object-cover"
                />
              </div>
            )}
            <input
              type="file"
              name="imageFile"
              onChange={handleFileChange}
              accept="image/*"
              className="w-full p-2 border rounded-md"
              required={!data.id}
            />
            <p className="text-xs text-gray-500 mt-1">
              {data.id
                ? "Unggah file baru untuk mengganti gambar."
                : "File gambar wajib diunggah."}
            </p>
          </div>
          <input
            type="text"
            name="budget"
            value={data.budget || ""}
            onChange={handleChange}
            placeholder="Anggaran (cth: Rp 150.000.000)"
            className="w-full p-2 border rounded-md"
            required
          />
          <div className="flex gap-4">
            <input
              type="number"
              name="year"
              value={data.year || new Date().getFullYear()}
              onChange={handleChange}
              placeholder="Tahun"
              className="w-1/2 p-2 border rounded-md"
              required
            />
            <select
              name="status"
              value={data.status || "Selesai"}
              onChange={handleChange}
              className="w-1/2 p-2 border rounded-md"
            >
              <option value="Selesai">Selesai</option>
              <option value="Berlangsung">Berlangsung</option>
              <option value="Direncanakan">Direncanakan</option>
            </select>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function ManageProdukPage() {
  const [produkHukum, setProdukHukum] = useState<ProdukHukum[]>([]);
  const [pembangunan, setPembangunan] = useState<Pembangunan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State untuk Modal
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

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [hukumRes, pembangunanRes] = await Promise.all([
        fetch("/api/produk-hukum"),
        fetch("/api/pembangunan"),
      ]);
      setProdukHukum(await hukumRes.json());
      setPembangunan(await pembangunanRes.json());
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // --- Handler untuk Modal Produk Hukum ---
  const handleOpenHukumModal = (item?: ProdukHukum) => {
    setEditingHukum(item || {});
    setIsHukumModalOpen(true);
  };
  const handleCloseHukumModal = () => setIsHukumModalOpen(false);
  const handleSaveHukum = async (e: FormEvent) => {
    e.preventDefault();
    const method = editingHukum.id ? "PUT" : "POST";
    await fetch("/api/produk-hukum", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...editingHukum,
        id: editingHukum.id || undefined,
      }),
    });
    handleCloseHukumModal();
    fetchAllData();
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

  // --- Handler untuk Modal Pembangunan ---
  const handleOpenPembangunanModal = (item?: Pembangunan) => {
    setEditingPembangunan(item || {});
    setPembangunanImageFile(null);
    setIsPembangunanModalOpen(true);
  };
  const handleClosePembangunanModal = () => setIsPembangunanModalOpen(false);
  const handleSavePembangunan = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(editingPembangunan).forEach(([key, value]) =>
      formData.append(key, String(value))
    );
    if (pembangunanImageFile)
      formData.append("imageFile", pembangunanImageFile);

    const method = editingPembangunan.id ? "PUT" : "POST";
    await fetch("/api/pembangunan", { method, body: formData });
    handleClosePembangunanModal();
    fetchAllData();
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

  if (isLoading) return <div className="text-center p-10">Memuat data...</div>;

  return (
    <div>
      {confirmAction && (
        <ConfirmModal
          message={confirmAction.message}
          onConfirm={confirmAction.action}
          onCancel={() => setConfirmAction(null)}
        />
      )}
      <ProdukHukumModal
        isOpen={isHukumModalOpen}
        onClose={handleCloseHukumModal}
        onSubmit={handleSaveHukum}
        data={editingHukum}
        setData={setEditingHukum}
      />
      <PembangunanModal
        isOpen={isPembangunanModalOpen}
        onClose={handleClosePembangunanModal}
        onSubmit={handleSavePembangunan}
        data={editingPembangunan}
        setData={setEditingPembangunan}
        imageFile={pembangunanImageFile}
        setImageFile={setPembangunanImageFile}
      />

      <h1 className="text-3xl font-bold mb-6">
        Kelola Produk Hukum & Pembangunan
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Produk Hukum</h2>
          <button
            onClick={() => handleOpenHukumModal()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            + Tambah Baru
          </button>
        </div>
        <div className="overflow-x-auto mt-4">
          <table className="w-full min-w-max">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Judul</th>
                <th className="text-left p-3">Tahun</th>
                <th className="text-left p-3">Kategori</th>
                <th className="text-left p-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {produkHukum.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{item.title}</td>
                  <td className="p-3">{item.year}</td>
                  <td className="p-3">{item.category}</td>
                  <td className="p-3 flex gap-3">
                    <button
                      onClick={() => handleOpenHukumModal(item)}
                      className="text-blue-600 font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteHukum(item.id)}
                      className="text-red-600 font-semibold"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Pembangunan Fisik</h2>
          <button
            onClick={() => handleOpenPembangunanModal()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            + Tambah Baru
          </button>
        </div>
        <div className="overflow-x-auto mt-4">
          <table className="w-full min-w-max">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Proyek</th>
                <th className="text-left p-3">Anggaran</th>
                <th className="text-left p-3">Tahun</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pembangunan.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{item.title}</td>
                  <td className="p-3">{item.budget}</td>
                  <td className="p-3">{item.year}</td>
                  <td className="p-3">{item.status}</td>
                  <td className="p-3 flex gap-3">
                    <button
                      onClick={() => handleOpenPembangunanModal(item)}
                      className="text-blue-600 font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePembangunan(item.id)}
                      className="text-red-600 font-semibold"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
