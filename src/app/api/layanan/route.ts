import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { Layanan, LayananForm } from '@/lib/types';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const PAGE_COLLECTION_NAME = "konten-halaman";
const PAGE_DOCUMENT_ID = "layanan";
const FORMS_COLLECTION_NAME = "layanan-forms";

// Helper function to upload files
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

// Helper function to format Google Form links for embedding
const formatGoogleFormLink = (url: string): string => {
    if (!url || typeof url !== 'string') return "";
    let baseUrl = url.split('?')[0];
    if (!baseUrl.endsWith('/viewform')) {
        if (baseUrl.endsWith('/')) {
            baseUrl = baseUrl.slice(0, -1);
        }
        baseUrl = `${baseUrl}/viewform`;
    }
    return `${baseUrl}?embedded=true`;
};

const defaultData: Omit<Layanan, 'forms'> = {
    hero: {
        subtitle: "Layanan Desa Slamparejo dirancang untuk memberikan kemudahan, kenyamanan, dan kejelasan dalam setiap proses pelayanan.",
        heroImage: "/landing-page.png"
    },
    akses: {
        title: "Akses Layanan",
        description: "Pilih layanan yang anda butuhkan, Pengajuan akan di proses secara online melalui formulir resmi"
    }
};

async function isAuthorized() {
    const session = await getServerSession(authOptions);
    return !!session;
}

export async function GET() {
  try {
    const pageDocRef = doc(db, PAGE_COLLECTION_NAME, PAGE_DOCUMENT_ID);
    const pageDocSnap = await getDoc(pageDocRef);
    
    let pageData: Omit<Layanan, 'forms'>;
    if (pageDocSnap.exists()) {
      pageData = pageDocSnap.data() as Omit<Layanan, 'forms'>;
    } else {
      await setDoc(pageDocRef, defaultData);
      pageData = defaultData;
    }

    const formsQuery = collection(db, FORMS_COLLECTION_NAME);
    const formsSnapshot = await getDocs(formsQuery);
    const forms = formsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LayananForm));

    return NextResponse.json({ ...pageData, forms });
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
        const formData = await request.formData();
        const heroImageFile = formData.get('heroImageFile') as File | null;
        const newHeroImageUrl = await handleFileUpload(heroImageFile);

        const jsonDataString = formData.get('jsonData') as string;
        if (!jsonDataString) {
             return NextResponse.json({ error: 'Data JSON tidak ditemukan' }, { status: 400 });
        }
        const dataToSave: Partial<Layanan> = JSON.parse(jsonDataString);
        
        const { forms, ...pageData } = dataToSave;

        if (newHeroImageUrl && pageData.hero) {
            pageData.hero.heroImage = newHeroImageUrl;
        }

        const docRef = doc(db, PAGE_COLLECTION_NAME, PAGE_DOCUMENT_ID);
        await setDoc(docRef, pageData, { merge: true });

        if (forms) {
            const existingFormsSnapshot = await getDocs(collection(db, FORMS_COLLECTION_NAME));
            const existingFormIds = existingFormsSnapshot.docs.map(d => d.id);
            const newFormIds = forms.map(f => f.id);

            for (const id of existingFormIds) {
                if (!newFormIds.includes(id)) {
                    await deleteDoc(doc(db, FORMS_COLLECTION_NAME, id));
                }
            }

            for (const form of forms) {
                const formDocRef = doc(db, FORMS_COLLECTION_NAME, form.id);
                const formattedLink = formatGoogleFormLink(form.link);
                await setDoc(formDocRef, { title: form.title, description: form.description, link: formattedLink }, { merge: true });
            }
        }

        return NextResponse.json({ message: 'Data layanan berhasil disimpan' }, { status: 200 });
    } catch (error) {
        console.error("Firebase POST Error:", error);
        return NextResponse.json({ error: 'Gagal menyimpan data layanan' }, { status: 500 });
    }
}
