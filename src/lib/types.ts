export interface Usaha {
  id: string;
  image: string;
  title: string;
  description: string;
  phone: string;
  maps: string;
}

export interface PerangkatDesa {
  id: string;
  name: string;
  title: string;
  imageUrl: string;
  description: string;
}

export interface ProdukHukum {
  id: string;
  category: string;
  year: number;
  fileType: 'pdf';
  title: string;
  description: string;
  link: string;
}

export interface Pembangunan {
  id: string;
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
    heroImage: string;
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
    heroImage?: string;
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

export interface JamOperasionalItem {
  id: string;
  hari: string;
  jam: string;
  isLibur: boolean;
}

export interface Kontak {
  hero: {
    subtitle: string;
    heroImage?: string;
  };
  description: string;
  email: string;
  phone: string;
  instagram: string;
  instagramUrl: string;
  lokasi: {
    address: string;
    mapUrl: string;
  };
  jamOperasional: JamOperasionalItem[];
}

export interface LayananForm {
  id: string;
  title: string;
  description: string;
  link: string;
}

export interface Layanan {
  hero: {
    subtitle: string;
    heroImage?: string;
  };
  akses: {
    title: string;
    description: string;
  };
  forms: LayananForm[];
}


export interface PerangkatDesaPageData {
  hero: {
    subtitle: string;
    heroImage?: string;
  };
  description: string;
}

export interface ProdukPageData {
  hero: {
    subtitle: string;
    heroImage?: string;
  };
  description: string;
}

export interface UsahaDesaPageData {
  hero: {
    subtitle: string;
    heroImage?: string;
  };
  description: string;
}
