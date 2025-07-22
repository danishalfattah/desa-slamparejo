import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const COLLECTION_NAME = "profil-desa";
const DOCUMENT_ID = "konten-utama";

interface ProfilData {
  visi: string;
  misi: string;
  sejarah: string;
  videoUrl: string;
}

const defaultData: ProfilData = {
    visi: "Membangun Desa Slamparejo yang mandiri, sejahtera, dan berkelanjutan dengan tetap mempertahankan nilai-nilai budaya lokal serta kearifan masyarakat dalam tata kelola pemerintahan yang transparan dan akuntabel.",
    misi: "1. Meningkatkan kualitas pelayanan publik.\n2. Memperkuat perekonomian desa.\n3. Melestarikan budaya dan kearifan lokal.\n4. Membangun infrastruktur yang mendukung.\n5. Mengoptimalkan tata kelola pemerintahan.",
    sejarah: "Desa Slamparejo berawal dari pengembaraan Mbah Gude dari Kerajaan Mataram...",
    videoUrl: "https://www.youtube.com/embed/YOUR_VIDEO_ID_HERE"
};

async function isAuthorized() {
    const session = await getServerSession(authOptions);
    return !!session;
}

// GET: Mengambil data profil
export async function GET() {
  try {
    const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return NextResponse.json(docSnap.data() as ProfilData);
    } else {
      // Jika dokumen belum ada, kembalikan data default
      return NextResponse.json(defaultData);
    }
  } catch (error) {
    console.error("Firebase GET Error:", error);
    return NextResponse.json({ error: 'Gagal mengambil data profil' }, { status: 500 });
  }
}

// POST: Menyimpan/Memperbarui data profil
export async function POST(request: Request) {
    if (!await isAuthorized()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const dataToSave: ProfilData = await request.json();
        const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
        // setDoc dengan merge: true akan membuat dokumen jika belum ada, atau memperbarui jika sudah ada
        await setDoc(docRef, dataToSave, { merge: true });
        return NextResponse.json({ message: 'Data profil berhasil disimpan' }, { status: 200 });
    } catch (error) {
        console.error("Firebase POST Error:", error);
        return NextResponse.json({ error: 'Gagal menyimpan data profil' }, { status: 500 });
    }
}
