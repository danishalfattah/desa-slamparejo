"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Usaha } from "@/lib/types";

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
    <div className="bg-white p-6 rounded-lg shadow-xl text-center">
      <p className="mb-4">{message}</p>
      <div className="flex justify-center gap-4">
        <button
          onClick={onConfirm}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          Ya, Hapus
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
        >
          Batal
        </button>
      </div>
    </div>
  </div>
);

export default function ManageUsahaDesaPage() {
  const [usahaList, setUsahaList] = useState<Usaha[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentData, setCurrentData] = useState<Partial<Usaha>>({
    title: "",
    description: "",
    phone: "",
    image: "",
    maps: "",
  });
  const [confirmAction, setConfirmAction] = useState<{
    action: () => void;
    message: string;
  } | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/usaha-desa");
      const data = await response.json();
      setUsahaList(data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setIsFormVisible(false);
    setIsEditing(false);
    setCurrentData({
      title: "",
      description: "",
      phone: "",
      image: "",
      maps: "",
    });
  };

  const handleAddNew = () => {
    resetForm();
    setIsFormVisible(true);
  };

  const handleEdit = (data: Usaha) => {
    setCurrentData(data);
    setIsEditing(true);
    setIsFormVisible(true);
  };

  const handleDelete = (id: string) => {
    setConfirmAction({
      message: "Yakin ingin menghapus data usaha ini?",
      action: async () => {
        await fetch("/api/usaha-desa", {
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
    const method = isEditing ? "PUT" : "POST";
    const response = await fetch("/api/usaha-desa", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentData),
    });

    if (response.ok) {
      resetForm();
      fetchData();
    } else {
      alert("Gagal menyimpan data.");
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCurrentData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      {confirmAction && (
        <ConfirmModal
          message={confirmAction.message}
          onConfirm={confirmAction.action}
          onCancel={() => setConfirmAction(null)}
        />
      )}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Kelola Usaha Desa</h1>
        <button
          onClick={handleAddNew}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          + Tambah Usaha Baru
        </button>
      </div>

      {isFormVisible && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {isEditing ? "Edit Usaha" : "Tambah Usaha Baru"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="title"
              value={currentData.title}
              onChange={handleInputChange}
              placeholder="Nama Usaha"
              className="w-full p-2 border rounded-md"
              required
            />
            <textarea
              name="description"
              value={currentData.description}
              onChange={handleInputChange}
              placeholder="Deskripsi"
              className="w-full p-2 border rounded-md"
              required
            />
            <input
              type="text"
              name="phone"
              value={currentData.phone}
              onChange={handleInputChange}
              placeholder="Nomor Telepon (cth: 62812...)"
              className="w-full p-2 border rounded-md"
              required
            />
            <input
              type="text"
              name="image"
              value={currentData.image}
              onChange={handleInputChange}
              placeholder="URL Gambar (cth: /nama-gambar.jpg)"
              className="w-full p-2 border rounded-md"
              required
            />
            <input
              type="text"
              name="maps"
              value={currentData.maps}
              onChange={handleInputChange}
              placeholder="URL Google Maps"
              className="w-full p-2 border rounded-md"
              required
            />
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                Simpan
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        {isLoading ? (
          <p>Memuat data...</p>
        ) : (
          <table className="w-full min-w-max">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Nama Usaha</th>
                <th className="text-left p-3">Deskripsi</th>
                <th className="text-left p-3">Telepon</th>
                <th className="text-left p-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {usahaList.map((usaha) => (
                <tr key={usaha.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{usaha.title}</td>
                  <td className="p-3 max-w-sm truncate">{usaha.description}</td>
                  <td className="p-3">{usaha.phone}</td>
                  <td className="p-3 flex gap-3">
                    <button
                      onClick={() => handleEdit(usaha)}
                      className="text-blue-600 font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(usaha.id!)}
                      className="text-red-600 font-semibold"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
