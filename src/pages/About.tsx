
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function About() {
  return (
    <>
      <Navbar />
      
      <PageHeader 
        title="About MedHub Hospital" 
        subtitle="Excellence in healthcare since 1990"
      />
      
      <div className="container mx-auto px-4 py-12">
        {/* History & Overview */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our History</h2>
              <p className="text-gray-700 mb-4">
                Founded in 1990, MedHub Hospital began as a small community clinic with a team of dedicated medical professionals committed to providing quality healthcare to the local community.
              </p>
              <p className="text-gray-700 mb-4">
                Over the years, we've expanded our facilities and services, growing into a comprehensive medical center while maintaining our commitment to patient-centered care and clinical excellence.
              </p>
              <p className="text-gray-700">
                Today, MedHub Hospital stands as a leading healthcare provider, equipped with state-of-the-art technology and staffed by top medical specialists across various disciplines.
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
          <h2 className="text-3xl font-bold mb-8 text-center">Our Journey</h2>
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="md:w-1/3 p-6 bg-secondary rounded-lg">
                <h3 className="text-xl font-bold mb-2">1990 - Foundation</h3>
                <p className="text-gray-700">
                  MedHub opened as a small community clinic with basic primary care services.
                </p>
              </div>
              <div className="md:w-1/3 p-6 bg-secondary rounded-lg">
                <h3 className="text-xl font-bold mb-2">1998 - Expansion</h3>
                <p className="text-gray-700">
                  Added specialized departments including cardiology and pediatrics.
                </p>
              </div>
              <div className="md:w-1/3 p-6 bg-secondary rounded-lg">
                <h3 className="text-xl font-bold mb-2">2005 - New Campus</h3>
                <p className="text-gray-700">
                  Moved to our current state-of-the-art facility with expanded capacity.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="md:w-1/3 p-6 bg-secondary rounded-lg">
                <h3 className="text-xl font-bold mb-2">2010 - Research Center</h3>
                <p className="text-gray-700">
                  Established our medical research center focusing on innovative treatments.
                </p>
              </div>
              <div className="md:w-1/3 p-6 bg-secondary rounded-lg">
                <h3 className="text-xl font-bold mb-2">2015 - Technology Upgrade</h3>
                <p className="text-gray-700">
                  Implemented advanced diagnostic equipment and electronic health records.
                </p>
              </div>
              <div className="md:w-1/3 p-6 bg-secondary rounded-lg">
                <h3 className="text-xl font-bold mb-2">2020 - Present</h3>
                <p className="text-gray-700">
                  Continuing to expand services while maintaining our commitment to excellence.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Mission, Vision, Values */}
        <section className="mb-16">
          <Tabs defaultValue="mission" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="mission">Mission</TabsTrigger>
              <TabsTrigger value="vision">Vision</TabsTrigger>
              <TabsTrigger value="values">Core Values</TabsTrigger>
            </TabsList>
            <TabsContent value="mission" className="p-6 bg-secondary rounded-lg mt-4">
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-gray-700 mb-4">
                At MedHub Hospital, our mission is to provide accessible, high-quality healthcare services to our community. We strive to deliver compassionate care that addresses not just the physical, but also the emotional and social well-being of each patient.
              </p>
              <p className="text-gray-700">
                We are committed to continuously improving our services through education, research, and the implementation of evidence-based practices, ensuring that we meet the evolving healthcare needs of the diverse population we serve.
              </p>
            </TabsContent>
            <TabsContent value="vision" className="p-6 bg-secondary rounded-lg mt-4">
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-gray-700 mb-4">
                We envision MedHub Hospital as a leader in healthcare innovation and excellence, recognized for our exceptional patient outcomes, cutting-edge medical technology, and dedicated healthcare professionals.
              </p>
              <p className="text-gray-700">
                We aim to be the healthcare provider of choice, known for fostering a healing environment where patients feel valued, respected, and empowered in their healthcare journey. Through strategic partnerships and community engagement, we aspire to contribute significantly to improving the overall health and wellness of our community.
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
