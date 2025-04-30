
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
      <section className="hero py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-8 text-center md:text-left mb-10 md:mb-0">
              <h1 className="text-3xl md:text-5xl font-bold mb-6">
                Excellence in Healthcare, Compassion in Service
              </h1>
              <p className="text-lg md:text-xl mb-8 opacity-90">
                MedHub Hospital provides comprehensive medical services with cutting-edge technology and a patient-centered approach.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button asChild size="lg" className="font-semibold">
                  <Link to="/doctor-schedule">Find a Doctor</Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link to="/services">Our Services</Link>
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
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-secondary border-none">
              <CardContent className="p-6 flex items-center">
                <Phone className="h-10 w-10 text-primary mr-4" />
                <div>
                  <h3 className="font-semibold text-lg">Emergency</h3>
                  <p className="text-gray-600">(555) 123-4567</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-secondary border-none">
              <CardContent className="p-6 flex items-center">
                <Clock className="h-10 w-10 text-primary mr-4" />
                <div>
                  <h3 className="font-semibold text-lg">Working Hours</h3>
                  <p className="text-gray-600">Mon-Fri: 8AM-6PM</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-secondary border-none">
              <CardContent className="p-6 flex items-center">
                <Calendar className="h-10 w-10 text-primary mr-4" />
                <div>
                  <h3 className="font-semibold text-lg">Appointments</h3>
                  <p className="text-gray-600">Book Online or Call</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-secondary border-none">
              <CardContent className="p-6 flex items-center">
                <MapPin className="h-10 w-10 text-primary mr-4" />
                <div>
                  <h3 className="font-semibold text-lg">Location</h3>
                  <p className="text-gray-600">123 Hospital St.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="section">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Our Services</h2>
          <p className="section-subtitle">
            Providing comprehensive healthcare services with cutting-edge technology and compassionate care.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredServices.map((service) => {
              // Use dynamic icon import from the Lucide icons
              const IconComponent = (LucideIcons[service.icon as keyof typeof LucideIcons] || LucideIcons.Activity) as React.ElementType;
              
              return (
                <Card key={service.id} className="border-none shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-secondary rounded-full">
                        <IconComponent className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <Button asChild variant="link" className="text-primary">
                      <Link to={`/services#${service.id}`}>Learn More</Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link to="/services">View All Services</Link>
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
              <h2 className="text-3xl font-bold mb-6">Why Choose MedHub Hospital?</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Expert Medical Team</h3>
                  <p className="text-gray-700">Our doctors and medical staff are leaders in their fields, dedicated to providing exceptional care.</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">Advanced Technology</h3>
                  <p className="text-gray-700">We invest in the latest medical equipment and technologies to enhance diagnosis accuracy and treatment effectiveness.</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">Patient-Centered Care</h3>
                  <p className="text-gray-700">Your comfort, dignity, and individual needs are at the center of our healthcare approach.</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">Comprehensive Services</h3>
                  <p className="text-gray-700">From preventive care to complex treatments, we offer a full range of medical services under one roof.</p>
                </div>
              </div>
              
              <Button asChild className="mt-8">
                <Link to="/about">Learn About Our Hospital</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Need Medical Assistance?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Our team of medical professionals is ready to provide the care you need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-primary font-semibold">
              <Link to="/doctor-schedule">Schedule an Appointment</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
