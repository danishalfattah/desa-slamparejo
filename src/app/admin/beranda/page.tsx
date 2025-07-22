"use client";
import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { Beranda, FaqItem } from "@/lib/types";
import Image from "next/image";

// --- Komponen Modal ---

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

const FaqFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  faqData,
  setFaqData,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  faqData: FaqItem;
  setFaqData: (data: FaqItem) => void;
}) => {
  if (!isOpen) return null;

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFaqData({ ...faqData, [name]: value });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">
          {faqData.id ? "Edit FAQ" : "Tambah FAQ Baru"}
        </h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1 text-sm">Pertanyaan</label>
            <input
              type="text"
              name="question"
              value={faqData.question}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1 text-sm">Jawaban</label>
            <textarea
              name="answer"
              value={faqData.answer}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              rows={4}
              required
            />
          </div>
          <div className="flex justify-end gap-4 mt-6">
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

export default function ManageBerandaPage() {
  const [data, setData] = useState<Partial<Beranda>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);

  const [confirmAction, setConfirmAction] = useState<{
    action: () => void;
    message: string;
  } | null>(null);

  const [launchingImageFile, setLaunchingImageFile] = useState<File | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/beranda");
        if (response.ok) setData(await response.json());
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section: keyof Beranda,
    field: string
  ) => {
    setData((prev) => ({
      ...prev,
      [section]: { ...(prev[section] as object), [field]: e.target.value },
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLaunchingImageFile(e.target.files[0]);
    }
  };

  const handleOpenFaqModal = (faqItem: FaqItem | null) => {
    setEditingFaq(faqItem || { id: "", question: "", answer: "" });
    setIsFaqModalOpen(true);
  };
  const handleCloseFaqModal = () => {
    setIsFaqModalOpen(false);
    setEditingFaq(null);
  };
  const handleSaveFaq = (e: FormEvent) => {
    e.preventDefault();
    if (!editingFaq) return;
    const updatedFaqList = editingFaq.id
      ? (data.faq || []).map((item) =>
          item.id === editingFaq.id ? editingFaq : item
        )
      : [...(data.faq || []), { ...editingFaq, id: crypto.randomUUID() }];
    setData((prev) => ({ ...prev, faq: updatedFaqList }));
    handleCloseFaqModal();
  };
  const handleDeleteFaq = (id: string) => {
    setConfirmAction({
      message: "Yakin ingin menghapus FAQ ini?",
      action: () => {
        setData((prev) => ({
          ...prev,
          faq: (prev.faq || []).filter((item) => item.id !== id),
        }));
        setConfirmAction(null);
      },
    });
  };

  const handleSaveAll = async () => {
    setIsSaving(true);

    const formData = new FormData();
    formData.append("jsonData", JSON.stringify(data));

    if (launchingImageFile) {
      formData.append("launchingImageFile", launchingImageFile);
    }

    try {
      const response = await fetch("/api/beranda", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        setShowSuccessModal(true);
        setLaunchingImageFile(null);
        const freshResponse = await fetch("/api/beranda");
        if (freshResponse.ok) setData(await freshResponse.json());
      } else {
        alert("Gagal menyimpan data.");
      }
    } catch (error) {
      console.error("Gagal menyimpan:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div>Memuat data beranda...</div>;

  return (
    <div>
      {showSuccessModal && (
        <SuccessModal
          message="Data Halaman Beranda Berhasil Disimpan!"
          onClose={() => setShowSuccessModal(false)}
        />
      )}
      {confirmAction && (
        <ConfirmModal
          message={confirmAction.message}
          onConfirm={confirmAction.action}
          onCancel={() => setConfirmAction(null)}
        />
      )}
      {isFaqModalOpen && editingFaq && (
        <FaqFormModal
          isOpen={isFaqModalOpen}
          onClose={handleCloseFaqModal}
          onSubmit={handleSaveFaq}
          faqData={editingFaq}
          setFaqData={setEditingFaq}
        />
      )}

      <h1 className="text-3xl font-bold mb-6">Kelola Halaman Beranda</h1>

      {/* Hero Section */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4 mb-6">
        <h2 className="text-xl font-semibold border-b pb-2">Bagian Hero</h2>
        <div>
          <label className="block font-medium mb-1">Judul Hero</label>
          <input
            type="text"
            value={data.hero?.title || ""}
            onChange={(e) => handleInputChange(e, "hero", "title")}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Subjudul Hero</label>
          <textarea
            value={data.hero?.subtitle || ""}
            onChange={(e) => handleInputChange(e, "hero", "subtitle")}
            className="w-full p-2 border rounded-md"
            rows={3}
          />
        </div>
      </div>

      {/* Slogan Section */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4 mb-6">
        <h2 className="text-xl font-semibold border-b pb-2">Bagian Slogan</h2>
        <div>
          <label className="block font-medium mb-1">Judul Slogan</label>
          <input
            type="text"
            value={data.slogan?.title || ""}
            onChange={(e) => handleInputChange(e, "slogan", "title")}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Deskripsi Slogan</label>
          <textarea
            value={data.slogan?.description || ""}
            onChange={(e) => handleInputChange(e, "slogan", "description")}
            className="w-full p-2 border rounded-md"
            rows={3}
          />
        </div>
      </div>

      {/* Launching Section */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4 mb-6">
        <h2 className="text-xl font-semibold border-b pb-2">
          Bagian Launching
        </h2>
        <div>
          <label className="block font-medium mb-1">Judul Launching</label>
          <input
            type="text"
            value={data.launching?.title || ""}
            onChange={(e) => handleInputChange(e, "launching", "title")}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Deskripsi Launching</label>
          <textarea
            value={data.launching?.description || ""}
            onChange={(e) => handleInputChange(e, "launching", "description")}
            className="w-full p-2 border rounded-md"
            rows={3}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Gambar Launching</label>
          {data.launching?.image && (
            <div className="mb-2">
              <p className="text-xs text-gray-500 mb-1">Gambar saat ini:</p>
              <Image
                src={data.launching.image}
                alt="Preview"
                width={150}
                height={84}
                className="rounded-md object-cover border"
              />
            </div>
          )}
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/jpg"
            className="w-full p-2 border rounded-md"
          />
          <p className="text-xs text-gray-500 mt-1">
            Unggah file baru untuk mengganti gambar saat ini.
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4 mb-6">
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-xl font-semibold">Bagian FAQ</h2>
          <button
            onClick={() => handleOpenFaqModal(null)}
            className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600"
          >
            + Tambah FAQ
          </button>
        </div>
        <div className="space-y-2">
          {(data.faq || []).map((item) => (
            <div
              key={item.id}
              className="p-3 border rounded-md flex justify-between items-center"
            >
              <div className="flex-1 overflow-hidden">
                <p className="font-semibold break-words">{item.question}</p>
                <p className="text-sm text-gray-600 truncate break-words">
                  {item.answer}
                </p>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleOpenFaqModal(item)}
                  className="text-blue-600 font-semibold text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteFaq(item.id)}
                  className="text-red-600 font-semibold text-sm"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSaveAll}
          disabled={isSaving}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        >
          {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </div>
  );
}
