"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Usaha } from "@/lib/types";
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

const UsahaFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  usaha,
  setUsaha,
  setImageFile,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  usaha: Partial<Usaha>;
  setUsaha: (data: Partial<Usaha>) => void;
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
}) => {
  if (!isOpen) return null;

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUsaha({ ...usaha, [name]: value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          {usaha.id ? "Edit Usaha" : "Tambah Usaha Baru"}
        </h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            value={usaha.title || ""}
            onChange={handleChange}
            placeholder="Nama Usaha"
            className="w-full p-2 border rounded-md"
            required
          />
          <textarea
            name="description"
            value={usaha.description || ""}
            onChange={handleChange}
            placeholder="Deskripsi"
            className="w-full p-2 border rounded-md"
            rows={4}
            required
          />
          <input
            type="text"
            name="phone"
            value={usaha.phone || ""}
            onChange={handleChange}
            placeholder="Nomor Telepon (cth: 62812...)"
            className="w-full p-2 border rounded-md"
            required
          />
          <div>
            <label className="block font-medium mb-1 text-sm">
              Gambar Usaha
            </label>
            {usaha.id && usaha.image && (
              <div className="mb-2">
                <p className="text-xs text-gray-500 mb-1">Gambar saat ini:</p>
                <Image
                  src={usaha.image}
                  alt={usaha.title || "Gambar saat ini"}
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
              accept="image/png, image/jpeg, image/jpg"
              className="w-full p-2 border rounded-md"
              required={!usaha.id}
            />
            <p className="text-xs text-gray-500 mt-1">
              {usaha.id
                ? "Unggah file baru untuk mengganti gambar."
                : "File gambar wajib diunggah."}
            </p>
          </div>
          <input
            type="text"
            name="maps"
            value={usaha.maps || ""}
            onChange={handleChange}
            placeholder="URL Google Maps"
            className="w-full p-2 border rounded-md"
            required
          />
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

export default function ManageUsahaDesaPage() {
  const [usahaList, setUsahaList] = useState<Usaha[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUsaha, setEditingUsaha] = useState<Partial<Usaha>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
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

  const handleOpenModal = (usaha?: Usaha) => {
    setEditingUsaha(usaha || {});
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUsaha({});
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
    const formData = new FormData();
    formData.append("title", editingUsaha.title || "");
    formData.append("description", editingUsaha.description || "");
    formData.append("phone", editingUsaha.phone || "");
    formData.append("maps", editingUsaha.maps || "");

    if (editingUsaha.id) {
      formData.append("id", editingUsaha.id);
    }
    if (imageFile) {
      formData.append("imageFile", imageFile);
    }

    const method = editingUsaha.id ? "PUT" : "POST";
    const response = await fetch("/api/usaha-desa", { method, body: formData });

    if (response.ok) {
      handleCloseModal();
      fetchData();
    } else {
      const errorData = await response.json();
      alert(`Gagal menyimpan data: ${errorData.error}`);
    }
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
      <UsahaFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        usaha={editingUsaha}
        setUsaha={setEditingUsaha}
        imageFile={imageFile}
        setImageFile={setImageFile}
      />

      {/* --- BAGIAN YANG DIPERBAIKI --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 pt-20 md:pt-0">
        <h1 className="text-2xl md:text-3xl font-bold">Kelola Usaha Desa</h1>
        <button
          onClick={() => handleOpenModal()}
          className=" md:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 shrink-0"
        >
          + Tambah Usaha Baru
        </button>
      </div>

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
                      onClick={() => handleOpenModal(usaha)}
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
