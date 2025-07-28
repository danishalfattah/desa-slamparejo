// src/app/api/kontak/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, DocumentData } from 'firebase/firestore';
import { Kontak } from '@/lib/types';
import { v2 as cloudinary } from 'cloudinary';

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const COLLECTION_NAME = "konten-halaman";
const DOCUMENT_ID = "kontak";
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const defaultData: Kontak = {
    hero: {
        subtitle: "Layanan Desa Slamparejo dirancang untuk memberikan kemudahan, kenyamanan, dan kejelasan dalam setiap proses pelayanan.",
        heroImage: "/landing-page.png"
    },
    description: "Hubungi kami melalui informasi kontak di bawah ini jika anda memiliki pertanyaan atau permohonan untuk Pemerintah Desa Slamparejo.",
    email: "desa.slamparejo@gmail.com",
    phone: "6287766747814",
    instagram: "@desaslamparejo",
    instagramUrl: "https://www.instagram.com/desaslamparejo/",
    lokasi: {
        address: "Jl. Raya Slamparejo No.18, Dusun Krajan, Slamparejo, Kec. Jabung, Kabupaten Malang,\nJawa Timur 65155",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.6956236655833!2d112.75946407493598!3d-7.926825378926761!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd62e89c51385f5%3A0xc864a6272e336681!2sKantor%20Desa%20Slamparejo!5e0!3m2!1sen!2sus!4v1752159631421!5m2!1sen!2sus"
    },
    jamOperasional: [
        { id: "1", hari: "Senin - Kamis", jam: "08:00 - 15:30 WIB" },
        { id: "2", hari: "Jumat", jam: "08:00 - 11:30 WIB" },
        { id: "3", hari: "Sabtu - Minggu", jam: "Tutup" },
        { id: "4", hari: "Hari Libur Nasional", jam: "Tutup" },
    ]
};

async function isAuthorized() {
    const session = await getServerSession(authOptions);
    return !!session;
}

async function handleFileUpload(file: File | null): Promise<string | null> {
    if (!file) return null;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'desa-slamparejo-uploads' },
            (error, result) => {
                if (error) reject(error);
                resolve(result?.secure_url || null);
            }
        );
        uploadStream.end(buffer);
    });
}

export async function GET() {
  try {
    const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Pastikan jamOperasional ada, jika tidak, gunakan default
      const data = docSnap.data();
      if (!data.jamOperasional) {
        data.jamOperasional = defaultData.jamOperasional;
      }
      return NextResponse.json(data as Kontak);
    } else {
      // Jika dokumen tidak ada, buat dengan data default lengkap
      await setDoc(docRef, defaultData as DocumentData);
      return NextResponse.json(defaultData);
    }
  } catch (error) {
    console.error("Firebase GET Error:", error);
    return NextResponse.json({ error: 'Gagal mengambil data kontak' }, { status: 500 });
  }
}

export async function POST(request: Request) {
    if (!await isAuthorized()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const formData = await request.formData();
        const heroImageFile = formData.get('heroImageFile') as File | null;
        if (heroImageFile && heroImageFile.size > MAX_FILE_SIZE) {
            return NextResponse.json({ error: 'Ukuran file tidak boleh lebih dari 2MB.' }, { status: 400 });
        }
        const newHeroImageUrl = await handleFileUpload(heroImageFile);

        const jsonDataString = formData.get('jsonData') as string;
        if (!jsonDataString) {
             return NextResponse.json({ error: 'Data JSON tidak ditemukan' }, { status: 400 });
        }
        const dataToSave: Kontak = JSON.parse(jsonDataString);
        
        if (newHeroImageUrl) {
            dataToSave.hero.heroImage = newHeroImageUrl;
        }

        const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
        await setDoc(docRef, dataToSave as DocumentData, { merge: true });
        return NextResponse.json({ message: 'Data kontak berhasil disimpan' }, { status: 200 });
    } catch (error) {
        console.error("Firebase POST Error:", error);
        return NextResponse.json({ error: 'Gagal menyimpan data kontak' }, { status: 500 });
    }
}