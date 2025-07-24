import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query } from 'firebase/firestore';
import { ProdukHukum } from '@/lib/types';

const COLLECTION_NAME = "produk-hukum";

async function isAuthorized() {
    const session = await getServerSession(authOptions);
    return !!session;
}

export async function GET() {
  try {
    const q = query(collection(db, COLLECTION_NAME));
    const data = await getDocs(q);
    const produkData = data.docs.map((doc) => ({ ...(doc.data() as Omit<ProdukHukum, 'id'>), id: doc.id }));
    produkData.sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
    return NextResponse.json(produkData);
  } catch (error) {
    console.error("Firebase GET Error:", error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
    if (!await isAuthorized()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const newData: Omit<ProdukHukum, 'id'> = await request.json();
        const docRef = await addDoc(collection(db, COLLECTION_NAME), { ...newData, fileType: 'pdf' });
        return NextResponse.json({ ...newData, id: docRef.id }, { status: 201 });
    } catch (error) {
        console.error("Firebase POST Error:", error);
        return NextResponse.json({ error: 'Failed to create data' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    if (!await isAuthorized()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const { id, ...dataToUpdate }: ProdukHukum = await request.json();
        if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

        const produkDoc = doc(db, COLLECTION_NAME, id);
        await updateDoc(produkDoc, { ...dataToUpdate, fileType: 'pdf' });
        return NextResponse.json({ id, ...dataToUpdate });
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

        const produkDoc = doc(db, COLLECTION_NAME, id);
        await deleteDoc(produkDoc);
        return NextResponse.json({ message: 'Data deleted successfully' });
    } catch (error) {
        console.error("Firebase DELETE Error:", error);
        return NextResponse.json({ error: 'Failed to delete data' }, { status: 500 });
    }
}
