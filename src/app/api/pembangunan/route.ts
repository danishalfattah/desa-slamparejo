import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query } from 'firebase/firestore';
import { Pembangunan } from '@/lib/types';

const COLLECTION_NAME = "pembangunan";

async function isAuthorized() {
    const session = await getServerSession(authOptions);
    return !!session;
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
        const newData: Omit<Pembangunan, 'id'> = await request.json();
        const docRef = await addDoc(collection(db, COLLECTION_NAME), newData);
        return NextResponse.json({ ...newData, id: docRef.id }, { status: 201 });
    } catch (error) {
        console.error("Firebase POST Error:", error);
        return NextResponse.json({ error: 'Failed to create data' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    if (!await isAuthorized()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const { id, ...dataToUpdate }: Pembangunan = await request.json();
        if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

        const pembangunanDoc = doc(db, COLLECTION_NAME, id);
        await updateDoc(pembangunanDoc, dataToUpdate);
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
        
        const pembangunanDoc = doc(db, COLLECTION_NAME, id);
        await deleteDoc(pembangunanDoc);
        return NextResponse.json({ message: 'Data deleted successfully' });
    } catch (error) {
        console.error("Firebase DELETE Error:", error);
        return NextResponse.json({ error: 'Failed to delete data' }, { status: 500 });
    }
}
