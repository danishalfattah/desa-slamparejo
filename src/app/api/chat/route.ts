// src/app/api/chat/route.ts
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { 
    Beranda, Profil, PerangkatDesa, Usaha, ProdukHukum, Pembangunan, Kontak, Layanan, Berita, FaqItem, JamOperasionalItem, LayananForm 
} from "@/lib/types";

async function fetchWebsiteContext() {
  const baseUrl = process.env.NEXTAUTH_URL;
  if (!baseUrl) throw new Error("NEXTAUTH_URL is not defined.");

  try {
    const endpoints = [
      'beranda', 'profil-desa', 'perangkat-desa',
      'usaha-desa', 'produk-hukum', 'pembangunan',
      'kontak', 'layanan', 'berita'
    ];
    const responses = await Promise.all(
      endpoints.map(endpoint => fetch(`${baseUrl}/api/${endpoint}`, { cache: 'no-store' }))
    );
    const data = await Promise.all(responses.map(res => res.json()));
    
    const [berandaData, profilData, perangkatData, usahaData, produkHukumData, pembangunanData, kontakData, layananData, beritaData] = data;

    let context = "KONTEKS WEBSITE DESA SLAMPAREJO:\n\n";
    
    context += `## Informasi Umum Website:\n`;
    context += `- Pembuat Website: Dibuat oleh tim Mahasiswa Membangun Desa (MMD) 32 dari Fakultas Ilmu Komputer (FILKOM), Universitas Brawijaya (UB) angkatan 2025.\n`;
    context += `- Tim Pengembang: Lisa, Derisa, Samuel, Danish, Arif, Satrio, dan Kaneysha.\n`;
    context += `- Tujuan Pembuatan: Dibuat sebagai bagian dari program pengabdian kepada masyarakat.\n\n`;

    context += `## Halaman Beranda:\nSlogan: ${berandaData.slogan.title}\nDeskripsi Slogan: ${berandaData.slogan.description}\n\n`;
    context += "FAQ (Pertanyaan Umum):\n";
    (berandaData.faq || []).forEach((item: FaqItem) => {
        context += `- Tanya: ${item.question}\n  Jawab: ${item.answer}\n`;
    });

    context += `\n## Profil Desa:\nVisi: ${profilData.visiMisi.visi}\n`;
    context += `Demografi: Total Penduduk ${profilData.demografi.totalPenduduk}, Laki-laki ${profilData.demografi.lakiLaki}, Perempuan ${profilData.demografi.perempuan}.\n`;
    
    context += `\n## Perangkat Desa:\n`;
    (perangkatData.perangkatList || []).forEach((item: PerangkatDesa) => {
        context += `- ${item.name}, Jabatan: ${item.title}.\n`;
    });
    const sekdes = (perangkatData.perangkatList || []).find((p: PerangkatDesa) => p.title.toLowerCase().includes('sekretaris desa'));
    if (sekdes) context += `Sekretaris Desa (Sekdes) adalah ${sekdes.name}.\n`;

    context += `\n## Usaha Desa (UMKM):\n`;
    (usahaData.usahaList || []).forEach((item: Usaha) => {
        context += `- Nama: ${item.title}, Deskripsi: ${item.description}, Kontak: ${item.phone}\n`;
    });

    const totalProdukHukum = (produkHukumData || []).length;
    context += `\n## Produk Hukum (Perdes & Keputusan Desa):\n`;
    context += `Total terdapat ${totalProdukHukum} dokumen hukum. Berikut adalah beberapa contohnya:\n`;
    (produkHukumData || []).slice(0, 5).forEach((item: ProdukHukum) => {
        context += `- Judul: ${item.title}, Kategori: ${item.category}, Tahun: ${item.year}\n`;
    });

    const totalPembangunan = (pembangunanData || []).length;
    context += `\n## Pembangunan Fisik:\n`;
    context += `Total terdapat ${totalPembangunan} proyek pembangunan. Berikut adalah beberapa contohnya:\n`;
    (pembangunanData || []).slice(0, 5).forEach((item: Pembangunan) => {
        context += `- Proyek: ${item.title}, Status: ${item.status}, Anggaran: ${item.budget}, Tahun: ${item.year}\n`;
    });

    context += `\n## Informasi Kontak:\nAlamat Kantor: ${kontakData.lokasi.address.replace(/\n/g, ' ')}\nEmail: ${kontakData.email}\nWhatsApp: ${kontakData.phone}\nInstagram: ${kontakData.instagram}\n`;
    context += "Jam Operasional:\n";
    (kontakData.jamOperasional || []).forEach((item: JamOperasionalItem) => {
        context += `- ${item.hari}: ${item.jam}\n`;
    });

    context += `\n## Layanan Online:\n`;
    (layananData.forms || []).forEach((item: LayananForm) => {
        context += `- ${item.title}: ${item.description}\n`;
    });
    
    const totalBerita = (beritaData || []).length;
    context += `\n## Berita Terbaru:\n`;
    context += `Total terdapat ${totalBerita} artikel berita. Berikut adalah beberapa judul berita teratas:\n`;
    (beritaData || []).slice(0, 5).forEach((item: Berita) => {
        context += `- Judul: ${item.title}\n`;
    });

    return context;

  } catch (error) {
    console.error("Gagal membangun konteks dari API:", error);
    return "Maaf, terjadi kesalahan saat mengambil data dari website.";
  }
}


const instructionPrompt = `
Anda adalah "Asisten Virtual Desa Slamparejo", chatbot yang cerdas, ramah, dan sangat membantu. Tujuan utama Anda adalah menjawab pertanyaan tentang Desa Slamparejo dengan akurat, menggunakan konteks yang disediakan sebagai sumber kebenaran utama, namun tetap fleksibel dan informatif. Anda juga harus bisa mengingat percakapan sebelumnya.

**ATURAN UTAMA:**
1.  **SUMBER FAKTA UTAMA:** Semua informasi yang **spesifik** mengenai Desa Slamparejo (seperti nama pejabat, data, kontak, dll.) **WAJIB** berasal dari **[KONTEKS WEBSITE DESA SLAMPAREJO]**.
2.  **GUNAKAN PENGETAHUAN UMUM (FLEKSIBILITAS):** Anda **DIPERBOLEHKAN** dan **DIANJURKAN** untuk menggunakan pengetahuan umum Anda untuk menjelaskan istilah, singkatan, atau konsep umum (contoh: apa itu "Kasun", "Perdes", atau kepanjangan dari gelar akademik seperti "S.H.", "M.M.").
3.  **MEMORI PERCAKAPAN:** Perhatikan riwayat percakapan untuk memahami konteks pertanyaan lanjutan (misalnya, kata ganti seperti "beliau", "itu", dll.).
4.  **SINTESIS JAWABAN:** Gabungkan fakta dari konteks, pengetahuan umum, dan riwayat percakapan untuk memberikan jawaban yang lengkap dan alami. Jika ada informasi jumlah total, gunakan itu untuk menjawab pertanyaan "ada berapa".
5.  **BATASAN PENGETAHUAN:** Jika sebuah **fakta spesifik** tentang Desa Slamparejo tidak ditemukan dalam konteks, jawab dengan jujur bahwa informasi tersebut tidak tersedia di website.
6.  **FOKUS:** Tetap fokus pada hal-hal yang berkaitan dengan Desa Slamparejo. Tolak dengan sopan untuk menjawab pertanyaan di luar topik.
7.  **BAHASA:** Selalu gunakan Bahasa Indonesia yang natural dan bersahabat.
8.  **RINGKAS DAN LANGSUNG:** Berikan jawaban yang singkat, padat, dan langsung ke inti pertanyaan. Hindari penjelasan yang bertele-tele kecuali jika pengguna memintanya secara spesifik.

---
`;

export async function POST(req: NextRequest) {
  try {
    const { history } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("API Key Gemini tidak ditemukan.");
    }
    if (!history || !Array.isArray(history) || history.length === 0) {
      return NextResponse.json({ error: "Riwayat percakapan tidak valid" }, { status: 400 });
    }

    const websiteContext = await fetchWebsiteContext();
    const systemInstruction = `${instructionPrompt}\n[KONTEKS WEBSITE DESA SLAMPAREJO]:\n${websiteContext}`;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: systemInstruction,
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ]
    });
    
    let historyForGemini = history;
    if (historyForGemini.length > 0 && historyForGemini[0].sender === 'bot') {
        historyForGemini = historyForGemini.slice(1);
    }
    
    const lastMessage = historyForGemini.pop();
    const pastHistory = historyForGemini;

    const geminiHistory = pastHistory.map((msg: { sender: string, text: string }) => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    const chat = model.startChat({
      history: geminiHistory,
    });

    const result = await chat.sendMessage(lastMessage.text);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Error processing chat:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}