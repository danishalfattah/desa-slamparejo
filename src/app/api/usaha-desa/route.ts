import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query } from 'firebase/firestore';
import { Usaha } from '@/lib/types';
import { writeFile } from 'fs/promises';
import path from 'path';

const COLLECTION_NAME = "usaha-desa";

async function isAuthorized() {
    const session = await getServerSession(authOptions);
    return !!session;
}

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

export async function GET() {
  try {
    const q = query(collection(db, COLLECTION_NAME));
    const data = await getDocs(q);
    const usahaData = data.docs.map((doc) => ({ ...(doc.data() as Omit<Usaha, 'id'>), id: doc.id }));
    return NextResponse.json(usahaData);
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

        const newData: Omit<Usaha, 'id' | 'image'> = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            phone: formData.get('phone') as string,
            maps: formData.get('maps') as string,
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
        
        const dataToUpdate: Omit<Usaha, 'id' | 'image'> = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            phone: formData.get('phone') as string,
            maps: formData.get('maps') as string,
        };
        
        const finalData = { ...dataToUpdate, ...(image && { image }) };

        const usahaDoc = doc(db, COLLECTION_NAME, id);
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

        const usahaDoc = doc(db, COLLECTION_NAME, id);
        await deleteDoc(usahaDoc);
        return NextResponse.json({ message: 'Data deleted successfully' });
    } catch (error) {
        console.error("Firebase DELETE Error:", error);
        return NextResponse.json({ error: 'Failed to delete data' }, { status: 500 });
    }
}