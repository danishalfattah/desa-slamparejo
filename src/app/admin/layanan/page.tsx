"use client";
import { useState, useEffect } from "react";

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

export default function ManageLayananPage() {
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [formLink, setFormLink] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/layanan");
        if (response.ok) {
          const data = await response.json();
          setHeroSubtitle(data.heroSubtitle);
          setFormLink(data.formLink);
        }
      } catch (error) {
        console.error("Gagal mengambil data layanan:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/layanan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ heroSubtitle, formLink }),
      });

      if (response.ok) {
        setShowModal(true);
      } else {
        alert("Gagal menyimpan perubahan.");
      }
    } catch (error) {
      console.error("Gagal menyimpan:", error);
      alert("Terjadi kesalahan saat menyimpan.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div>Memuat data halaman layanan...</div>;
  }

  return (
    <div>
      {showModal && (
        <SuccessModal
          message="Data Halaman Layanan Disimpan!"
          onClose={() => setShowModal(false)}
        />
      )}

      <h1 className="text-3xl font-bold mb-6">Kelola Halaman Layanan</h1>
      <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <div>
          <label className="block font-medium mb-1 text-lg">
            Subjudul Halaman
          </label>
          <textarea
            value={heroSubtitle}
            onChange={(e) => setHeroSubtitle(e.target.value)}
            className="w-full p-2 border rounded-md"
            rows={3}
          ></textarea>
        </div>
        <div>
          <label className="block font-medium mb-1 text-lg">
            Link Google Form (Embed)
          </label>
          <input
            type="text"
            value={formLink}
            onChange={(e) => setFormLink(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="https://docs.google.com/forms/d/e/.../viewform?embedded=true"
          />
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
