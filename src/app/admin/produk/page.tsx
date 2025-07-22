"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { ProdukHukum, Pembangunan } from "@/lib/types";

// Komponen Modal Konfirmasi
const ConfirmModal = ({
  message,
  onConfirm,
  onCancel,
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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

// Komponen Form untuk Produk Hukum
const ProdukHukumForm = ({
  data,
  onSubmit,
  onCancel,
}: {
  data: Partial<ProdukHukum>;
  onSubmit: (e: FormEvent) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState(data);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "year" ? Number(value) : value,
    }));
  };

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 bg-gray-50 p-4 rounded-lg border my-4"
    >
      <input name="id" type="hidden" value={formData.id || ""} />
      <input
        type="text"
        name="title"
        value={formData.title || ""}
        onChange={handleChange}
        placeholder="Judul Dokumen"
        className="w-full p-2 border rounded-md"
        required
      />
      <textarea
        name="description"
        value={formData.description || ""}
        onChange={handleChange}
        placeholder="Deskripsi Singkat"
        className="w-full p-2 border rounded-md"
        required
      />
      <input
        type="text"
        name="link"
        value={formData.link || ""}
        onChange={handleChange}
        placeholder="URL Google Drive"
        className="w-full p-2 border rounded-md"
        required
      />
      <div className="flex gap-4">
        <input
          type="number"
          name="year"
          value={formData.year || new Date().getFullYear()}
          onChange={handleChange}
          placeholder="Tahun"
          className="w-1/2 p-2 border rounded-md"
          required
        />
        <select
          name="category"
          value={formData.category || "Perdes"}
          onChange={handleChange}
          className="w-1/2 p-2 border rounded-md"
        >
          <option value="Perdes">Perdes</option>
          <option value="Keputusan Desa">Keputusan Desa</option>
        </select>
      </div>
      <div className="flex gap-4">
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Simpan
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
        >
          Batal
        </button>
      </div>
    </form>
  );
};

// Komponen Form untuk Pembangunan
const PembangunanForm = ({
  data,
  onSubmit,
  onCancel,
}: {
  data: Partial<Pembangunan>;
  onSubmit: (e: FormEvent) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState(data);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "year" ? Number(value) : value,
    }));
  };

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 bg-gray-50 p-4 rounded-lg border my-4"
    >
      <input name="id" type="hidden" value={formData.id || ""} />
      <input
        type="text"
        name="title"
        value={formData.title || ""}
        onChange={handleChange}
        placeholder="Nama Proyek Pembangunan"
        className="w-full p-2 border rounded-md"
        required
      />
      <textarea
        name="description"
        value={formData.description || ""}
        onChange={handleChange}
        placeholder="Deskripsi Proyek"
        className="w-full p-2 border rounded-md"
        required
      />
      <input
        type="text"
        name="image"
        value={formData.image || ""}
        onChange={handleChange}
        placeholder="URL Gambar (cth: /pembangunan.jpg)"
        className="w-full p-2 border rounded-md"
        required
      />
      <input
        type="text"
        name="budget"
        value={formData.budget || ""}
        onChange={handleChange}
        placeholder="Anggaran (cth: Rp 150.000.000)"
        className="w-full p-2 border rounded-md"
        required
      />
      <div className="flex gap-4">
        <input
          type="number"
          name="year"
          value={formData.year || new Date().getFullYear()}
          onChange={handleChange}
          placeholder="Tahun"
          className="w-1/2 p-2 border rounded-md"
          required
        />
        <select
          name="status"
          value={formData.status || "Selesai"}
          onChange={handleChange}
          className="w-1/2 p-2 border rounded-md"
        >
          <option value="Selesai">Selesai</option>
          <option value="Berlangsung">Berlangsung</option>
          <option value="Direncanakan">Direncanakan</option>
        </select>
      </div>
      <div className="flex gap-4">
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Simpan
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
        >
          Batal
        </button>
      </div>
    </form>
  );
};

export default function ManageProdukPage() {
  const [produkHukum, setProdukHukum] = useState<ProdukHukum[]>([]);
  const [pembangunan, setPembangunan] = useState<Pembangunan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showHukumForm, setShowHukumForm] = useState(false);
  const [editingHukum, setEditingHukum] = useState<Partial<ProdukHukum>>({});

  const [showPembangunanForm, setShowPembangunanForm] = useState(false);
  const [editingPembangunan, setEditingPembangunan] = useState<
    Partial<Pembangunan>
  >({});

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

  const handleSaveHukum = async (e: FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const method = data.id ? "PUT" : "POST";

    await fetch("/api/produk-hukum", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        id: data.id || undefined,
        year: Number(data.year),
      }),
    });
    setShowHukumForm(false);
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

  const handleSavePembangunan = async (e: FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const method = data.id ? "PUT" : "POST";

    await fetch("/api/pembangunan", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        id: data.id || undefined,
        year: Number(data.year),
      }),
    });
    setShowPembangunanForm(false);
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg text-gray-500">Memuat data...</p>
      </div>
    );
  }

  return (
    <div>
      {confirmAction && (
        <ConfirmModal
          message={confirmAction.message}
          onConfirm={confirmAction.action}
          onCancel={() => setConfirmAction(null)}
        />
      )}
      <h1 className="text-3xl font-bold mb-6">
        Kelola Produk Hukum & Pembangunan
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Produk Hukum</h2>
          <button
            onClick={() => {
              setEditingHukum({});
              setShowHukumForm(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            + Tambah Baru
          </button>
        </div>
        {showHukumForm && (
          <ProdukHukumForm
            data={editingHukum}
            onSubmit={handleSaveHukum}
            onCancel={() => setShowHukumForm(false)}
          />
        )}
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
                      onClick={() => {
                        setEditingHukum(item);
                        setShowHukumForm(true);
                      }}
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
            onClick={() => {
              setEditingPembangunan({});
              setShowPembangunanForm(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            + Tambah Baru
          </button>
        </div>
        {showPembangunanForm && (
          <PembangunanForm
            data={editingPembangunan}
            onSubmit={handleSavePembangunan}
            onCancel={() => setShowPembangunanForm(false)}
          />
        )}
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
                      onClick={() => {
                        setEditingPembangunan(item);
                        setShowPembangunanForm(true);
                      }}
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
