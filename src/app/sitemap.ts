import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://desaslamparejo.id';

  // Halaman statis
  const staticRoutes = [
    '',
    '/berita',
    '/profil',
    '/layanan',
    '/usaha-desa',
    '/perangkat-desa',
    '/kontak',
    '/produk-hukum-dan-fisik',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));


  return [...staticRoutes];
}