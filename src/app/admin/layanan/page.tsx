"use client";
import { useState } from "react";

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

export default function ManageLayananPage() {
  const [heroSubtitle, setHeroSubtitle] = useState(
    "Layanan Desa Slamparejo dirancang untuk memberikan kemudahan, kenyamanan, dan kejelasan dalam setiap proses pelayanan."
  );
  const [formLink, setFormLink] = useState(
    "https://docs.google.com/forms/d/e/1FAIpQLSd_iFaqwV66X0psODErf4qKssKTR2OA5ntPnjDzciugxw-bzA/viewform?embedded=true"
  );
  const [showModal, setShowModal] = useState(false);

  const handleSave = () => {
    // Panggil API untuk menyimpan data
    console.log({ heroSubtitle, formLink });
    setShowModal(true); // Tampilkan modal
  };

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
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Simpan Perubahan
        </button>
      </div>
    </div>
  );
}
