// src/app/api/berita-page/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, DocumentData } from 'firebase/firestore';
import { BeritaPageData } from '@/lib/types';
import { v2 as cloudinary } from 'cloudinary';

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const COLLECTION_NAME = "konten-halaman";
const DOCUMENT_ID = "berita";

const defaultData: BeritaPageData = {
    hero: {
        title: "BERITA DESA",
        subtitle: "Informasi terkini seputar kegiatan dan perkembangan Desa Slamparejo.",
        heroImage: "/landing-page.png"
    }
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
      return NextResponse.json(docSnap.data() as BeritaPageData);
    } else {
      await setDoc(docRef, defaultData as DocumentData);
      return NextResponse.json(defaultData);
    }
  } catch (error) {
    console.error("Firebase GET Error:", error);
    return NextResponse.json({ error: 'Gagal mengambil data halaman berita' }, { status: 500 });
  }
}

export async function POST(request: Request) {
    if (!await isAuthorized()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const formData = await request.formData();
        const heroImageFile = formData.get('heroImageFile') as File | null;
        const newHeroImageUrl = await handleFileUpload(heroImageFile);

        const jsonDataString = formData.get('jsonData') as string;
        if (!jsonDataString) {
             return NextResponse.json({ error: 'Data JSON tidak ditemukan' }, { status: 400 });
        }
        const dataToSave: BeritaPageData = JSON.parse(jsonDataString);
        
        if (newHeroImageUrl) {
            dataToSave.hero.heroImage = newHeroImageUrl;
        }

        const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
        await setDoc(docRef, dataToSave as DocumentData, { merge: true });
        return NextResponse.json({ message: 'Data halaman berita berhasil disimpan' }, { status: 200 });
    } catch (error) {
        console.error("Firebase POST Error:", error);
        return NextResponse.json({ error: 'Gagal menyimpan data halaman berita' }, { status: 500 });
    }
}