import React from 'react';
import Image from 'next/image';
import { Playfair_Display } from "next/font/google";
import { Poppins } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "700"], 
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700"], 
});

const HomePage: React.FC = () => {
  return (
    <main className="m-0 p-0 h-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="w-full h-screen flex flex-col ">
        <div className="relative flex-1 flex flex-col justify-center items-center ">
          <Image
            src="/landing-page.png"
            alt="Desa Slamparejo"
            fill
            quality={100}
            className="z-0 object-cover "
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0  bg-black/40 z-10" />
          <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
            <div className="relative flex flex-col items-center w-fit mx-auto mb-6">
              <h1
                className={`${playfair.className} text-white text-4xl md:text-6xl tracking-[9px]`}
              >
                PROFIL
              </h1>
              <div className="w-full border-b-1 border-white rounded-b-lg mt-6" />
            </div>
            <p
              className={`${poppins.className} text-white text-lg md:text-2xl font-thin leading-8  md:leading-10 max-w-2xl mb-10 w-full`}
            >
              Desa Slamparejo tumbuh dari sejarah, arah, dan tekad kuat untuk terus melayani masyarakat secara tulus dan berkelanjutan.
            </p>
          </div>
        </div>
      </section>


      {/* Video Section */}
      <section className="relative bg-[url('/Achievement.png')] min-h-screen text-white">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div className="relative z-20 w-full max-w-[1166px] mx-auto px-5 pt-[40px] md:pt-[60px]">
          <h1 className={`${playfair.className} video-title text-white mb-4 md:mb-6 text-left`}>
            Video Profil
          </h1>
          <p className={`${poppins.className} font-normal leading-8 tracking-[1.5px] text-white text-[20px] mb-10 text-left max-w-3xl`}>
            Setiap jengkal tanah, setiap tarikan napas warga, adalah bagian dari cerita besar yang hidup. Inilah Slamparejo, desa yang tumbuh dalam makna.
          </p>
        </div>
        <div className="relative z-20 w-full max-w-[1166px] mx-auto p-5 clear-both">
          <iframe
            className="w-full h-[calc(100vw*0.6)] max-h-[696px] border-none block mx-auto mb-[40px]"
            src="https://www.youtube.com/embed/YOUR_VIDEO_ID_HERE" 
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      {/* Visi Misi Section */}
      <section className="relative bg-[#F1F2F9] min-h-screen py-10 px-5">
        <div className="w-full max-w-[1166px] mx-auto">
        <div className="text-left">
          <div className="border-b border-black w-fit pb-3">
            <h1 className={`${playfair.className} video-title text-black text-left`}>
              Visi Misi
            </h1>
          </div>
          <p className={`${poppins.className} font-light text-black md:text-lg leading-relaxed tracking-[0.5px] mt-5 mb-16 max-w-4xl`}>
            Visi misi ini mencerminkan semangat membangun desa yang mandiri, sejahtera, dan tetap menjunjung nilai budaya lokal.
          </p>
        </div>
          <div className="flex flex-col md:flex-row gap-10 justify-center">
            {/* Visi Card */}
            <div className="bg-gray-50 p-8 rounded-lg shadow-md flex-1 max-w-md">
              <h2 className={`${playfair.className} text-2xl text-black md:text-3xl font-medium mb-6 text-center`}>VISI</h2>
              <p className={`${poppins.className} text-sm md:text-base leading-relaxed text-justify`}>
                Membangun Desa Slamparejo yang mandiri, sejahtera, dan berkelanjutan dengan tetap mempertahankan nilai-nilai budaya lokal serta kearifan masyarakat dalam tata kelola pemerintahan yang transparan dan akuntabel.
              </p>
            </div>

            {/* Misi Card */}
            <div className="bg-gray-50 p-8 rounded-lg shadow-md flex-1 max-w-md">
              <h2 className={`${playfair.className} text-2xl text-black md:text-3xl font-medium mb-6 text-center`}>MISI</h2>
              <ol className={`${poppins.className} text-sm md:text-base leading-relaxed space-y-3 list-decimal pl-5`}>
                <li>Meningkatkan kualitas pelayanan publik yang prima dan berorientasi pada kebutuhan masyarakat</li>
                <li>Memperkuat perekonomian desa melalui pengembangan potensi lokal dan UMKM</li>
                <li>Melestarikan budaya dan kearifan lokal sebagai identitas desa</li>
                <li>Membangun infrastruktur yang mendukung pembangunan berkelanjutan</li>
                <li>Mengoptimalkan tata kelola pemerintahan yang transparan dan partisipatif</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Demografi Section */}
      <section className="relative min-h-screen bg-cover bg-center py-15 px-5 pb-12 bg-[url('/c20512021615f3918f726e5fb61f5c95c047e233.jpg')]">
        <div className="absolute inset-0 bg-black/50 z-0"></div>

        <div className="relative z-10 rounded-xl w-full max-w-6xl mx-auto grid md:grid-cols-2 gap-8 text-white p-4 md:p-6 mb-10">
          <div className="space-y-6 w-full order-last md:order-none">
            <div className="rounded-md overflow-hidden shadow-lg w-full mt-[20px]">
              <div className="relative w-full h-0 pb-[56.25%]">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15806.691498613762!2d112.76887845!3d-7.929193899999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd62e66b4b7aee9%3A0x1dfb4e477cdba610!2sSlamparejo%2C%20Kec.%20Jabung%2C%20Kabupaten%20Malang%2C%20Jawa%20Timur!5e0!3m2!1sid!2sid!4v1752224970507!5m2!1sid!2sid" // Ganti dengan embed map Anda
                  style={{ border: 0 }} allowFullScreen={true} loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade">
                </iframe>
              </div>
            </div>

            <div className="w-full overflow-x-auto mb-8">
                <div className="bg-white p-4 rounded-lg shadow-lg">
              <div className={`${poppins.className} min-w-full text-sm space-y-2`}>
                <div className="flex gap-2">
                  <div className="bg-[#094B72] text-white font-semibold rounded-md px-2 py-2 text-center flex-1">No</div>
                  <div className="bg-[#094B72] text-white font-semibold rounded-md px-2 py-2 text-center flex-[2]">Wilayah</div>
                  <div className="bg-[#094B72] text-white font-semibold rounded-md px-2 py-2 text-center flex-1">RT</div>
                  <div className="bg-[#094B72] text-white font-semibold rounded-md px-2 py-2 text-center flex-1">RW</div>
                  <div className="bg-[#094B72] text-white font-semibold rounded-md px-2 py-2 text-center flex-[2]">Penduduk</div>
                </div>

                <div className="flex gap-2">
                  <div className="bg-[rgba(9,75,114,0.59)] text-white rounded-md shadow px-2 py-2 text-center flex-1">1</div>
                  <div className="bg-[rgba(9,75,114,0.59)] text-white rounded-md shadow px-2 py-2 text-center flex-[2]">Krajan</div>
                  <div className="bg-[rgba(9,75,114,0.59)] text-white rounded-md shadow px-2 py-2 text-center flex-1">17 RT</div>
                  <div className="bg-[rgba(9,75,114,0.59)] text-white rounded-md shadow px-2 py-2 text-center flex-1">2 RW</div>
                  <div className="bg-[rgba(9,75,114,0.59)] text-white rounded-md shadow px-2 py-2 text-center flex-[2]">2.991 JIWA</div>
                </div>

                <div className="flex gap-2">
                  <div className="bg-[rgba(9,75,114,0.59)] text-white rounded-md shadow px-2 py-2 text-center flex-1">2</div>
                  <div className="bg-[rgba(9,75,114,0.59)] text-white rounded-md shadow px-2 py-2 text-center flex-[2]">Busu</div>
                  <div className="bg-[rgba(9,75,114,0.59)] text-white rounded-md shadow px-2 py-2 text-center flex-1">20 RT</div>
                  <div className="bg-[rgba(9,75,114,0.59)] text-white rounded-md shadow px-2 py-2 text-center flex-1">3 RW</div>
                  <div className="bg-[rgba(9,75,114,0.59)] text-white rounded-md shadow px-2 py-2 text-center flex-[2]">2.806 JIWA</div>
                </div>

                <div className="flex gap-2 mb-[10px]">
                  <div className="bg-[rgba(9,75,114,0.59)] text-white font-semibold rounded-md shadow px-5 py-2 text-center flex-[3]">Jumlah</div>
                  <div className="bg-[rgba(9,75,114,0.59)] text-white font-semibold rounded-md shadow px-2 py-2 text-center flex-1">37 RT</div>
                  <div className="bg-[rgba(9,75,114,0.59)] text-white font-semibold rounded-md shadow px-2 py-2 text-center flex-1">5 RW</div>
                  <div className="bg-[rgba(9,75,114,0.59)] text-white font-semibold rounded-md shadow px-2 py-2 text-center flex-[2]">5.797 JIWA</div>
                </div>
              </div>
            </div>
            </div>
          </div>

          <div className="flex flex-col">
            <div>
              <h1 className={`${playfair.className} text-white font-medium text-3xl md:text-4xl leading-tight tracking-wider mb-4 mt-[10px]`}>
                Demografi<br />Desa Slamparejo
              </h1>
              <p className={`${poppins.className} text-gray-200 font-normal leading-8 tracking-[1.5px] text-justify`}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore consequat.
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4 text-sm font-semibold mt-[40px]">
              <div className="bg-white text-red-900 rounded-md p-3 md:p-4 shadow col-span-2">
                <p className={`${poppins.className} text-xs mb-1`}>Total Penduduk</p>
                <p className={`${poppins.className} text-lg md:text-xl font-bold`}>5.797 Jiwa</p>
              </div>
              <div className="bg-blue-100 text-[#094B72] rounded-md p-3 md:p-4 shadow">
                <p className={`${poppins.className} text-xs mb-1`}>Laki - Laki</p>
                <p className={`${poppins.className} text-lg md:text-xl font-bold`}>2.900 Jiwa</p>
              </div>
              <div className="bg-red-100 text-[#094B72] rounded-md p-3 md:p-4 shadow">
                <p className={`${poppins.className} text-xs mb-1`}>Perempuan</p>
                <p className={`${poppins.className} text-lg md:text-xl font-bold`}>2.897 Jiwa</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sejarah Section */}
      <section className="relative bg-[#F1F2F9] min-h-screen py-10 px-5">
      <div className="w-full max-w-[1166px] mx-auto">
        <div className="text-left">
        <div className="mb-8 text-left">
          <div className="border-b border-black pb-2 md:pb-4 w-fit">
            <h1 className={`${playfair.className} text-black text-3xl md:text-4xl`}>
              Sejarah Desa Slamparejo
            </h1>
          </div>
        </div>
          <div className="flex flex-col md:flex-row gap-6 items-stretch">
            {/* Kolom Gambar */}
            <div className="w-full md:w-1/2 flex flex-col flex-grow gap-6">
            {[
              { src: "/fbe3d8867cd111f2607bcb45c706e8363663dc5f.jpg", alt: "Mbah Gude" },
              { src: "/fbe3d8867cd111f2607bcb45c706e8363663dc5f.jpg", alt: "Wilayah Peteguhan" },
              { src: "/c20512021615f3918f726e5fb61f5c95c047e233.jpg", alt: "Dusun Busu" },
            ].map((img, idx) => (
              <div key={idx} className="relative w-full flex-1 min-h-[150px]">
                <Image
                src={img.src}
                alt={img.alt}
                fill
                quality={100}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="rounded-lg shadow-lg object-cover"
              />
              </div>
            ))}
          </div>

            {/* Kolom Narasi */}
            <div className="w-full md:w-1/2">
              <p className={`${poppins.className} text-justify font-light text-[20px] leading-[40px] tracking-[1.5px]`}>
                Desa Slamparejo merupakan suatu desa di kecamatan Jabung yang memiliki dua Dusun, yaitu Dusun Krajan dan Dusun Busu. Pada awal terbentuknya desa ini memiliki suatu sejarah yang menjadikan terbentuknya nama dari Desa Slamparejo.<br /><br />

                Dahulu ada seorang pengembara yang bernama Mbah Gude dan pengikutnya yang berasal dari Kerajaan Mataram ingin membuka lahan di lokasi Peteguhan yang sekarang disebut Desa Argosari. Warga Peteguhan merasa ada orang baru yang ingin menguasai wilayahnya, maka Mbah Gude dan pengikutnya diusir dari wilayah Peteguhan.<br /><br />

                Akhirnya Mbah Gude memutuskan untuk membuka lahan baru di wilayah utara Peteguhan. Ternyata daerah tersebut masih berupa hutan belantara. Setelah hutan tersebut dibabat, wilayah itu dinamakan Busu yang berasal dari kata &quot;Tembusan&quot; yang sekarang disebut Dusun Busu.<br /><br />

                Karena kondisi tanah di wilayah Busu termasuk daerah pegunungan, maka Mbah Gude dan pengikutnya memutuskan untuk memperluas wilayahnya ke utara. Ternyata daerah tersebut adalah daerah rawa-rawa. Mbah Gude dan pengikutnya memakai seutas tampar (tali) untuk menyeberang (nylamper). Setelah lahan tersebut dibabat, daerah itu dinamakan Slampar yang berasal dari kata &quot;Tampar&quot;.<br /><br />
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    </main>
  );
};

export default HomePage;
