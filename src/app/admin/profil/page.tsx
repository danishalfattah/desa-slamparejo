"use client";
import { useState } from "react";

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
  const [visi, setVisi] = useState(
    "Membangun Desa Slamparejo yang mandiri, sejahtera, dan berkelanjutan dengan tetap mempertahankan nilai-nilai budaya lokal serta kearifan masyarakat dalam tata kelola pemerintahan yang transparan dan akuntabel."
  );
  const [misi, setMisi] = useState(
    "1. Meningkatkan kualitas pelayanan publik.\n2. Memperkuat perekonomian desa.\n3. Melestarikan budaya dan kearifan lokal.\n4. Membangun infrastruktur yang mendukung.\n5. Mengoptimalkan tata kelola pemerintahan."
  );
  const [sejarah, setSejarah] = useState(
    "Desa Slamparejo berawal dari pengembaraan Mbah Gude dari Kerajaan Mataram..."
  );
  const [videoUrl, setVideoUrl] = useState(
    "https://www.youtube.com/embed/YOUR_VIDEO_ID_HERE"
  );
  const [showModal, setShowModal] = useState(false);

  const handleSave = () => {
    // Di sini Anda akan memanggil API untuk menyimpan data
    console.log({ visi, misi, sejarah, videoUrl });
    setShowModal(true); // Tampilkan modal
  };

  return (
    <div>
      {showModal && (
        <SuccessModal
          message="Data Halaman Profil Disimpan!"
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
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Simpan Perubahan
        </button>
      </div>
    </div>
  );
}
