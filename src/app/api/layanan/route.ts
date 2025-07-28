// src/app/api/layanan/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, collection, getDocs, deleteDoc, writeBatch } from 'firebase/firestore';
import { Layanan, LayananForm, PersyaratanLayananItem } from '@/lib/types';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const PAGE_COLLECTION_NAME = "konten-halaman";
const PAGE_DOCUMENT_ID = "layanan";
const FORMS_COLLECTION_NAME = "layanan-forms";
const PERSYARATAN_COLLECTION_NAME = "layanan-persyaratan";


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

const defaultData: Omit<Layanan, 'forms' | 'persyaratan'> = {
    hero: {
        subtitle: "Layanan Desa Slamparejo dirancang untuk memberikan kemudahan, kenyamanan, dan kejelasan dalam setiap proses pelayanan.",
        heroImage: "/landing-page.png"
    },
    akses: {
        title: "Akses Layanan",
        description: "Pilih layanan yang anda butuhkan, Pengajuan akan di proses secara online melalui formulir resmi"
    }
};

const defaultPersyaratan: PersyaratanLayananItem[] = [
    {
      id: "1",
      title: "Dokumen Persyaratan Pembuatan KTP",
      content: "1. Fotokopi Kartu Keluarga\n2. Surat Pengantar dari RT/RW\n3. Pas foto ukuran 2x3"
    },
    {
      id: "2",
      title: "Dokumen Persyaratan Surat Keterangan Usaha",
      content: "1. Fotokopi KTP Pemohon\n2. Surat Pengantar dari RT/RW\n3. Mengisi Formulir Permohonan"
    }
];

async function isAuthorized() {
    const session = await getServerSession(authOptions);
    return !!session;
}

export async function GET() {
  try {
    const pageDocRef = doc(db, PAGE_COLLECTION_NAME, PAGE_DOCUMENT_ID);
    const pageDocSnap = await getDoc(pageDocRef);
    
    let pageData: Omit<Layanan, 'forms' | 'persyaratan'>;
    if (pageDocSnap.exists()) {
      pageData = pageDocSnap.data() as Omit<Layanan, 'forms' | 'persyaratan'>;
    } else {
      await setDoc(pageDocRef, defaultData);
      pageData = defaultData;
    }

    const formsQuery = collection(db, FORMS_COLLECTION_NAME);
    const formsSnapshot = await getDocs(formsQuery);
    const forms = formsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LayananForm));

    forms.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));

    const persyaratanQuery = collection(db, PERSYARATAN_COLLECTION_NAME);
    const persyaratanSnapshot = await getDocs(persyaratanQuery);
    let persyaratan = persyaratanSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PersyaratanLayananItem));

    if (persyaratan.length === 0) {
        const batch = writeBatch(db);
        defaultPersyaratan.forEach(item => {
            const docRef = doc(db, PERSYARATAN_COLLECTION_NAME, item.id);
            batch.set(docRef, { title: item.title, content: item.content });
        });
        await batch.commit();
        persyaratan = defaultPersyaratan;
    }

    return NextResponse.json({ ...pageData, forms, persyaratan });
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
        
        const { forms, persyaratan, ...pageData } = dataToSave;

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
                const docSnap = await getDoc(formDocRef);
                
                const dataToSet = {
                    title: form.title,
                    description: form.description,
                    link: form.link,
                    createdAt: docSnap.exists() ? (docSnap.data().createdAt || Date.now()) : Date.now()
                };

                await setDoc(formDocRef, dataToSet, { merge: true });
            }
        }

        if (persyaratan) {
            const existingPersyaratanSnapshot = await getDocs(collection(db, PERSYARATAN_COLLECTION_NAME));
            const existingIds = existingPersyaratanSnapshot.docs.map(d => d.id);
            const newIds = persyaratan.map(p => p.id);

            for (const id of existingIds) {
                if (!newIds.includes(id)) {
                    await deleteDoc(doc(db, PERSYARATAN_COLLECTION_NAME, id));
                }
            }

            for (const item of persyaratan) {
                const itemDocRef = doc(db, PERSYARATAN_COLLECTION_NAME, item.id);
                const dataToSet = {
                    title: item.title,
                    content: item.content
                };
                await setDoc(itemDocRef, dataToSet, { merge: true });
            }
        }


        return NextResponse.json({ message: 'Data layanan berhasil disimpan' }, { status: 200 });
    } catch (error) {
        console.error("Firebase POST Error:", error);
        return NextResponse.json({ error: 'Gagal menyimpan data layanan' }, { status: 500 });
    }
}