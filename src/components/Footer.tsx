
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
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary mr-2">
                <path d="M8 19h8a4 4 0 0 0 0-8h-8a4 4 0 0 0 0 8Z"></path>
                <path d="M8 5v4"></path>
                <path d="M16 5v4"></path>
                <path d="M12 5v14"></path>
              </svg>
              <span className="font-bold text-xl text-white">MedHub</span>
            </div>
            <p className="mb-4">Providing quality healthcare services with care and compassion since 1990.</p>
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
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-primary" />
                <span>contact@medhub.com</span>
              </li>
              <li className="flex items-center">
                <MapPin size={18} className="mr-2 text-primary" />
                <span>123 Hospital Street, Medical District</span>
              </li>
              <li className="flex items-center">
                <Clock size={18} className="mr-2 text-primary" />
                <span>Mon-Fri: 8AM-6PM</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p>&copy; {currentYear} MedHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
