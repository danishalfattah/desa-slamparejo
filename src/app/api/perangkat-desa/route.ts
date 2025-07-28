// src/app/api/perangkat-desa/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, getDoc as getDoc_, DocumentData, setDoc } from 'firebase/firestore';
import { PerangkatDesa, PerangkatDesaPageData } from '@/lib/types';
import { v2 as cloudinary } from 'cloudinary';

// Konfigurasi Cloudinary
cloudinary.config({ 
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const PERANGKAT_COLLECTION_NAME = "perangkat-desa";
const PAGE_CONTENT_COLLECTION_NAME = "konten-halaman";
const PAGE_CONTENT_DOCUMENT_ID = "perangkat-desa";
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB


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

const defaultPageData: PerangkatDesaPageData = {
    hero: {
        subtitle: "Layanan Desa Slamparejo dirancang untuk memberikan kemudahan, kenyamanan, dan kejelasan dalam setiap proses pelayanan.",
        heroImage: "/landing-page.png"
    },
    description: "Berikut adalah daftar perangkat desa yang menjalankan pemerintahan Desa Slamparejo. Setiap perangkat desa memiliki tugas dan tanggung jawab dalam melayani masyarakat serta mengembangkan potensi desa."
};


export async function GET() {
  try {
    // Get list of officials
    const perangkatQuery = query(collection(db, PERANGKAT_COLLECTION_NAME));
    const perangkatDocs = await getDocs(perangkatQuery);
    const perangkatList = perangkatDocs.docs.map((doc) => ({ ...(doc.data() as Omit<PerangkatDesa, 'id'>), id: doc.id }));

    // Mengurutkan data berdasarkan waktu pembuatan (data lama di atas)
    perangkatList.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));

    // Get page content
    const pageDocRef = doc(db, PAGE_CONTENT_COLLECTION_NAME, PAGE_CONTENT_DOCUMENT_ID);
    const pageDocSnap = await getDoc_(pageDocRef);
    let pageData: PerangkatDesaPageData;
    if (pageDocSnap.exists()) {
      pageData = pageDocSnap.data() as PerangkatDesaPageData;
    } else {
      await setDoc(pageDocRef, defaultPageData as DocumentData);
      pageData = defaultPageData;
    }

    return NextResponse.json({ perangkatList, pageData });
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
        const imageUrl = await handleFileUpload(file);

        if (!imageUrl) {
            return NextResponse.json({ error: 'File gambar diperlukan' }, { status: 400 });
        }

        const newData: Omit<PerangkatDesa, 'id' | 'imageUrl'> = {
            name: formData.get('name') as string,
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            createdAt: Date.now(), // Menambahkan timestamp saat data dibuat
        };

        const docRef = await addDoc(collection(db, PERANGKAT_COLLECTION_NAME), { ...newData, imageUrl });
        return NextResponse.json({ ...newData, imageUrl, id: docRef.id }, { status: 201 });
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
        const imageUrl = await handleFileUpload(file);
        
        const dataToUpdate: Partial<Omit<PerangkatDesa, 'id' | 'imageUrl'>> = {
            name: formData.get('name') as string,
            title: formData.get('title') as string,
            description: formData.get('description') as string,
        };
        
        const finalData = { ...dataToUpdate, ...(imageUrl && { imageUrl }) };

        const perangkatDoc = doc(db, PERANGKAT_COLLECTION_NAME, id);
        await updateDoc(perangkatDoc, finalData);
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

        const perangkatDoc = doc(db, PERANGKAT_COLLECTION_NAME, id);
        await deleteDoc(perangkatDoc);
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
        const dataToSave: PerangkatDesaPageData = JSON.parse(jsonDataString);
        
        if (newHeroImageUrl) {
            dataToSave.hero.heroImage = newHeroImageUrl;
        }

        const docRef = doc(db, PAGE_CONTENT_COLLECTION_NAME, PAGE_CONTENT_DOCUMENT_ID);
        await setDoc(docRef, dataToSave as DocumentData, { merge: true });
        return NextResponse.json({ message: 'Data halaman Perangkat Desa berhasil disimpan' });
    } catch (error) {
        console.error("Firebase PATCH Error:", error);
        return NextResponse.json({ error: 'Gagal menyimpan data halaman Perangkat Desa' }, { status: 500 });
    }
}