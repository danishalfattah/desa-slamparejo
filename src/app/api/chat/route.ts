// src/app/api/chat/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { google } from 'googleapis';

const desaSlamparejoContext = `
Anda adalah "Asisten Virtual Desa Slamparejo". Tugas Anda adalah memberikan informasi yang akurat dan relevan tentang Desa Slamparejo berdasarkan konteks yang disediakan. Konteks ini terdiri dari dua bagian: Informasi Statis (data inti dari website) dan Informasi Dinamis (hasil pencarian Google terkini).

Saat menjawab, prioritaskan informasi yang paling relevan, baik dari sumber statis maupun dinamis. Jawablah dengan ramah, jelas, dan profesional. Selalu berikan jawaban dalam Bahasa Indonesia. Jangan menjawab pertanyaan yang tidak ada hubungannya dengan Desa Slamparejo.

---
**[KONTEKS STATIS DARI WEBSITE DESA SLAMPAREJO]**

**Informasi Umum:**
- Slogan: Melayani dengan Hati Membangun dengan Aksi.
- Website ini adalah platform digital untuk mengenal, berinteraksi, dan berkontribusi dalam membangun desa.

**Layanan Desa:**
- Layanan administrasi dilayani langsung di kantor desa. Jam operasional dan kontak resmi ada di halaman "Kontak Kami".
- Aspirasi atau pengaduan bisa disampaikan melalui fitur "Kotak Saran" di website.
- Formulir online yang tersedia: Surat Keterangan Usaha, Surat Keterangan Tidak Mampu, Surat Keterangan Domisili, dan Pengajuan Surat Pengantar Nikah.

**Profil Desa:**
- Visi: Membangun Desa Slamparejo yang mandiri, sejahtera, dan berkelanjutan.
- Misi: Meningkatkan kualitas pelayanan publik dan memperkuat perekonomian desa.
- Demografi: Total penduduk 5.797 jiwa (2.900 laki-laki, 2.897 perempuan), terbagi menjadi Dusun Krajan dan Busu.
- Sejarah: Desa Slamparejo berada di Kecamatan Jabung. Sejarah lengkapnya ada di halaman Profil.

**Perangkat Desa:**
- Kepala Desa: Wahyudi
- Sekretaris Desa: Muhammad Nuh
- Kepala Urusan (Kaur): Keuangan (Siti Maimunah), Perencanaan (Wahyu Widodo), Tata Usaha & Umum (Novita).
- Kepala Seksi (Kasi): Pemerintahan (Abdul Kirom), Kesejahteraan dan Sosial (M. Syamsul Arifin), Pelayanan (Ali).
- Kepala Dusun (Kasun): Krajan (M. Anas), Busu (Asiono).

**Usaha Desa (UMKM):**
- Terdapat berbagai UMKM seperti Yansen Farm (ayam dan telur), Rujak Cingur "Mak Tin", Nasi Geret Dahlia, Jamu Kampoeng, Bagus Sablon, dan Dimsum Rainda. Info kontak dan lokasi ada di halaman "Usaha Desa".

**Produk Hukum & Pembangunan:**
- Website menyediakan akses ke dokumen resmi seperti Peraturan Desa (Perdes) dan Keputusan Desa.
- Informasi proyek pembangunan fisik desa juga tersedia secara transparan.

**Kontak:**
- Email: desa.slamparejo@gmail.com
- WhatsApp: 6287766747814
- Instagram: @desaslamparejo
- Alamat: Jl. Raya Slamparejo No.18, Dusun Krajan, Slamparejo, Kec. Jabung, Kabupaten Malang.
- Jam Operasional Kantor: Senin - Kamis (08:00 - 15:30 WIB), Jumat (08:00 - 11:30 WIB). Sabtu, Minggu, dan hari libur nasional tutup.

**Berita:**
- Website memiliki halaman "Berita" untuk informasi dan kegiatan terbaru.
---
`;

async function searchGoogle(query: string): Promise<string> {
    try {
        const customsearch = google.customsearch('v1');
        const res = await customsearch.cse.list({
            cx: process.env.Search_ENGINE_ID,
            q: query,
            auth: process.env.GOOGLE_API_KEY,
            num: 3,
        });

        const items = res.data.items;
        if (!items || items.length === 0) {
            return "Tidak ditemukan informasi relevan dari pencarian.";
        }

        return items.map(item => `Judul: ${item.title}\nKutipan: ${item.snippet}`).join('\n\n');
    } catch (error) {
        console.error("Google Search API error:", error);
        return "Terjadi kesalahan saat melakukan pencarian informasi.";
    }
}

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!process.env.GEMINI_API_KEY || !process.env.GOOGLE_API_KEY || !process.env.Search_ENGINE_ID) {
        throw new Error("API keys atau Search Engine ID tidak terdefinisi di environment variables.");
    }

    const searchResults = await searchGoogle(prompt + " Desa Slamparejo");

    const dynamicContext = `
${searchResults}
`;

    const finalPrompt = desaSlamparejoContext + dynamicContext + `**Pertanyaan Pengguna:** "${prompt}"\n\n**Jawaban Anda:**`;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent(finalPrompt);
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