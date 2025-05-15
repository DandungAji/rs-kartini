
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function About() {
  return (
    <>
      <Navbar />
      
      <PageHeader 
        title="Tentang Rumah Sakit Kartini" 
        subtitle="Unggul dalam perawatan kesehatan sejak tahun 1988"
      />
      
      <div className="container mx-auto px-4 py-12">
        {/* History & Overview */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our History</h2>
              <p className="text-gray-700 mb-4">
                Founded in 1990, Rumah Sakit Kartini began as a small community clinic with a team of dedicated medical professionals committed to providing quality healthcare to the local community.
              </p>
              <p className="text-gray-700 mb-4">
                Over the years, we've expanded our facilities and services, growing into a comprehensive medical center while maintaining our commitment to patient-centered care and clinical excellence.
              </p>
              <p className="text-gray-700">
                Today, Rumah Sakit Kartini stands as a leading healthcare provider, equipped with state-of-the-art technology and staffed by top medical specialists across various disciplines.
              </p>
            </div>
            <div className="order-first md:order-last">
              <img 
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" 
                alt="Hospital building" 
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </section>
        
        {/* Timeline */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Sejarah Kami</h2>
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
        </section>
        
        {/* Mission, Vision, Values */}
        <section className="mb-16">
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
        </section>
        
        {/* Team & Leadership */}
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
        </section>
        
        {/* Facilities & Technology */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-center">Our Facilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" 
                alt="Hospital facilities" 
                className="rounded-lg shadow-lg mb-4"
              />
              <h3 className="text-xl font-bold mb-2">State-of-the-art Equipment</h3>
              <p className="text-gray-700">
                Our hospital is equipped with the latest medical technology, including advanced diagnostic imaging, minimally invasive surgical systems, and electronic health record systems.
              </p>
            </div>
            
            <div>
              <img 
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" 
                alt="Medical technology" 
                className="rounded-lg shadow-lg mb-4"
              />
              <h3 className="text-xl font-bold mb-2">Comfortable Environment</h3>
              <p className="text-gray-700">
                We've designed our facilities with patient comfort in mind, featuring private rooms, family waiting areas, a cafeteria with healthy options, and healing gardens throughout the campus.
              </p>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </>
  );
}
