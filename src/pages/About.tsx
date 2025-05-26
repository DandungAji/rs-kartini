
import Navbar from "@/components/Navbar";
import { Helmet } from "react-helmet-async";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnimatedSection from "@/components/AnimatedSection";

export default function About() {
  return (
    <>
      <Helmet>
        <title>Tentang - RS Kartini Bandung</title>
        <meta name="description" content="Sejarah dan perjalanan RS Kartini Bandung. Sejak tahun 1988." />
        <meta property="og:title" content="Tentang - RS Kartini Bandung" />
        <meta property="og:description" content="Sejarah dan perjalanan RS Kartini Bandung." />
        <meta property="og:url" content="https://rskartini.id/about" />
      </Helmet>
      <Navbar />
      
      <PageHeader 
        title="Tentang Rumah Sakit Kartini" 
        subtitle="Unggul dalam perawatan kesehatan sejak tahun 1988"
      />
      
      <div className="container mx-auto px-4 py-12">
        {/* History & Overview */}
        
        <AnimatedSection animationStyle="slide-up" className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Sejarah Kami</h2>
              <p className="text-gray-700 mb-4">
                Rumah Sakit Kartini di Bandung telah berdiri dan melayani warga Bandung dan sekitarnya sejak tahun 1988. Awalnya, RS Kartini dimulai dari pelayanan kesehatan oleh Ibu Bidan Kartini di Jalan Pahlawan Bandung dan berkembang dari masa ke masa.
              </p>
              <p className="text-gray-700 mb-4">
                Pada tahun 2004, Ibu Bidan Kartini meningkatkan pelayanan kesehatan yang diberikan menjadi Klinik Khusus Kebidanan dan Bedah Kartini. Kemudian, pada tahun 2010, status pelayanan berubah menjadi Klinik Utama Kartini dibawah naungan PT. Kasih Ibu Kartini (KIK).
              </p>
              <p className="text-gray-700 mb-4">
                RS Kartini memiliki layanan medis unggulan di bidang Ginekologi & Obstetri, Pediatri. Selain itu, RS Kartini juga memberikan pelayanan kesehatan dokter umum, klinik gigi, laboratorium, apotek, serta fasilitas ruang melahirkan (VK) dan fasilitas rawat inap.
              </p>
              <p className="text-gray-700">
                RS Kartini didukung oleh dokter spesialis dan dokter umum yang kompeten di bidangnya serta peralatan yang memadai. RS Kartini siap untuk memberikan pelayanan kesehatan terbaik bagi warga Bandung dan sekitarnya yang. membutuhkan pelayanan medis dan Kesehatan
              </p>
            </div>
            <div className="order-first md:order-last">
              <img 
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" 
                alt="RS Kartini Bandung" 
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </AnimatedSection>
        
        
        {/* Timeline */}
        <AnimatedSection animationStyle="fade-in" delay={200} className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Perjalanan Kami</h2>
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row gap-4">
            <div className="md:w-1/3 p-6 bg-secondary rounded-lg">
                <h3 className="text-xl font-bold mb-2">1984 - 1988</h3>
                <p className="text-gray-700">
                Praktek Bidan
                </p>
              </div>
              <div className="md:w-1/3 p-6 bg-secondary rounded-lg">
                <h3 className="text-xl font-bold mb-2">1988 - 2001</h3>
                <p className="text-gray-700">
                Rumah Bersalin Kartini
                </p>
              </div>
              <div className="md:w-1/3 p-6 bg-secondary rounded-lg">
                <h3 className="text-xl font-bold mb-2">2001 - 2006</h3>
                <p className="text-gray-700">
                Klinik Spesialis Kebidanan
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
            <div className="md:w-1/3 p-6 bg-secondary rounded-lg">
                <h3 className="text-xl font-bold mb-2">2006 - 2016</h3>
                <p className="text-gray-700">
                Klinik Khusus Kebidanan dan Bedah & Klinik Utama Kebidanan
                </p>
              </div>
              <div className="md:w-1/3 p-6 bg-secondary rounded-lg">
                <h3 className="text-xl font-bold mb-2">2016 - 2021</h3>
                <p className="text-gray-700">
                Klinik Utama Kartini
                </p>
              </div>
              <div className="md:w-1/3 p-6 bg-secondary rounded-lg">
                <h3 className="text-xl font-bold mb-2">2021 - Sekarang</h3>
                <p className="text-gray-700">
                RS Kartini
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>
        
        {/* Mission, Vision, Values */}
        <AnimatedSection animationStyle="stagger-children" delay={200} className="mb-16">
          <Tabs defaultValue="mission" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-primary text-muted-foreground">
              <TabsTrigger value="mission">Misi</TabsTrigger>
              <TabsTrigger value="vision">Visi</TabsTrigger>
              {/* <TabsTrigger value="values">Core Values</TabsTrigger> */}
            </TabsList>
            <TabsContent value="mission" className="p-6 bg-secondary rounded-lg mt-4">
              <h3 className="text-2xl font-bold mb-4">Misi Kami</h3>
              <ul className="list-disc pl-6 space-y-3">
                <li className="text-gray-700">
                Memberikan pelayanan kesehatan yang aman, cepat, tepat dan akurat
                </li>
                <li className="text-gray-700">
                Memberikan pelayanan “Hospitel” (Hospital hotel) dan “One Stop Service”.
                </li>
                <li className="text-gray-700">
                Meningkatkan kualitas sumber daya manusia terkait pelayanan kesehatan melalui pengelolaan kegiatan pelatihan dan pendidikan sesuai dengan perkembangan ilmu pengetahuan dan teknologi.
                </li>
                <li className="text-gray-700">
                Berpartisipasi aktif dalam meningkatkan kesehatan masyarakat melalui pelayanan kesehatan preventif, promotif, kuratif dan rehabilitatif.
                </li>
              </ul>
            </TabsContent>
            <TabsContent value="vision" className="p-6 bg-secondary rounded-lg mt-4">
              <h3 className="text-2xl font-bold mb-4">Visi Kami</h3>
              <p className="text-gray-700 mb-4">
              Menjadi rumah sakit pilihan utama masyarakat dengan memberikan mutu pelayanan yang prima yang berfokus pada keselamatan dan kepuasan pasien.
              </p>
            </TabsContent>
            <TabsContent value="values" className="p-6 bg-secondary rounded-lg mt-4">
              <h3 className="text-2xl font-bold mb-4">Our Core Values</h3>
              <ul className="list-disc pl-6 space-y-3">
                <li className="text-gray-700">
                  <span className="font-semibold">Compassion:</span> We treat each patient with kindness, empathy, and respect, recognizing their unique needs and circumstances.
                </li>
                <li className="text-gray-700">
                  <span className="font-semibold">Excellence:</span> We strive for the highest standards in healthcare delivery, constantly seeking ways to improve our services and patient outcomes.
                </li>
                <li className="text-gray-700">
                  <span className="font-semibold">Integrity:</span> We conduct ourselves with honesty, transparency, and ethical behavior in all interactions.
                </li>
                <li className="text-gray-700">
                  <span className="font-semibold">Collaboration:</span> We work together as a team, valuing the contributions of all staff members and partners in achieving our common goals.
                </li>
                <li className="text-gray-700">
                  <span className="font-semibold">Innovation:</span> We embrace change and continuously seek new and better ways to provide care and improve patient experiences.
                </li>
              </ul>
            </TabsContent>
          </Tabs>
        </AnimatedSection>
        
        {/* Team & Leadership
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Leadership</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mb-4 mx-auto w-48 h-48 rounded-full overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" 
                  alt="Dr. Emily Richards" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-1">Dr. Emily Richards</h3>
              <p className="text-primary mb-2">Chief Medical Officer</p>
              <p className="text-gray-600">
                With over 20 years of experience in healthcare administration and clinical practice, Dr. Richards oversees all medical operations.
              </p>
            </div>
            
            <div className="text-center">
              <div className="mb-4 mx-auto w-48 h-48 rounded-full overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" 
                  alt="Dr. Robert Thompson" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-1">Dr. Robert Thompson</h3>
              <p className="text-primary mb-2">Hospital Director</p>
              <p className="text-gray-600">
                Dr. Thompson brings extensive experience in hospital management and healthcare policy to lead our institution.
              </p>
            </div>
            
            <div className="text-center">
              <div className="mb-4 mx-auto w-48 h-48 rounded-full overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" 
                  alt="Sarah Johnson" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-1">Sarah Johnson</h3>
              <p className="text-primary mb-2">Director of Nursing</p>
              <p className="text-gray-600">
                With a passion for quality patient care, Sarah leads our nursing department with dedication and expertise.
              </p>
            </div>
          </div>
        </section> */}
        
        {/* Facilities & Technology */}
        <AnimatedSection animationStyle="stagger-children" delay={200} className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Fasilitas Kami</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" 
                alt="Fasilitas RS Kartini" 
                className="rounded-lg shadow-lg mb-4"
              />
              <h3 className="text-xl font-bold mb-2">Peralatan yang Canggih</h3>
              <p className="text-gray-700">
                Rumah sakit kami dilengkapi dengan teknologi medis terkini, termasuk pencitraan diagnostik canggih, dan sistem rekam medis elektronik.
              </p>
            </div>
            
            <div>
              <img 
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" 
                alt="Fasilitas RS Kartini" 
                className="rounded-lg shadow-lg mb-4"
              />
              <h3 className="text-xl font-bold mb-2">Lingkungan yang Nyaman</h3>
              <p className="text-gray-700">
                Kami telah merancang fasilitas kami dengan mempertimbangkan kenyamanan pasien, yang dilengkapi dengan kamar yang nyaman, ruang tunggu pasien, kantin dengan pilihan makanan rumahan.
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>
      
      <Footer />
    </>
  );
}
