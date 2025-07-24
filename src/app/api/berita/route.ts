// src/app/api/berita/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, orderBy, getDoc, writeBatch } from 'firebase/firestore';
import { Berita } from '@/lib/types';
import { v2 as cloudinary } from 'cloudinary';

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const COLLECTION_NAME = "berita";

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
                folder: 'desa-slamparejo-berita',
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return NextResponse.json({ id: docSnap.id, ...docSnap.data() });
      } else {
        return NextResponse.json({ error: 'Berita tidak ditemukan' }, { status: 404 });
      }
    } else {
      const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
      const data = await getDocs(q);
      const beritaData = data.docs.map((doc) => ({ ...(doc.data() as Omit<Berita, 'id'>), id: doc.id }));
      
      // Logika untuk memindahkan berita utama ke atas
      beritaData.sort((a, b) => {
        if (a.isHeadline && !b.isHeadline) return -1;
        if (!a.isHeadline && b.isHeadline) return 1;
        return 0; // Urutan lainnya tetap berdasarkan tanggal
      });

      return NextResponse.json(beritaData);
    }
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
        const imageUrl = await handleFileUpload(file);

        if (!imageUrl) {
            return NextResponse.json({ error: 'File gambar diperlukan' }, { status: 400 });
        }

        const newData: Omit<Berita, 'id' | 'imageUrl'> = {
            title: formData.get('title') as string,
            content: formData.get('content') as string,
            createdAt: Date.now(),
        };

        const docRef = await addDoc(collection(db, COLLECTION_NAME), { ...newData, imageUrl });
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
        const imageUrl = await handleFileUpload(file);

        const dataToUpdate: Partial<Omit<Berita, 'id' | 'imageUrl'>> = {
            title: formData.get('title') as string,
            content: formData.get('content') as string,
        };

        const finalData = { ...dataToUpdate, ...(imageUrl && { imageUrl }) };

        const beritaDoc = doc(db, COLLECTION_NAME, id);
        await updateDoc(beritaDoc, finalData);
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
        
        const beritaDoc = doc(db, COLLECTION_NAME, id);
        await deleteDoc(beritaDoc);
        return NextResponse.json({ message: 'Data deleted successfully' });
    } catch (error) {
        console.error("Firebase DELETE Error:", error);
        return NextResponse.json({ error: 'Failed to delete data' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    if (!await isAuthorized()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const { id: newHeadlineId }: { id: string } = await request.json();
        if (!newHeadlineId) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

        const batch = writeBatch(db);
        const beritaCollection = collection(db, COLLECTION_NAME);
        
        // 1. Unset all other headlines
        const q = query(beritaCollection);
        const snapshot = await getDocs(q);
        snapshot.forEach((document) => {
            if (document.id !== newHeadlineId) {
                batch.update(document.ref, { isHeadline: false });
            }
        });

        // 2. Set the new headline
        const newHeadlineRef = doc(db, COLLECTION_NAME, newHeadlineId);
        batch.update(newHeadlineRef, { isHeadline: true });

        // Commit the batch
        await batch.commit();

        return NextResponse.json({ message: 'Headline updated successfully' });
    } catch (error) {
        console.error("Firebase PATCH Error:", error);
        return NextResponse.json({ error: 'Failed to update headline' }, { status: 500 });
    }
}