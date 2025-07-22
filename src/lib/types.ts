export interface Usaha {
  id: string; // Diubah dari number
  image: string;
  title: string;
  description: string;
  phone: string;
  maps: string;
}

export interface PerangkatDesa {
  id: string; // Diubah dari number
  name: string;
  title: string;
  imageUrl: string;
  description: string;
}

export interface ProdukHukum {
  id: string; // Diubah dari number
  category: string;
  year: number;
  fileType: 'pdf';
  title: string;
  description: string;
  link: string;
}

export interface Pembangunan {
  id: string; // Diubah dari number
  image: string;
  status: string;
  title: string;
  description: string;
  budget: string;
  year: number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface Beranda {
  hero: {
    title: string;
    subtitle: string;
  };
  slogan: {
    title: string;
    description: string;
  };
  launching: {
    title: string;
    description: string;
    image: string; 
  };
  faq: FaqItem[];
}

export interface DemografiRow {
  id: string;
  wilayah: string;
  rt: string;
  rw: string;
  penduduk: string;
}

export interface Profil {
  hero: {
    subtitle: string;
  };
  video: {
    title: string;
    description: string;
    url: string;
  };
  visiMisi: {
    description: string;
    visi: string;
    misi: string;
  };
  demografi: {
    title: string;
    description: string;
    totalPenduduk: string;
    lakiLaki: string;
    perempuan: string;
    petaUrl: string;
    tabelData: DemografiRow[];
  };
  sejarah: {
    title: string;
    description: string;
  };
}

export interface Kontak {
  heroSubtitle: string;
  description: string;
  email: string;
  phone: string;
  instagram: string;
  instagramUrl: string;
  // Hapus jamOperasional
  lokasi: {
    // Hapus title
    address: string;
    mapUrl: string;
  };
}