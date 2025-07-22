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
