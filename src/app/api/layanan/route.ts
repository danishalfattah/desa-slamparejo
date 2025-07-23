import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Layanan } from '@/lib/types';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const COLLECTION_NAME = "konten-halaman";
const DOCUMENT_ID = "layanan";

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

const defaultData: Layanan = {
    hero: {
        subtitle: "Layanan Desa Slamparejo dirancang untuk memberikan kemudahan, kenyamanan, dan kejelasan dalam setiap proses pelayanan.",
        heroImage: "/landing-page.png"
    },
    formLink: "https://docs.google.com/forms/d/e/1FAIpQLSd_iFaqwV66X0psODErf4qKssKTR2OA5ntPnjDzciugxw-bzA/viewform?embedded=true"
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
      return NextResponse.json(docSnap.data() as Layanan);
    } else {
      await setDoc(docRef, defaultData);
      return NextResponse.json(defaultData);
    }
  } catch (error) {
    console.error("Firebase GET Error:", error);
    return NextResponse.json({ error: 'Gagal mengambil data layanan' }, { status: 500 });
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
        const dataToSave: Layanan = JSON.parse(jsonDataString);
        
        if (newHeroImageUrl) {
            dataToSave.hero.heroImage = newHeroImageUrl;
        }

        const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
        await setDoc(docRef, dataToSave, { merge: true });
        return NextResponse.json({ message: 'Data layanan berhasil disimpan' }, { status: 200 });
    } catch (error) {
        console.error("Firebase POST Error:", error);
        return NextResponse.json({ error: 'Gagal menyimpan data layanan' }, { status: 500 });
    }
}
