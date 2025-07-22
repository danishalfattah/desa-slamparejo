import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Kontak } from '@/lib/types';

const COLLECTION_NAME = "konten-halaman";
const DOCUMENT_ID = "kontak";

const defaultData: Kontak = {
    heroSubtitle: "Layanan Desa Slamparejo dirancang untuk memberikan kemudahan, kenyamanan, dan kejelasan dalam setiap proses pelayanan.",
    description: "Hubungi kami melalui informasi kontak di bawah ini jika anda memiliki pertanyaan atau permohonan untuk Pemerintah Desa Slamparejo.",
    email: "desa.slamparejo@gmail.com",
    phone: "(+62)87766747814",
    instagram: "@desaslamparejo",
    instagramUrl: "https://www.instagram.com/desaslamparejo/",
    lokasi: {
        address: "Jl. Raya Slamparejo No.18, Dusun Krajan, Slamparejo, Kec. Jabung, Kabupaten Malang,\nJawa Timur 65155",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.6956236655833!2d112.75946407493598!3d-7.926825378926761!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd62e89c51385f5%3A0xc864a6272e336681!2sKantor%20Desa%20Slamparejo!5e0!3m2!1sen!2sus!4v1752159631421!5m2!1sen!2sus"
    }
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
      return NextResponse.json(docSnap.data() as Kontak);
    } else {
      await setDoc(docRef, defaultData);
      return NextResponse.json(defaultData);
    }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data kontak' }, { status: 500 });
  }
}

export async function POST(request: Request) {
    if (!await isAuthorized()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const dataToSave: Kontak = await request.json();
        const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
        await setDoc(docRef, dataToSave, { merge: true });
        return NextResponse.json({ message: 'Data kontak berhasil disimpan' }, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return NextResponse.json({ error: 'Gagal menyimpan data kontak' }, { status: 500 });
    }
}