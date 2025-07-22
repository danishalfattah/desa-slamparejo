import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const COLLECTION_NAME = "konten-halaman";
const DOCUMENT_ID = "layanan";

interface LayananData {
  heroSubtitle: string;
  formLink: string;
}

const defaultData: LayananData = {
    heroSubtitle: "Layanan Desa Slamparejo dirancang untuk memberikan kemudahan, kenyamanan, dan kejelasan dalam setiap proses pelayanan.",
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
      return NextResponse.json(docSnap.data() as LayananData);
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
        const dataToSave: LayananData = await request.json();
        const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
        await setDoc(docRef, dataToSave, { merge: true });
        return NextResponse.json({ message: 'Data layanan berhasil disimpan' }, { status: 200 });
    } catch (error) {
        console.error("Firebase POST Error:", error);
        return NextResponse.json({ error: 'Gagal menyimpan data layanan' }, { status: 500 });
    }
}