"use client";
import { useState, useEffect } from "react";

// Komponen Modal Sederhana
const SuccessModal = ({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
  const [visi, setVisi] = useState("");
  const [misi, setMisi] = useState("");
  const [sejarah, setSejarah] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/profil-desa");
        if (response.ok) {
          const data = await response.json();
          setVisi(data.visi);
          setMisi(data.misi);
          setSejarah(data.sejarah);
          setVideoUrl(data.videoUrl);
        }
      } catch (error) {
        console.error("Gagal mengambil data profil:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    const profilData = { visi, misi, sejarah, videoUrl };
    try {
      const response = await fetch("/api/profil-desa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profilData),
      });

      if (response.ok) {
        setShowModal(true);
      } else {
        alert("Gagal menyimpan data.");
      }
    } catch (error) {
      console.error("Gagal menyimpan data profil:", error);
      alert("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-center p-10">Memuat data profil...</div>;
  }

  return (
    <div>
      {showModal && (
        <SuccessModal
          message="Data Halaman Profil Berhasil Disimpan!"
          onClose={() => setShowModal(false)}
        />
      )}

      <h1 className="text-3xl font-bold mb-6">Kelola Halaman Profil</h1>
      <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <div>
          <label className="block font-medium mb-1 text-lg">
            URL Video Profil (Embed)
          </label>
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="https://www.youtube.com/embed/..."
          />
        </div>
        <div>
          <label className="block font-medium mb-1 text-lg">Visi</label>
          <textarea
            value={visi}
            onChange={(e) => setVisi(e.target.value)}
            className="w-full p-2 border rounded-md"
            rows={4}
          ></textarea>
        </div>
        <div>
          <label className="block font-medium mb-1 text-lg">Misi</label>
          <textarea
            value={misi}
            onChange={(e) => setMisi(e.target.value)}
            className="w-full p-2 border rounded-md"
            rows={6}
          ></textarea>
        </div>
        <div>
          <label className="block font-medium mb-1 text-lg">Sejarah Desa</label>
          <textarea
            value={sejarah}
            onChange={(e) => setSejarah(e.target.value)}
            className="w-full p-2 border rounded-md"
            rows={8}
          ></textarea>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        >
          {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </div>
  );
}
