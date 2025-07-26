import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Profil } from '@/lib/types';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const COLLECTION_NAME = "konten-halaman";
const DOCUMENT_ID = "profil";

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

const defaultData: Profil = {
    hero: {
        subtitle: "Desa Slamparejo tumbuh dari sejarah, arah, dan tekad kuat untuk terus melayani masyarakat secara tulus dan berkelanjutan.",
        heroImage: "/landing-page.png"
    },
    video: { title: "Video Profil", description: "Setiap jengkal tanah, setiap tarikan napas warga, adalah bagian dari cerita besar yang hidup. Inilah Slamparejo, desa yang tumbuh dalam makna.", url: "https://www.youtube.com/embed/YOUR_VIDEO_ID_HERE" },
    visiMisi: {
        description: "Visi misi ini mencerminkan semangat membangun desa yang mandiri, sejahtera, dan tetap menjunjung nilai budaya lokal.",
        visi: "Membangun Desa Slamparejo yang mandiri, sejahtera, dan berkelanjutan...",
        misi: "Meningkatkan kualitas pelayanan publik...\nMemperkuat perekonomian desa..."
    },
    demografi: {
        title: "Demografi Desa Slamparejo",
        description: "Lorem ipsum dolor sit amet...",
        totalPenduduk: "5.797 Jiwa",
        lakiLaki: "2.900 Jiwa",
        perempuan: "2.897 Jiwa",
        petaUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15806.691498613762!2d112.76887845!3d-7.929193899999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd62e66b4b7aee9%3A0x1dfb4e477cdba610!2sSlamparejo%2C%20Kec.%20Jabung%2C%20Kabupaten%20Malang%2C%20Jawa%20Timur!5e0!3m2!1sid!2sid!4v1752224970507!5m2!1sid!2sid",
        tabelData: [
            { id: "1", wilayah: "Krajan", rt: "17 RT", rw: "2 RW", penduduk: "2.991 JIWA" },
            { id: "2", wilayah: "Busu", rt: "20 RT", rw: "3 RW", penduduk: "2.806 JIWA" }
        ]
    },
    sejarah: {
        title: "Sejarah Desa Slamparejo",
        description: "Desa Slamparejo merupakan suatu desa di kecamatan Jabung...",
        sejarahImages: [
            { src: "/fbe3d8867cd111f2607bcb45c706e8363663dc5f.jpg", alt: "Mbah Gude" },
            { src: "/fbe3d8867cd111f2607bcb45c706e8363663dc5f.jpg", alt: "Wilayah Peteguhan" },
            { src: "/c20512021615f3918f726e5fb61f5c95c047e233.jpg", alt: "Dusun Busu" }
        ]
    }
};

async function isAuthorized() {
    const session = await getServerSession(authOptions);
    return !!session;
}

function convertYoutubeUrlToEmbed(url: string): string {
    if (!url) return url;
    const watchRegex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/;
    const shortRegex = /(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]+)/;
    let match = url.match(watchRegex);
    if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}`;
    }
    match = url.match(shortRegex);
    if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}`;
    }
    return url;
}

export async function GET() {
  try {
    const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const fetchedData = docSnap.data();
      // Gabungkan data yang ada dengan data default untuk memastikan semua properti ada
      const finalData = {
        ...defaultData,
        ...fetchedData,
        hero: { ...defaultData.hero, ...fetchedData.hero },
        video: { ...defaultData.video, ...fetchedData.video },
        visiMisi: { ...defaultData.visiMisi, ...fetchedData.visiMisi },
        demografi: { ...defaultData.demografi, ...fetchedData.demografi },
        sejarah: { ...defaultData.sejarah, ...fetchedData.sejarah },
      };
      return NextResponse.json(finalData);
    } else {
      await setDoc(docRef, defaultData);
      return NextResponse.json(defaultData);
    }
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Gagal mengambil data profil' }, { status: 500 });
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

        const sejarahImageFile1 = formData.get('sejarahImageFile1') as File | null;
        const sejarahImageFile2 = formData.get('sejarahImageFile2') as File | null;
        const sejarahImageFile3 = formData.get('sejarahImageFile3') as File | null;

        const newSejarahImageUrl1 = await handleFileUpload(sejarahImageFile1);
        const newSejarahImageUrl2 = await handleFileUpload(sejarahImageFile2);
        const newSejarahImageUrl3 = await handleFileUpload(sejarahImageFile3);

        const jsonDataString = formData.get('jsonData') as string;
        if (!jsonDataString) {
             return NextResponse.json({ error: 'Data JSON tidak ditemukan' }, { status: 400 });
        }
        const dataToSave: Profil = JSON.parse(jsonDataString);
        
        if (newHeroImageUrl) {
            dataToSave.hero.heroImage = newHeroImageUrl;
        }

        if (dataToSave.sejarah && dataToSave.sejarah.sejarahImages) {
            if (newSejarahImageUrl1) dataToSave.sejarah.sejarahImages[0].src = newSejarahImageUrl1;
            if (newSejarahImageUrl2) dataToSave.sejarah.sejarahImages[1].src = newSejarahImageUrl2;
            if (newSejarahImageUrl3) dataToSave.sejarah.sejarahImages[2].src = newSejarahImageUrl3;
        }

        if (dataToSave.video && dataToSave.video.url) {
            dataToSave.video.url = convertYoutubeUrlToEmbed(dataToSave.video.url);
        }

        const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
        await setDoc(docRef, dataToSave, { merge: true });
        return NextResponse.json({ message: 'Data profil berhasil disimpan' });
    } catch (error) {
        console.error("Firebase POST Error:", error);
        return NextResponse.json({ error: 'Gagal menyimpan data profil' }, { status: 500 });
    }
}