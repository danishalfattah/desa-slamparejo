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
    heroImage: string; // Ditambahkan
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
    heroImage: string; // Ditambahkan
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

// Menambahkan tipe data baru untuk halaman lain
export interface Layanan {
  hero: {
    subtitle: string;
    heroImage: string;
  };
  formLink: string;
}

export interface UsahaDesaPage {
    hero: {
        subtitle: string;
        heroImage: string;
    }
}

export interface PerangkatDesaPage {
    hero: {
        subtitle: string;
        heroImage: string;
    }
}

export interface ProdukHukumPage {
    hero: {
        subtitle: string;
        heroImage: string;
    }
}


export interface Kontak {
  hero: {
    subtitle: string;
    heroImage: string; // Ditambahkan
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
}
