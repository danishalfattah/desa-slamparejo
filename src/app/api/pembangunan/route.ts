import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query } from 'firebase/firestore';
import { Pembangunan } from '@/lib/types';
import { v2 as cloudinary } from 'cloudinary';

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const COLLECTION_NAME = "pembangunan";

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

export async function GET() {
  try {
    const q = query(collection(db, COLLECTION_NAME));
    const data = await getDocs(q);
    const pembangunanData = data.docs.map((doc) => ({ ...(doc.data() as Omit<Pembangunan, 'id'>), id: doc.id }));
    pembangunanData.sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
    return NextResponse.json(pembangunanData);
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
        const image = await handleFileUpload(file);

        if (!image) {
            return NextResponse.json({ error: 'File gambar diperlukan' }, { status: 400 });
        }

        const newData: Omit<Pembangunan, 'id' | 'image'> = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            budget: formData.get('budget') as string,
            year: Number(formData.get('year')),
            status: formData.get('status') as string,
        };

        const docRef = await addDoc(collection(db, COLLECTION_NAME), { ...newData, image });
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
        const image = await handleFileUpload(file);

        const dataToUpdate: Omit<Pembangunan, 'id' | 'image'> = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            budget: formData.get('budget') as string,
            year: Number(formData.get('year')),
            status: formData.get('status') as string,
        };

        const finalData = { ...dataToUpdate, ...(image && { image }) };

        const pembangunanDoc = doc(db, COLLECTION_NAME, id);
        await updateDoc(pembangunanDoc, finalData);
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
        
        const pembangunanDoc = doc(db, COLLECTION_NAME, id);
        await deleteDoc(pembangunanDoc);
        return NextResponse.json({ message: 'Data deleted successfully' });
    } catch (error) {
        console.error("Firebase DELETE Error:", error);
        return NextResponse.json({ error: 'Failed to delete data' }, { status: 500 });
    }
}