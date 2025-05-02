
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <img src="/images/logo.png" alt="" className="h-16 mr-2" />
              {/* <span className="font-bold text-xl text-white">RS Kartini</span> */}
            </div>
            <p className="mb-4">Kami ada untuk melayani anda.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/services" className="hover:text-primary transition-colors">Services</Link></li>
              <li><Link to="/doctor-schedule" className="hover:text-primary transition-colors">Doctor Schedule</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Services</h3>
            <ul className="space-y-2">
              <li>Emergency Care</li>
              <li>General Medicine</li>
              <li>Pediatrics</li>
              <li>Cardiology</li>
              <li>Orthopedics</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Phone size={18} className="mr-2 text-primary" />
                <span>+62 878 1988 1010</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-primary" />
                <span>marketing@rskartini.id</span>
              </li>
              <li className="flex">
                <MapPin size={18} className="mr-2 text-primary" />
                <span>Jl. Pahlawan No.48, Kota Bandung, Jawa Barat</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p>&copy; {currentYear} IT RS Kartini. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
