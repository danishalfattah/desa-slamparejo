// src/app/api/beranda/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Beranda } from '@/lib/types';
import { v2 as cloudinary } from 'cloudinary';

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const COLLECTION_NAME = "konten-halaman";
const DOCUMENT_ID = "beranda";
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

// Fungsi helper untuk unggah file ke Cloudinary
async function handleFileUpload(file: File | null): Promise<string | null> {
    if (!file) return null;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'desa-slamparejo-uploads',
            },
            (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result?.secure_url || null);
            }
        );
        uploadStream.end(buffer);
    });
}

const defaultData: Beranda = {
    hero: {
        title: "DESA SLAMPAREJO",
        subtitle: "Satu pintu digital untuk mengenal, berinteraksi, dan berkontribusi dalam semangat kebersamaan membangun desa.",
        heroImage: "/landing-page.png" // Path default
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
        const heroImageFile = formData.get('heroImageFile') as File | null;
        const launchingImageFile = formData.get('launchingImageFile') as File | null;

        if (heroImageFile && heroImageFile.size > MAX_FILE_SIZE) {
            return NextResponse.json({ error: 'Ukuran file hero tidak boleh lebih dari 2MB.' }, { status: 400 });
        }

        if (launchingImageFile && launchingImageFile.size > MAX_FILE_SIZE) {
            return NextResponse.json({ error: 'Ukuran file launching tidak boleh lebih dari 2MB.' }, { status: 400 });
        }
        
        const newHeroImageUrl = await handleFileUpload(heroImageFile);
        const newLaunchingImageUrl = await handleFileUpload(launchingImageFile);

        const jsonDataString = formData.get('jsonData') as string;
        if (!jsonDataString) {
             return NextResponse.json({ error: 'Data JSON tidak ditemukan' }, { status: 400 });
        }
        const dataToSave: Beranda = JSON.parse(jsonDataString);
        
        if (newHeroImageUrl) {
            dataToSave.hero.heroImage = newHeroImageUrl;
        }
        if (newLaunchingImageUrl) {
            dataToSave.launching.image = newLaunchingImageUrl;
        }

        const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
        await setDoc(docRef, dataToSave, { merge: true });
        return NextResponse.json({ message: 'Data Beranda berhasil disimpan' }, { status: 200 });
    } catch (error) {
        console.error("Firebase POST Error:", error);
        return NextResponse.json({ error: 'Gagal menyimpan data Beranda' }, { status: 500 });
    }
}