import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { PageHeader } from "@/components/admin/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Home,
  Users,
  Building,
  Briefcase,
  FileText,
  MapPin,
  Phone,
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/admin");
  }

  const navigationItems = [
    {
      title: "Halaman Beranda",
      description: "Kelola konten utama website desa",
      icon: Home,
      href: "/admin/beranda",
    },
    {
      title: "Profil Desa",
      description: "Visi, misi, demografi, dan sejarah desa",
      icon: MapPin,
      href: "/admin/profil",
    },
    {
      title: "Perangkat Desa",
      description: "Data aparatur dan perangkat desa",
      icon: Users,
      href: "/admin/perangkat-desa",
    },
    {
      title: "Produk & Pembangunan",
      description: "Produk hukum dan data pembangunan",
      icon: Building,
      href: "/admin/produk",
    },
    {
      title: "Usaha Desa",
      description: "UMKM dan ekonomi lokal desa",
      icon: Briefcase,
      href: "/admin/usaha-desa",
    },
    {
      title: "Layanan",
      description: "Formulir dan pelayanan desa",
      icon: FileText,
      href: "/admin/layanan",
    },
    {
      title: "Kontak",
      description: "Informasi kontak dan lokasi desa",
      icon: Phone,
      href: "/admin/kontak",
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard Admin"
        description="Pilih menu untuk mengelola konten website desa"
      />

      {/* Navigation Menu */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {navigationItems.map((item) => (
          <Link key={item.title} href={item.href}>
            <Card className="h-full hover:shadow-md transition-all duration-200 cursor-pointer hover:border-primary/20 group">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors truncate">
                      {item.title}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-xs leading-relaxed line-clamp-2">
                  {item.description}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
