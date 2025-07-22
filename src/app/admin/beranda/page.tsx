"use client";
import { useState } from "react";

export default function ManageBerandaPage() {
  const [heroTitle, setHeroTitle] = useState("DESA SLAMPAREJO");
  const [heroSubtitle, setHeroSubtitle] = useState(
    "Satu pintu digital untuk mengenal, berinteraksi, dan berkontribusi dalam semangat kebersamaan membangun desa."
  );

  const handleSave = () => {
    alert("Data Beranda Disimpan!");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Kelola Halaman Beranda</h1>
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div>
          <label className="block font-medium mb-1">Judul Hero</label>
          <input
            type="text"
            value={heroTitle}
            onChange={(e) => setHeroTitle(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Subjudul Hero</label>
          <textarea
            value={heroSubtitle}
            onChange={(e) => setHeroSubtitle(e.target.value)}
            className="w-full p-2 border rounded-md"
            rows={3}
          ></textarea>
        </div>
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Simpan Perubahan
        </button>
      </div>
    </div>
  );
}
