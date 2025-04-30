
import { ReactNode, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Calendar, Database, File, List, LogOut, Menu, User, Users, X } from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const navItems = [
    { 
      name: "Dashboard", 
      path: "/admin", 
      icon: <List className="mr-2 h-5 w-5" /> 
    },
    { 
      name: "Doctors", 
      path: "/admin/doctors", 
      icon: <Users className="mr-2 h-5 w-5" /> 
    },
    { 
      name: "Doctor Schedules", 
      path: "/admin/schedules", 
      icon: <Calendar className="mr-2 h-5 w-5" /> 
    },
    { 
      name: "Posts", 
      path: "/admin/posts", 
      icon: <File className="mr-2 h-5 w-5" /> 
    },
    { 
      name: "Master Data", 
      path: "/admin/master-data", 
      icon: <Database className="mr-2 h-5 w-5" /> 
    },
    { 
      name: "Profile", 
      path: "/admin/profile", 
      icon: <User className="mr-2 h-5 w-5" /> 
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <div className="block md:hidden absolute top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside 
        className={`bg-white shadow-md w-64 fixed md:static inset-y-0 left-0 z-40 transition-transform duration-300 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="p-6">
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
        
        <div className="px-4 pb-6 border-b">
          <div className="text-sm font-medium text-gray-500">
            Logged in as
          </div>
          <div className="font-medium">
            {user?.username}
          </div>
          <div className="text-sm text-gray-500">
            {user?.role}
          </div>
        </div>

        <nav className="mt-6 px-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-gray-700 rounded-md hover:bg-gray-100 transition-colors ${
                    location.pathname === item.path ? "bg-blue-50 text-primary font-medium" : ""
                  }`}
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      setIsSidebarOpen(false);
                    }
                  }}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
            
            <li className="pt-4">
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start text-gray-700 hover:text-red-600 hover:bg-red-50"
              >
                <LogOut className="mr-2 h-5 w-5" />
                <span>Logout</span>
              </Button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm h-16 flex items-center justify-end px-6">
          <Link to="/" className="text-gray-600 hover:text-primary text-sm">
            View Website
          </Link>
        </header>
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
