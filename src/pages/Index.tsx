import SplitText from '/Reactbits/SplitText/SplitText'
import BlurText from '/Reactbits/BlurText/BlurText'
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { services } from "@/lib/mockData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Activity, Stethoscope, Siren, Bed, Microscope, Scan, Pill } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Index() {
  // Featured services for the homepage
  const featuredServices = services.slice(0, 3);

  // Partner data with logo images
  const partners = [
    { id: "1", name: "BPJS Kesehatan", logo: "/images/bpjs.png" },
    { id: "2", name: "BNI Life", logo: "/images/bni-life.png" },
    { id: "3", name: "Jasa Raharja", logo: "/images/jasa-raharja.png" },
    { id: "4", name: "AdMedika", logo: "/images/admedika.png" },
  ];

  // FAQ data
  const faqs = [
    {
      question: "Apakah RS Kartini Bandung menerima pasien BPJS Kesehatan?",
      answer: "Ya, Rumah Sakit Kartini Bandung menerima pasien BPJS Kesehatan. Pastikan Anda membawa dokumen yang diperlukan seperti kartu BPJS aktif, rujukan dari fasilitas kesehatan tingkat pertama (Faskes 1), dan kartu identitas saat datang ke rumah sakit.",
    },
    {
      question: "Bagaimana cara membuat janji temu dengan dokter spesialis?",
      answer: "Anda dapat melihat jadwal praktik dokter melalui halaman Jadwal Dokter, lalu melakukan reservasi melalui telepon, WhatsApp, atau langsung di bagian pendaftaran kami.",
    },
    {
      question: "Apa saja layanan spesialis yang tersedia?",
      answer: "Kami menyediakan berbagai layanan spesialis, di antaranya: Spesialis Anak, Kebidanan & Kandungan, Penyakit Dalam, Saraf, Bedah, Gigi, Kulit & Kelamin, THT, Rehabilitasi Medik, Psikolog",
    },
    {
      question: "Apakah tersedia pendaftaran online?",
      answer: "Ya, kami menyediakan pendaftaran online melalui aplikasi Mobile JKN(BPJS), dan melalui chat whatsapp.",
    },
  ];

  // Map icon names to components (case-sensitive match with lucide-react exports)
  const iconMap = {
    Stethoscope: Stethoscope,
    Siren: Siren,
    Bed: Bed,
    Microscope: Microscope,
    Scan: Scan, // Mengganti ScanHeart karena tidak ada di lucide-react
    Pill: Pill,
    // Fallback
    default: Activity,
  };

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero py-16 md:py-24 bg-hero-gradient">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-8 text-center md:text-left mb-10 md:mb-0">
              <BlurText
                text="Jangan Lewatkan Kesempatan Terbaik!"
                delay={150}
                animateBy="words"
                direction="top"
                className="text-3xl md:text-5xl font-bold mb-6 text-foreground"
              />
              <p className="text-lg md:text-l mb-8 text-muted">
                Selalu pantau website kami untuk informasi eksklusif dan penawaran spesial
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button asChild size="lg" className="font-semibold bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link to="/doctor-schedule">Cari Dokter</Link>
                </Button>
                <Button asChild variant="secondary" size="lg" className="bg-secondary text-foreground hover:bg-secondary/80">
                  <Link to="/services">Layanan Kami</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1551076805-e1869033e561?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" 
                alt="Medical professionals" 
                className="rounded-lg shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Rekanan Section */}
      <section className="bg-background py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-foreground text-center">Rekanan</h2>
          <Carousel className="w-full max-w-4xl mx-auto">
            <CarouselContent>
              {partners.map((partner) => (
                <CarouselItem key={partner.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <div className="p-1 text-center">
                    <img
                      src={partner.logo}
                      alt={`${partner.name} logo`}
                      className="mx-auto h-16 w-16 object-contain hover:shadow-lg transition-shadow"
                    />
                    <p className="mt-2 text-sm text-muted">{partner.name}</p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>  

      {/* Featured Services */}
      <section className="section bg-background">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-foreground">Layanan Kami</h2>
          <p className="section-subtitle text-muted">
            Temukan beragam layanan spesialis dan fasilitas pendukung kesehatan yang siap melayani Anda dengan sepenuh hati.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredServices.map((service) => {
              // Use icon map to match service.icon with imported icons
              const IconComponent = (iconMap[service.icon as keyof typeof iconMap] || iconMap["default"]) as React.ElementType;
              
              return (
                <div key={service.id} className="border-primary shadow-md hover:shadow-lg transition-shadow bg-secondary p-6 text-center rounded-lg">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-popover rounded-full">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">{service.name}</h3>
                  <p className="text-muted mb-4">{service.description}</p>
                  <Button asChild variant="link" className="text-primary">
                    <Link to={`/services#${service.id}`}>Baca Selengkapnya</Link>
                  </Button>
                </div>
              );
            })}
          </div>
          
          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/services">Lihat Semua Layanan</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-secondary section">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <img 
                src="https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" 
                alt="Medical team" 
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="md:w-1/2 md:pl-12">
              <h2 className="text-3xl font-bold mb-6 text-foreground">Kenapa memilih RS Kartini Bandung?</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Tim Medis Ahli</h3>
                  <p className="text-muted">Para dokter dan staf medis kami adalah para ahli di bidangnya, yang berdedikasi untuk memberikan perawatan yang luar biasa.</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Teknologi Canggih</h3>
                  <p className="text-muted">Kami berinvestasi dalam peralatan dan teknologi medis terbaru untuk meningkatkan akurasi diagnosis dan efektivitas pengobatan.</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Perawatan yang Berpusat pada Pasien</h3>
                  <p className="text-muted">Kenyamanan, martabat, dan kebutuhan individu Anda adalah pusat dari pendekatan perawatan kesehatan kami.</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Layanan Komprehensif</h3>
                  <p className="text-muted">Dari perawatan pencegahan hingga perawatan yang rumit, kami menawarkan berbagai layanan medis dalam satu atap.</p>
                </div>
              </div>
              
              <Button asChild className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to="/about">Pelajari Tentang Rumah Sakit Kami</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-background py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-foreground text-center">Pertanyaan yang Sering Diajukan</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg text-foreground hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Butuh Bantuan Medis?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Tim medis profesional kami siap memberikan perawatan yang Anda butuhkan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-secondary text-foreground hover:bg-secondary/80">
              <Link to="/doctor-schedule">Jadwalkan Janji Temu</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-foreground border-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/contact">Kontak Kami</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}