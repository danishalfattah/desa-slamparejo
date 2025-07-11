import Card from "./card";

const dataPerangkat = [
  {
    name: "H. Wahyudi, SH,MM",
    title: "Kepala Desa",
    imageUrl: "/foto-wahyudi.png",
    description:
      "Memimpin dan mengkoordinasikan seluruh kegiatan pemerintahan desa, pembangunan, dan pemberdayaan masyarakat",
  },
  {
    name: "H. Wahyudi, SH,MM",
    title: "Kepala Desa",
    imageUrl: "/foto-wahyudi.png",
    description:
      "Memimpin dan mengkoordinasikan seluruh kegiatan pemerintahan desa, pembangunan, dan pemberdayaan masyarakat",
  },
  {
    name: "H. Wahyudi, SH,MM",
    title: "Kepala Desa",
    imageUrl: "/foto-wahyudi.png",
    description:
      "Memimpin dan mengkoordinasikan seluruh kegiatan pemerintahan desa, pembangunan, dan pemberdayaan masyarakat",
  },
  {
    name: "H. Wahyudi, SH,MM",
    title: "Kepala Desa",
    imageUrl: "/foto-wahyudi.png",
    description:
      "Memimpin dan mengkoordinasikan seluruh kegiatan pemerintahan desa, pembangunan, dan pemberdayaan masyarakat",
  },
  {
    name: "H. Wahyudi, SH,MM",
    title: "Kepala Desa",
    imageUrl: "/faq.png",
    description:
      "Memimpin dan mengkoordinasikan seluruh kegiatan pemerintahan desa, pembangunan, dan pemberdayaan masyarakat",
  },
  {
    name: "H. Wahyudi, SH,MM",
    title: "Kepala Desa",
    imageUrl: "/foto-wahyudi.png",
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