// src/app/api/usaha-desa/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, getDoc as getDoc_, DocumentData, setDoc } from 'firebase/firestore';
import { Usaha, UsahaDesaPageData } from '@/lib/types';
import { v2 as cloudinary } from 'cloudinary';

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const USAHA_COLLECTION_NAME = "usaha-desa";
const PAGE_CONTENT_COLLECTION_NAME = "konten-halaman";
const PAGE_CONTENT_DOCUMENT_ID = "usaha-desa";
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

async function isAuthorized() {
    const session = await getServerSession(authOptions);
    return !!session;
}

// Fungsi helper untuk unggah file ke Cloudinary
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

const defaultPageData: UsahaDesaPageData = {
    hero: {
        subtitle: "Temukan berbagai produk dan jasa unggulan dari UMKM Desa Slamparejo yang kreatif dan inovatif.",
        heroImage: "/landing-page.png"
    },
    description: "Setiap jengkal tanah, setiap tarikan napas warga, adalah bagian dari cerita besar yang hidup. Inilah Slamparejo, desa yang tumbuh dalam makna."
};


export async function GET() {
  try {
    // Get list of businesses
    const usahaQuery = query(collection(db, USAHA_COLLECTION_NAME));
    const usahaDocs = await getDocs(usahaQuery);
    const usahaList = usahaDocs.docs.map((doc) => ({ ...(doc.data() as Omit<Usaha, 'id'>), id: doc.id }));

    // Get page content
    const pageDocRef = doc(db, PAGE_CONTENT_COLLECTION_NAME, PAGE_CONTENT_DOCUMENT_ID);
    const pageDocSnap = await getDoc_(pageDocRef);
    let pageData: UsahaDesaPageData;
    if (pageDocSnap.exists()) {
      pageData = pageDocSnap.data() as UsahaDesaPageData;
    } else {
      await setDoc(pageDocRef, defaultPageData as DocumentData);
      pageData = defaultPageData;
    }

    return NextResponse.json({ usahaList, pageData });
  } catch (error) {
    console.error("Firebase GET Error:", error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
    if (!await isAuthorized()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const formData = await request.formData();
        const file = formData.get('imageFile') as File | null;
        if (file && file.size > MAX_FILE_SIZE) {
            return NextResponse.json({ error: 'Ukuran file tidak boleh lebih dari 2MB.' }, { status: 400 });
        }
        const image = await handleFileUpload(file);

        if (!image) {
            return NextResponse.json({ error: 'File gambar diperlukan' }, { status: 400 });
        }

        const newData: Omit<Usaha, 'id' | 'image'> = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            phone: formData.get('phone') as string,
            maps: formData.get('maps') as string,
        };

        const docRef = await addDoc(collection(db, USAHA_COLLECTION_NAME), { ...newData, image });
        return NextResponse.json({ ...newData, image, id: docRef.id }, { status: 201 });
    } catch (error) {
        console.error("Firebase POST Error:", error);
        return NextResponse.json({ error: 'Failed to create data' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    if (!await isAuthorized()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const formData = await request.formData();
        const id = formData.get('id') as string;
        if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

        const file = formData.get('imageFile') as File | null;
        if (file && file.size > MAX_FILE_SIZE) {
            return NextResponse.json({ error: 'Ukuran file tidak boleh lebih dari 2MB.' }, { status: 400 });
        }
        const image = await handleFileUpload(file);
        
        const dataToUpdate: Omit<Usaha, 'id' | 'image'> = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            phone: formData.get('phone') as string,
            maps: formData.get('maps') as string,
        };
        
        const finalData = { ...dataToUpdate, ...(image && { image }) };

        const usahaDoc = doc(db, USAHA_COLLECTION_NAME, id);
        await updateDoc(usahaDoc, finalData);
        return NextResponse.json({ id, ...finalData });
    } catch (error) {
        console.error("Firebase PUT Error:", error);
        return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    if (!await isAuthorized()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const { id }: { id: string } = await request.json();
        if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

        const usahaDoc = doc(db, USAHA_COLLECTION_NAME, id);
        await deleteDoc(usahaDoc);
        return NextResponse.json({ message: 'Data deleted successfully' });
    } catch (error) {
        console.error("Firebase DELETE Error:", error);
        return NextResponse.json({ error: 'Failed to delete data' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
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
        const dataToSave: UsahaDesaPageData = JSON.parse(jsonDataString);
        
        if (newHeroImageUrl) {
            dataToSave.hero.heroImage = newHeroImageUrl;
        }

        const docRef = doc(db, PAGE_CONTENT_COLLECTION_NAME, PAGE_CONTENT_DOCUMENT_ID);
        await setDoc(docRef, dataToSave as DocumentData, { merge: true });
        return NextResponse.json({ message: 'Data halaman Usaha Desa berhasil disimpan' });
    } catch (error) {
        console.error("Firebase PATCH Error:", error);
        return NextResponse.json({ error: 'Gagal menyimpan data halaman Usaha Desa' }, { status: 500 });
    }
}