import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Beranda } from '@/lib/types';
import { writeFile } from 'fs/promises';
import path from 'path';

const COLLECTION_NAME = "konten-halaman";
const DOCUMENT_ID = "beranda";

// Fungsi helper untuk unggah file
async function handleFileUpload(file: File | null): Promise<string | null> {
    if (!file) return null;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name.replace(/\s/g, "_")}`;
    const uploadPath = path.join(process.cwd(), 'public/uploads', filename);
    await writeFile(uploadPath, buffer);
    return `/uploads/${filename}`;
}

const defaultData: Beranda = {
    hero: {
        title: "DESA SLAMPAREJO",
        subtitle: "Satu pintu digital untuk mengenal, berinteraksi, dan berkontribusi dalam semangat kebersamaan membangun desa."
    },
    slogan: {
        title: "Melayani dengan Hati Membangun dengan Aksi",
        description: "Mencerminkan komitmen Desa Slamparejo dalam memberikan pelayanan yang tulus kepada warga serta mewujudkan pembangunan nyata yang dirasakan manfaatnya oleh seluruh masyarakat."
    },
    launching: {
        title: "Launching Website Desa Slamparejo",
        description: "Mahasiswa dari Fakultas Ilmu Komputer, Universitas Brawijaya, telah meluncurkan website desaslamparejo.id sebagai bagian dari program pengabdian masyarakat untuk Desa Slamparejo.",
        image: "/launching.png" // Path default
    },
    faq: [
        { id: "1", question: "Bisakah saya menyampaikan aspirasi atau pengaduan melalui website ini?", answer: "Bisa. Gunakan fitur \"Kotak Saran\" untuk menyampaikan aspirasi, kritik, atau pengaduan. Pesan Anda akan ditindaklanjuti oleh perangkat desa sesuai prosedur." },
        { id: "2", question: "Bagaimana cara mengurus layanan administrasi di Desa Slamparejo?", answer: "Seluruh layanan administrasi hanya dilayani langsung di kantor desa. Sebelum datang, silakan cek jam operasional dan kontak resmi di menu \"Kontak Kami\" agar kunjungan Anda lebih efisien." },
        { id: "3", question: "Di mana saya bisa menemukan informasi tentang peraturan desa?", answer: "Informasi mengenai produk hukum, seperti Peraturan Desa (Perdes) dan keputusan resmi lainnya, dapat Anda temukan di menu \"Produk\"." }
    ]
};

async function isAuthorized() {
    const session = await getServerSession(authOptions);
    return !!session;
}

export async function GET() {
  try {
    const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return NextResponse.json(docSnap.data() as Beranda);
    } else {
      await setDoc(docRef, defaultData);
      return NextResponse.json(defaultData);
    }
  } catch (error) {
    console.error("Firebase GET Error:", error);
    return NextResponse.json({ error: 'Gagal mengambil data Beranda' }, { status: 500 });
  }
}

export async function POST(request: Request) {
    if (!await isAuthorized()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const formData = await request.formData();
        const launchingImageFile = formData.get('launchingImageFile') as File | null;

        // Ambil data yang ada saat ini dari database
        const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
        const docSnap = await getDoc(docRef);
        const existingData = docSnap.exists() ? docSnap.data() as Beranda : defaultData;

        // Unggah gambar baru jika ada
        const newImageUrl = await handleFileUpload(launchingImageFile);

        // Susun ulang objek data untuk disimpan
        const dataToSave: Beranda = {
            hero: {
                title: formData.get('heroTitle') as string || existingData.hero.title,
                subtitle: formData.get('heroSubtitle') as string || existingData.hero.subtitle,
            },
            slogan: {
                title: formData.get('sloganTitle') as string || existingData.slogan.title,
                description: formData.get('sloganDescription') as string || existingData.slogan.description,
            },
            launching: {
                title: formData.get('launchingTitle') as string || existingData.launching.title,
                description: formData.get('launchingDescription') as string || existingData.launching.description,
                // Gunakan gambar baru jika ada, jika tidak, gunakan gambar yang sudah ada
                image: newImageUrl || existingData.launching.image,
            },
            faq: JSON.parse(formData.get('faq') as string || "[]"),
        };

        await setDoc(docRef, dataToSave, { merge: true });
        return NextResponse.json({ message: 'Data Beranda berhasil disimpan' }, { status: 200 });
    } catch (error) {
        console.error("Firebase POST Error:", error);
        return NextResponse.json({ error: 'Gagal menyimpan data Beranda' }, { status: 500 });
    }
}