import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { services } from "@/lib/mockData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, Clock, MapPin, Phone } from "lucide-react";
// Import all icons that might be used by services
import * as LucideIcons from "lucide-react";

export default function Index() {
  // Featured services for the homepage
  const featuredServices = services.slice(0, 3);

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero py-16 md:py-24 bg-hero-gradient">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-8 text-center md:text-left mb-10 md:mb-0">
              <h1 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">
                Jangan Lewatkan Kesempatan Terbaik
              </h1>
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

      {/* Quick Info Cards */}
      <section className="bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-card border-primary">
              <CardContent className="p-6 flex items-center">
                <Phone className="h-10 w-10 text-primary mr-4" />
                <div>
                  <h3 className="font-semibold text-lg text-foreground">Kontak Darurat</h3>
                  <p className="text-muted">+62 851-7964-8841</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-primary">
              <CardContent className="p-6 flex items-center">
                <Clock className="h-10 w-10 text-primary mr-4" />
                <div>
                  <h3 className="font-semibold text-lg text-foreground">Working Hours</h3>
                  <p className="text-muted">Mon-Fri: 8AM-6PM</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-primary">
              <CardContent className="p-6 flex items-center">
                <Calendar className="h-10 w-10 text-primary mr-4" />
                <div>
                  <h3 className="font-semibold text-lg text-foreground">Appointments</h3>
                  <p className="text-muted">Book Online or Call</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-primary">
              <CardContent className="p-6 flex items-center">
                <MapPin className="h-10 w-10 text-primary mr-4" />
                <div>
                  <h3 className="font-semibold text-lg text-foreground">Lokasi</h3>
                  <p className="text-muted">Jl. Pahlawan</p>
                </div>
              </CardContent>
            </Card>
          </div>
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
              // Use dynamic icon import from the Lucide icons
              const IconComponent = (LucideIcons[service.icon as keyof typeof LucideIcons] || LucideIcons.Activity) as React.ElementType;
              
              return (
                <Card key={service.id} className="border-primary shadow-md hover:shadow-lg transition-shadow bg-card">
                  <CardContent className="p-6 text-center">
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
                  </CardContent>
                </Card>
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