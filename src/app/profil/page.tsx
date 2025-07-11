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
      <section className="relative bg-[url('/fbe3d8867cd111f2607bcb45c706e8363663dc5f.jpg')] bg-cover bg-center h-screen text-white">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div className="relative z-20 text-center px-4 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full">
          <h1 className={`${playfair.className} font-medium text-4xl md:text-5xl lg:text-6xl leading-tight tracking-[3px] md:tracking-[6px] lg:tracking-[9px] text-center mb-6 md:mb-8`}>
            PROFIL
          </h1>
          <div className="underline-custom"></div>
          <p className={`${poppins.className} font-light text-base md:text-lg leading-relaxed tracking-[0.5px] text-center max-w-2xl w-full mx-auto mb-8 px-4`}>
            Desa Slamparejo tumbuh dari sejarah, arah, dan tekad kuat untuk terus melayani masyarakat secara tulus dan berkelanjutan.
          </p>
        </div>
      </section>

      {/* Video Section */}
      <section className="relative bg-[url('/Achievement.png')] min-h-screen text-white pb-[50px]">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div className="relative z-20 w-full max-w-[1166px] mx-auto px-5 pt-[40px] md:pt-[60px]">
          <h1 className={`${playfair.className} video-title text-white mb-4 md:mb-6 text-left`}>
            VIDEO PROFIL
          </h1>
          <p className={`${poppins.className} font-light text-sm md:text-lg lg:text-xl leading-relaxed md:leading-loose lg:leading-[2rem] tracking-[0.5px] text-white mb-10 text-left max-w-2xl`}>
            Setiap jengkal tanah, setiap tarikan napas warga, adalah bagian dari cerita besar yang hidup. Inilah Slamparejo, desa yang tumbuh dalam makna.
          </p>
        </div>
        <div className="relative z-20 w-full max-w-[1166px] mx-auto p-5 clear-both">
          <iframe
            className="w-full h-[calc(100vw*0.6)] max-h-[696px] border-none block mx-auto"
            src="https://www.youtube.com/embed/YOUR_VIDEO_ID_HERE" 
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      {/* Visi Misi Section */}
      <section className="relative bg-white min-h-screen text-custom-blue py-20 px-20">
        <div className="w-full max-w-[1166px] mx-auto">
          <div className="text-left">
            <h1 className={`${playfair.className} video-title text-custom-blue mb-4 md:mb-6 text-left`}>
              VISI MISI
            </h1>
            <div className="w-[200px] h-[1px] bg-custom-blue opacity-100 mb-8"></div>

            <p className={`${poppins.className} font-light text-base md:text-lg leading-relaxed tracking-[0.5px] mb-16 max-w-2xl`}>
              Visi misi ini mencerminkan semangat membangun desa yang mandiri, sejahtera, dan tetap menjunjung nilai budaya lokal.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-10 justify-center">
            {/* Visi Card */}
            <div className="bg-gray-50 p-8 rounded-lg shadow-md flex-1 max-w-md">
              <h2 className={`${playfair.className} text-2xl md:text-3xl font-medium mb-6 text-center`}>VISI</h2>
              <p className={`${poppins.className} text-sm md:text-base leading-relaxed text-justify`}>
                Membangun Desa Slamparejo yang mandiri, sejahtera, dan berkelanjutan dengan tetap mempertahankan nilai-nilai budaya lokal serta kearifan masyarakat dalam tata kelola pemerintahan yang transparan dan akuntabel.
              </p>
            </div>

            {/* Misi Card */}
            <div className="bg-gray-50 p-8 rounded-lg shadow-md flex-1 max-w-md">
              <h2 className={`${playfair.className} text-2xl md:text-3xl font-medium mb-6 text-center`}>MISI</h2>
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

        <div className="relative z-10 rounded-xl w-full max-w-6xl mx-auto grid md:grid-cols-2 gap-8 text-white p-4 md:p-6 mt-10 mb-10">
          <div className="space-y-6 w-full order-last md:order-none">
            <div className="rounded-md overflow-hidden shadow-lg w-full mt-[60px]">
              <div className="relative w-full h-0 pb-[56.25%]">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15830.49969411649!2d112.7123984!3d-7.2574712!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7f9175a0d3b6f%3A0x7d2b8b9b8b9b8b9b!2sSurabaya%2C%20East%20Java!5e0!3m2!1sen!2sid!4v1678888888888!5m2!1sen!2sid" // Ganti dengan embed map Anda
                  style={{ border: 0 }} allowFullScreen={true} loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade">
                </iframe>
              </div>
            </div>

            <div className="w-full overflow-x-auto mb-8">
              <div className={`${poppins.className} min-w-full text-sm space-y-2`}>
                <div className="flex gap-2">
                  <div className="bg-blue-800 text-white font-semibold rounded-md px-2 py-2 text-center flex-1">No</div>
                  <div className="bg-blue-800 text-white font-semibold rounded-md px-2 py-2 text-center flex-[2]">Wilayah</div>
                  <div className="bg-blue-800 text-white font-semibold rounded-md px-2 py-2 text-center flex-1">RT</div>
                  <div className="bg-blue-800 text-white font-semibold rounded-md px-2 py-2 text-center flex-1">RW</div>
                  <div className="bg-blue-800 text-white font-semibold rounded-md px-2 py-2 text-center flex-[2]">Penduduk</div>
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

          <div className="flex flex-col justify-between">
            <div>
              <h1 className={`${playfair.className} text-white font-medium text-3xl md:text-4xl leading-tight tracking-wider mb-4 mt-[60px]`}>
                Demografi<br />Desa Slamparejo
              </h1>
              <p className={`${poppins.className} text-gray-200 text-sm md:text-base leading-relaxed mb-6 md:mb-10 text-justify`}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore consequat.
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4 text-sm font-semibold">
              <div className="bg-white text-red-900 rounded-md p-3 md:p-4 shadow col-span-2">
                <p className={`${poppins.className} text-xs mb-1`}>Total Penduduk</p>
                <p className={`${poppins.className} text-lg md:text-xl font-bold`}>5.797 Jiwa</p>
              </div>
              <div className="bg-blue-100 text-blue-900 rounded-md p-3 md:p-4 shadow">
                <p className={`${poppins.className} text-xs mb-1`}>Laki - Laki</p>
                <p className={`${poppins.className} text-lg md:text-xl font-bold`}>2.900 Jiwa</p>
              </div>
              <div className="bg-red-100 text-blue-900 rounded-md p-3 md:p-4 shadow">
                <p className={`${poppins.className} text-xs mb-1`}>Perempuan</p>
                <p className={`${poppins.className} text-lg md:text-xl font-bold`}>2.897 Jiwa</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sejarah Section */}
      <section className="relative bg-white min-h-screen text-custom-blue py-20 px-5">
        <div className="w-full max-w-[1166px] mx-auto">
          <div className="text-left">
            <h1 className={`${playfair.className} text-custom-blue mb-4 md:mb-6 text-left text-3xl md:text-4xl font-bold`}>
              Sejarah Desa Slamparejo
            </h1>
            <div className="w-full md:w-[470px] h-[1px] bg-custom-blue opacity-100 mb-8"></div>

            <div className="flex flex-col md:flex-row gap-6 items-stretch">
              <div className="w-full md:w-1/2 flex flex-col gap-6">
                <div className="flex-1 relative w-full h-[200px] md:h-[250px] lg:h-[300px]">
                  <Image
                    src="/fbe3d8867cd111f2607bcb45c706e8363663dc5f.jpg"
                    alt="Mbah Gude"
                    fill
                    quality={100}
                    className="rounded-lg shadow-lg object-cover"
                  />
                </div>
                <div className="flex-1 relative w-full h-[200px] md:h-[250px] lg:h-[300px]">
                  <Image
                    src="/fbe3d8867cd111f2607bcb45c706e8363663dc5f.jpg"
                    alt="Wilayah Peteguhan"
                    fill
                    quality={100}
                    className="rounded-lg shadow-lg object-cover"
                  />
                </div>
                <div className="flex-1 relative w-full h-[200px] md:h-[250px] lg:h-[300px]">
                  <Image
                    src="/c20512021615f3918f726e5fb61f5c95c047e233.jpg"
                    alt="Dusun Busu"
                    fill
                    quality={100}
                    className="rounded-lg shadow-lg object-cover"
                  />
                </div>
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