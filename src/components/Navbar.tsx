
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import WhatsAppButton from './WhatsAppButton';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Doctor Schedule', path: '/doctor-schedule' },
  { name: 'Services', path: '/services' },
  { name: 'Contact', path: '/contact' },
  { name: 'About', path: '/about' },
  { name: 'Info', path: '/info' },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <>
      <nav className="sticky top-0 bg-white shadow-sm z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary mr-2">
                  <path d="M8 19h8a4 4 0 0 0 0-8h-8a4 4 0 0 0 0 8Z"></path>
                  <path d="M8 5v4"></path>
                  <path d="M16 5v4"></path>
                  <path d="M12 5v14"></path>
                </svg>
                <span className="font-bold text-xl text-primary">MedHub</span>
              </Link>
            </div>
            <div className="hidden md:flex space-x-4">
              {navItems.map((item) => (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    pathname === item.path 
                      ? "text-primary font-semibold" 
                      : "text-gray-700 hover:text-primary"
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <Link to="/admin">
                <Button variant="outline" size="sm">Admin</Button>
              </Link>
            </div>
            <div className="md:hidden">
              <button
                type="button"
                className="text-gray-700 hover:text-primary focus:outline-none"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-white shadow-lg animate-fade-in">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium",
                    pathname === item.path 
                      ? "text-primary font-semibold" 
                      : "text-gray-700 hover:text-primary"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link 
                to="/admin" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin
              </Link>
            </div>
          </div>
        )}
      </nav>
      
      {/* WhatsApp floating button - only show on public pages */}
      {!pathname.startsWith('/admin') && (
        <WhatsAppButton phoneNumber="+11234567890" />
      )}
    </>
  );
}
