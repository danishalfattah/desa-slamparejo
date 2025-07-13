import Card from "./card";

const dataPerangkat = [
  {
    name: "H. Wahyudi, SH,MM",
    title: "Kepala Desa",
    imageUrl: "/kepala desa.png",
    description:
      "Memimpin dan mengkoordinasikan seluruh kegiatan pemerintahan desa, pembangunan, dan pemberdayaan masyarakat",
  },
  {
    name: "Iman Supriyo, SE",
    title: "Sekretaris Desa",
    imageUrl: "/sekretaris desa.png",
    description:
      "Memimpin dan mengkoordinasikan seluruh kegiatan pemerintahan desa, pembangunan, dan pemberdayaan masyarakat",
  },
  {
    name: "Wiji Santoso",
    title: "Kasi Pemerintahan",
    imageUrl: "/kasi pemerintahan.png",
    description:
      "Memimpin dan mengkoordinasikan seluruh kegiatan pemerintahan desa, pembangunan, dan pemberdayaan masyarakat",
  },
  {
    name: "Ngatmono Adi",
    title: "Kasi Pelayanan",
    imageUrl: "/kasi pelayanan.png",
    description:
      "Memimpin dan mengkoordinasikan seluruh kegiatan pemerintahan desa, pembangunan, dan pemberdayaan masyarakat",
  },
  {
    name: "Riki Mulyono U.",
    title: "Kasi Kesos",
    imageUrl: "/kasi kesos.png",
    description:
      "Memimpin dan mengkoordinasikan seluruh kegiatan pemerintahan desa, pembangunan, dan pemberdayaan masyarakat",
  },
  {
    name: "Wahyu Widodo, S.Kom",
    title: "Kaur Perencanaan",
    imageUrl: "/kaur perencanaan.png",
    description:
      "Memimpin dan mengkoordinasikan seluruh kegiatan pemerintahan desa, pembangunan, dan pemberdayaan masyarakat",
  },
  {
    name: "Yuyun Dian K.",
    title: "Kaur Keuangan",
    imageUrl: "/kaur keuangan.png",
    description:
      "Memimpin dan mengkoordinasikan seluruh kegiatan pemerintahan desa, pembangunan, dan pemberdayaan masyarakat",
  },
  {
    name: "Sujiatiningsih",
    title: "Kaur TU & Umum",
    imageUrl: "/kaur tu & umum.png",
    description:
      "Memimpin dan mengkoordinasikan seluruh kegiatan pemerintahan desa, pembangunan, dan pemberdayaan masyarakat",
  },
  {
    name: "Winaryo",
    title: "Kasun Krajan",
    imageUrl: "/kasun krajan.png",
    description:
      "Memimpin dan mengkoordinasikan seluruh kegiatan pemerintahan desa, pembangunan, dan pemberdayaan masyarakat",
  },
  {
    name: "Sapuan",
    title: "Kasun Busu",
    imageUrl: "/kasun busu.png",
    description:
      "Memimpin dan mengkoordinasikan seluruh kegiatan pemerintahan desa, pembangunan, dan pemberdayaan masyarakat",
  },
  {
    name: "???",
    title: "Staff Baru",
    imageUrl: "/staff baru.png",
    description:
      "Memimpin dan mengkoordinasikan seluruh kegiatan pemerintahan desa, pembangunan, dan pemberdayaan masyarakat",
  },
];

export default function DaftarPerangkat() {
  return (
    <section className="bg-[#f4f8fc] px-4 py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
        {dataPerangkat.map((item, idx) => (
          <Card
            key={idx}
            name={item.name}
            title={item.title}
            description={item.description}
            imageUrl={item.imageUrl}
          />
        ))}
      </div>
    </section>
  );
}