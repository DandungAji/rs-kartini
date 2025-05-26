
import { Link } from "react-router-dom";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, MapPin, Phone } from "lucide-react";
import emailjs from "@emailjs/browser";
import AnimatedSection from "@/components/AnimatedSection";

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Send email using EmailJS
    emailjs.send(
      "service_rskrsk48",
      "template_n6o3dlu",
      {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
      },
      "webrskartini@gmail.com" // user ID EmailJS
    ).then(
      (result) => {
        toast({
          title: "Pesan Terkirim",
          description: "Terima kasih atas pesan Anda. Kami akan segera merespons.",
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
        setIsSubmitting(false);
      },
      (error) => {
        toast({
          title: "Error",
          description: "Gagal mengirim pesan. Silahkan coba lagi.",
          variant: "destructive",
        });
        setIsSubmitting(false);
      }
    );
  };

  return (
    <>
      <Helmet>
        <title>Kontak Kami - RS Kartini Bandung</title>
        <meta name="description" content="Hubungi tim kami untuk pertanyaan dan janji temu di RS Kartini Bandung. Buat janji temu dengan mudah." />
        <meta property="og:title" content="Kontak Kami - RS Kartini Bandung" />
        <meta property="og:description" content="Hubungi tim kami untuk pertanyaan dan janji temu di RS Kartini Bandung." />
        <meta property="og:url" content="https://rskartini.id/contact" />
      </Helmet>
    <div className="overflow-x-hidden">
      <Navbar />
      
      <div className="relative">    
      <PageHeader 
        title="Kontak Kami" 
        subtitle="Hubungi tim kami untuk pertanyaan dan janji temu"
      />
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <AnimatedSection animationStyle="slide-up" className="lg:col-span-1">
            <h2 className="text-2xl font-bold mb-6">Informasi Kontak</h2>
            
            <div className="space-y-6">
              <div className="flex p-4 bg-secondary rounded-lg hover-lift">
                <Phone className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Telepon</h3>
                  <p className="text-gray-600 mb-1">Gawat Darurat: 0851-7964-8841</p>
                  <p className="text-gray-600">Janji/booking: 0878-1988-1010</p>
                </div>
              </div>
              
              <div className="flex p-4 bg-secondary rounded-lg hover-lift">
                <Mail className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-gray-600 mb-1">marketing.rskartini@gmail.com</p>
                </div>
              </div>
              
              <div className="flex p-4 bg-secondary rounded-lg hover-lift">
                <MapPin className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Lokasi</h3>
                  <p className="text-gray-600 mb-1">Jl. Pahlawan No. 48, Neglasari, Kec. Cibeunying Kaler</p>
                  <p className="text-gray-600 mb-1">Bandung</p>
                  <p className="text-gray-600">Jawa Barat, 40124</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Jam Operasional</h2>
              <div className="space-y-2 p-4 bg-secondary rounded-lg hover-lift">
                <div className="flex justify-between">
                  <span>Poliklinik:</span>
                  <span className="text-primary"><Link to="/doctor-schedule">Lihat Jadwal</Link></span>
                </div>
                <div className="flex justify-between font-semibold text-primary mt-2">
                  <span>Layanan Gawat Darurat:</span>
                  <span>24/7</span>
                </div>
              </div>
            </div>
          </AnimatedSection>
          
          {/* Contact Form */}
          <AnimatedSection animationStyle="slide-up" delay={200} className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Kirim Pesan</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium">
                      Nama Anda
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                      className="placeholder:text-gray-400 hover-glow focus:hover-glow"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium">
                      Alamat Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="guest@example.com"
                      required
                      className="placeholder:text-gray-400 hover-glow focus:hover-glow"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-medium">
                      Nomor Telepon
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(555) 123-4567"
                      className="placeholder:text-gray-400 hover-glow focus:hover-glow"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="subject" className="block text-sm font-medium">
                      Subjek
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Permintaan untuk janji temu"
                      required
                      className="placeholder:text-gray-400 hover-glow focus:hover-glow"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-medium">
                    Pesan Anda
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Jelaskan kebutuhan anda..."
                    rows={6}
                    required
                    className="placeholder:text-gray-400 hover-glow focus:hover-glow"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="w-full md:w-auto hover-scale">
                  {isSubmitting ? "Mengirim..." : "Kirim Pesan"}
                </Button>
              </form>
            </div>
          </AnimatedSection>
        </div>
        
        {/* Google Maps */}
        <AnimatedSection animationStyle="fade-in" delay={400} className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Lokasi</h2>
          <div className="h-[400px] bg-gray-200 rounded-lg overflow-hidden shadow-md hover-lift">
            <iframe
              src="https://maps.google.com/maps?width=600&height=400&hl=en&q=rs%20kartini%20bandung&t=&z=14&ie=UTF8&iwloc=B&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Hospital Location"
            ></iframe>
          </div>
        </AnimatedSection>
      </div>
      
      <Footer />
    </div>
    </>
  );
}
