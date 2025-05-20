
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { services } from "@/lib/mockData";
import { Service } from "@/lib/types";
import * as LucideIcons from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check } from "lucide-react";
import Parallax from "@/components/Parallax";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";

export default function Services() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Map icons based on service.icon
  const getServiceIcon = (service: Service): React.ElementType => {
    const iconMap: { [key: string]: keyof typeof LucideIcons } = {
      // Map by service name as fallback (optional)
      "Rawat Jalan": "Stethoscope",
      "IGD": "Siren",
      "Rawat Inap": "Bed",
      "Laboratorium": "Microscope",
      "Radiologi": "Scan",
      "Farmasi": "Pill",
      // Fallback if no match
      default: "Activity",
    };

    // Use service.icon directly, with fallback to iconMap
    const iconKey = service.icon || iconMap[service.name] || iconMap["default"];
    return (LucideIcons[iconKey] || LucideIcons.Activity) as React.ElementType;
  };

  // Handle service click to show detailed view
  const handleServiceClick = (service: Service) => {
    setSelectedService(service);
    setDialogOpen(true);
  };

  return (
    <div className="overflow-x-hidden">
      <Navbar />
      
      <div className="relative">  
        <PageHeader 
        title="Layanan Kami" 
        subtitle="Layanan kesehatan yang komprehensif untuk semua kebutuhan medis Anda"
      />
      </div>
      
      <div className="container mx-auto px-4 py-12">
        {/* Services List */}
        <AnimatedSection animationStyle="stagger-children" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service: Service) => {
            const Icon = getServiceIcon(service);
            
            return (
              <Card 
                key={service.id} 
                id={service.id} 
                className="hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:shadow-primary/20"
                onClick={() => handleServiceClick(service)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-secondary rounded-full mr-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">{service.name}</h3>
                  </div>
                  <p className="text-gray-600">{service.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </AnimatedSection>
        
        {/* Service Detail Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-2xl">
            {selectedService && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl flex items-center">
                    {(() => {
                      const Icon = getServiceIcon(selectedService);
                      return <Icon className="h-6 w-6 text-primary mr-3" />;
                    })()}
                    {selectedService.name}
                  </DialogTitle>
                  <DialogDescription>
                  </DialogDescription>
                </DialogHeader>
                
                <div className="mt-4">
                  <p className="text-gray-700 mb-6">{selectedService.description}</p>
                  
                  {selectedService.detailedDescription && (
                    <div className="mb-6">
                      <h4 className="text-lg font-medium mb-2">Tentang Layanan Ini</h4>
                      <p className="text-gray-600">{selectedService.detailedDescription}</p>
                    </div>
                  )}
                  
                  {selectedService.procedures && selectedService.procedures.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-lg font-medium mb-2">Prosedur yang Disertakan</h4>
                      <ul className="space-y-1">
                        {selectedService.procedures.map((procedure, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{procedure}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {selectedService.benefits && selectedService.benefits.length > 0 && (
                    <div>
                      <h4 className="text-lg font-medium mb-2">Keuntungan</h4>
                      <ul className="space-y-1">
                        {selectedService.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
        
        {/* Additional Info */}
        <AnimatedSection animationStyle="fade-in" className="mt-16 bg-primary rounded-lg p-8 relative overflow-hidden">
          <Parallax speed={0.1} className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-500 opacity-30"></div>
            <div className="bg-[url('https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=1200&auto=format&fit=crop&q=60')] bg-cover bg-center absolute inset-0 mix-blend-overlay"></div>
          </Parallax>
          
          <div className="relative z-10">
            <h2 className="text-2xl text-white font-bold mb-4">Butuh Perawatan Khusus?</h2>
            <p className="text-white/90 mb-4">
              Rumah sakit kami menawarkan berbagai layanan medis. 
              Jika Anda memiliki kebutuhan perawatan kesehatan khusus atau pertanyaan, silakan hubungi tim medis kami untuk mendapatkan bantuan khusus.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-white p-6 rounded-md shadow-sm hover-lift">
                <h3 className="text-lg font-semibold mb-2">Layanan Darurat</h3>
                <p className="text-gray-600">
                  Perawatan darurat 24/7 untuk situasi medis yang mendesak. Hubungi 0851-7964-8841 untuk bantuan segera.
                </p>
              </div>
              <div className="bg-white p-6 rounded-md shadow-sm hover-lift">
                <h3 className="text-lg font-semibold mb-2">Penjadwalan Janji Temu</h3>
                <p className="text-gray-600">
                  Jadwalkan janji temu rutin melalui portal online kami atau dengan menghubungi resepsionis kami di 0878-1988-1010.
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
      
      <Footer />
    </div>
  );
}
