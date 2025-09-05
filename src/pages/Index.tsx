import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { services } from "@/lib/mockData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Activity,
  Stethoscope,
  Siren,
  Bed,
  Microscope,
  Scan,
  Pill,
} from "lucide-react";
import Parallax from "@/components/Parallax";
import AnimatedSection from "@/components/AnimatedSection";
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
import SpecialtiesSection from "@/components/SpecialtiesSection";
import { CalendarCheck, Award, Heart, Phone, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import SplitText from "@/components/ReactBits/SplitText/SplitText";
import BlurText from "@/components/ReactBits/BlurText/BlurText";

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
      answer:
        "Ya, Rumah Sakit Kartini Bandung menerima pasien BPJS Kesehatan. Pastikan Anda membawa dokumen yang diperlukan seperti kartu BPJS aktif, rujukan dari fasilitas kesehatan tingkat pertama (Faskes 1), dan kartu identitas saat datang ke rumah sakit.",
    },
    {
      question: "Bagaimana cara membuat janji temu dengan dokter spesialis?",
      answer:
        "Anda dapat melihat jadwal praktik dokter melalui halaman Jadwal Dokter, lalu melakukan reservasi melalui telepon, WhatsApp, atau langsung di bagian pendaftaran kami.",
    },
    {
      question: "Apa saja layanan spesialis yang tersedia?",
      answer:
        "Kami menyediakan berbagai layanan spesialis, di antaranya: Spesialis Anak, Kebidanan & Kandungan, Penyakit Dalam, Saraf, Bedah, Gigi, Kulit & Kelamin, THT, Rehabilitasi Medik, Psikolog",
    },
    {
      question: "Apakah tersedia pendaftaran online?",
      answer:
        "Ya, kami menyediakan pendaftaran online melalui aplikasi Mobile JKN(BPJS), dan melalui chat whatsapp.",
    },
  ];

  // Map icon names to components (case-sensitive match with lucide-react exports)
  const iconMap = {
    Stethoscope: Stethoscope,
    Siren: Siren,
    Bed: Bed,
    Microscope: Microscope,
    Scan: Scan,
    Pill: Pill,
    // Fallback
    default: Activity,
  };

  return (
    <>
      <Helmet>
        <title>RS Kartini Bandung - Rumah Sakit Pilihan Keluarga</title>
        <meta
          name="description"
          content="RS Kartini Bandung menyediakan layanan kesehatan komprehensif dengan tim medis ahli dan teknologi canggih. Temukan jadwal dokter, layanan unggulan, dan informasi kesehatan."
        />
        <meta
          property="og:title"
          content="RS Kartini Bandung - Rumah Sakit Pilihan Keluarga"
        />
        <meta
          property="og:description"
          content="RS Kartini Bandung menyediakan layanan kesehatan komprehensif dengan tim medis ahli dan teknologi canggih."
        />
        <meta
          property="og:image"
          content="https://rskartini.id/images/icon-logo.png"
        />
        <meta property="og:url" content="https://rskartini.id/" />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="overflow-x-hidden">
        <Navbar />

        {/* Hero Section with Parallax */}
        <section className="hero py-16 md:py-24 bg-hero-gradient relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 md:pr-8 text-center md:text-left mb-10 md:mb-0">
                <BlurText
                  text="Jangan Lewatkan Kesempatan Terbaik!"
                  delay={150}
                  animateBy="words"
                  direction="top"
                  className="text-3xl md:text-5xl font-bold mb-6 text-foreground"
                />
                <h1 className="text-lg md:text-l mb-8 text-muted">
                  Selalu pantau website kami untuk informasi eksklusif dan
                  penawaran spesial
                </h1>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Button
                    asChild
                    size="lg"
                    className="font-semibold bg-primary text-primary-foreground hover:bg-primary/90 hover-scale"
                  >
                    <Link to="/doctor-schedule">Cari Dokter</Link>
                  </Button>
                  <Button
                    asChild
                    variant="secondary"
                    size="lg"
                    className="bg-background border border-muted/20 text-foreground hover:bg-background/80 hover-scale"
                  >
                    <Link to="/services">Layanan Kami</Link>
                  </Button>
                </div>
              </div>
              <Parallax speed={-0.2} className="md:w-1/2">
                <div className="relative">
                  <img
                    // src="images/rs-kartini.png"
                    src="images/maulid.jpeg"
                    alt="RS Kartini Bandung"
                    className="rounded-lg shadow-xl w-full hover-lift"
                  />
                  <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-primary rounded-full animate-float opacity-80"></div>
                  <div
                    className="absolute -top-4 -right-4 w-16 h-16 bg-secondary rounded-full animate-float opacity-80"
                    style={{ animationDelay: "2s" }}
                  ></div>
                </div>
              </Parallax>
            </div>
          </div>
        </section>

        {/* Rekanan Section */}
        <AnimatedSection
          animationStyle="fade-in"
          className="bg-background py-12"
        >
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-foreground text-center">
              Rekanan
            </h2>
            <Carousel className="w-full max-w-4xl mx-auto">
              <CarouselContent>
                {partners.map((partner) => (
                  <CarouselItem
                    key={partner.id}
                    className="basis-1/2 md:basis-1/3 lg:basis-1/4"
                  >
                    <div className="p-1 text-center">
                      <img
                        src={partner.logo}
                        alt={`${partner.name} logo`}
                        className="mx-auto h-16 w-16 object-contain hover-scale"
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
        </AnimatedSection>

        {/* Featured Services */}
        <AnimatedSection
          animationStyle="stagger-children"
          className="section bg-background"
        >
          <div className="container mx-auto px-4">
            <h2 className="section-title text-foreground">Layanan Kami</h2>
            <p className="section-subtitle text-muted">
              Temukan beragam layanan spesialis dan fasilitas pendukung
              kesehatan yang siap melayani Anda dengan sepenuh hati.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredServices.map((service) => {
                // Use icon map to match service.icon with imported icons
                const IconComponent = (iconMap[
                  service.icon as keyof typeof iconMap
                ] || iconMap["default"]) as React.ElementType;

                return (
                  <div
                    key={service.id}
                    className="border-primary shadow-md hover-glow bg-secondary p-6 text-center rounded-lg"
                  >
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-popover rounded-full">
                        <IconComponent className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-foreground">
                      {service.name}
                    </h3>
                    <p className="text-muted mb-4">{service.description}</p>
                    <Button
                      asChild
                      variant="link"
                      className="text-primary hover-scale"
                    >
                      <Link to={`/services#${service.id}`}>
                        Baca Selengkapnya
                      </Link>
                    </Button>
                  </div>
                );
              })}
            </div>

            <div className="text-center mt-12">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 hover-scale"
              >
                <Link to="/services">Lihat Semua Layanan</Link>
              </Button>
            </div>
          </div>
        </AnimatedSection>

        {/* Why Choose Us */}
        <section className="bg-secondary section relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row items-center">
              <AnimatedSection
                animationStyle="slide-up"
                className="md:w-1/2 mb-8 md:mb-0"
              >
                <img
                  src="images/icu.jpeg"
                  alt="Fasilitas ICU"
                  className="rounded-lg shadow-lg hover-lift"
                />
              </AnimatedSection>

              <AnimatedSection
                animationStyle="stagger-children"
                className="md:w-1/2 md:pl-12"
              >
                <h2 className="text-3xl font-bold mb-6 text-foreground">
                  Kenapa memilih RS Kartini Bandung?
                </h2>

                <div className="space-y-6">
                  <div className="p-4 bg-background/70 backdrop-blur-sm rounded-lg shadow-sm hover-lift">
                    <h3 className="text-xl font-semibold mb-2 text-foreground">
                      Tim Medis Ahli
                    </h3>
                    <p className="text-muted">
                      Para dokter dan staf medis kami adalah para ahli di
                      bidangnya, yang berdedikasi untuk memberikan perawatan
                      yang luar biasa.
                    </p>
                  </div>

                  <div className="p-4 bg-background/70 backdrop-blur-sm rounded-lg shadow-sm hover-lift">
                    <h3 className="text-xl font-semibold mb-2 text-foreground">
                      Teknologi Canggih
                    </h3>
                    <p className="text-muted">
                      Kami berinvestasi dalam peralatan dan teknologi medis
                      terbaru untuk meningkatkan akurasi diagnosis dan
                      efektivitas pengobatan.
                    </p>
                  </div>

                  <div className="p-4 bg-background/70 backdrop-blur-sm rounded-lg shadow-sm hover-lift">
                    <h3 className="text-xl font-semibold mb-2 text-foreground">
                      Perawatan yang Berpusat pada Pasien
                    </h3>
                    <p className="text-muted">
                      Kenyamanan, martabat, dan kebutuhan individu Anda adalah
                      pusat dari pendekatan perawatan kesehatan kami.
                    </p>
                  </div>

                  <div className="p-4 bg-background/70 backdrop-blur-sm rounded-lg shadow-sm hover-lift">
                    <h3 className="text-xl font-semibold mb-2 text-foreground">
                      Layanan Komprehensif
                    </h3>
                    <p className="text-muted">
                      Dari perawatan pencegahan hingga perawatan yang rumit,
                      kami menawarkan berbagai layanan medis dalam satu atap.
                    </p>
                  </div>
                </div>

                <Button
                  asChild
                  className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90 hover-scale"
                >
                  <Link to="/about">Pelajari Tentang Rumah Sakit Kami</Link>
                </Button>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <AnimatedSection
          animationStyle="fade-in"
          className="bg-background py-12"
        >
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-foreground text-center">
              Pertanyaan yang Sering Diajukan
            </h2>
            <Accordion
              type="single"
              collapsible
              className="w-full max-w-3xl mx-auto"
            >
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="hover-lift"
                >
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
        </AnimatedSection>

        {/* CTA Section */}
        <section className="section bg-primary text-primary-foreground relative overflow-hidden">
          <Parallax speed={0.2} className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-500 opacity-50"></div>
            <div className="bg-[url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&auto=format&fit=crop&q=60')] bg-cover bg-center absolute inset-0 mix-blend-overlay"></div>
          </Parallax>

          <div className="container mx-auto px-4 text-center relative z-10">
            <AnimatedSection animationStyle="slide-up">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Butuh Bantuan Medis?
              </h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Tim medis profesional kami siap memberikan perawatan yang Anda
                butuhkan.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-background text-foreground hover:bg-background/90 hover-scale"
                >
                  <Link to="/doctor-schedule">Jadwalkan Janji Temu</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="text-background bg-primary border-primary-foreground hover:bg-primary-foreground/10 hover-scale"
                >
                  <Link to="/contact">Kontak Kami</Link>
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
