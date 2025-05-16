import { ReactNode, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Calendar, Database, File, List, LogOut, Menu, User, Users, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate("/admin/login");
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    try {
      console.log("Attempting logout");
      await signOut();
      console.log("Logout successful");
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navItems = [
    { 
      name: "Dashboard", 
      path: "/admin", 
      icon: <List className="mr-2 h-5 w-5 text-primary" /> 
    },
    { 
      name: "Dokter", 
      path: "/admin/doctors", 
      icon: <Users className="mr-2 h-5 w-5 text-primary" /> 
    },
    { 
      name: "Jadwal Dokter", 
      path: "/admin/schedules", 
      icon: <Calendar className="mr-2 h-5 w-5 text-primary" /> 
    },
    { 
      name: "Postingan", 
      path: "/admin/posts", 
      icon: <File className="mr-2 h-5 w-5 text-primary" /> 
    },
    { 
      name: "Master Data", 
      path: "/admin/master-data", 
      icon: <Database className="mr-2 h-5 w-5 text-primary" /> 
    },
    { 
      name: "Profil", 
      path: "/admin/profile", 
      icon: <User className="mr-2 h-5 w-5 text-primary" /> 
    },
  ];

  return (
    <div className="flex h-screen bg-secondary">
      {/* Mobile sidebar toggle */}
      <div className="block md:hidden absolute top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="border-primary text-primary hover:bg-primary/10"
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
        <div className="p-6 border-primary">
          <Link to="/" className="flex items-center">
            <img src="/images/logo.png" alt="RS Kartini" className="h-12 mr-2" />
          </Link>
        </div>
        
        <div className="px-4 py-6 border-b border-primary">
          <div className="text-sm font-medium text-muted">
            Masuk sebagai
          </div>
          <div className="font-medium text-foreground">
            {loading ? "Loading..." : (user?.user_metadata?.full_name || user?.email || "Unknown")}
          </div>
          <div className="text-sm text-muted">
            {loading ? "Loading..." : (user?.user_metadata?.role || "Unknown")}
          </div>
        </div>

        <nav className="mt-6 px-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-foreground rounded-md hover:bg-primary/10 transition-colors ${
                    location.pathname === item.path ? "bg-primary/20 font-medium" : ""
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
                className="w-full justify-start text-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="mr-2 h-5 w-5 text-destructive" />
                <span>Logout</span>
              </Button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm h-16 flex items-center justify-end px-6 border-b border-primary">
          <Link to="/" className="text-muted hover:text-primary text-sm">
            Lihat Website
          </Link>
        </header>
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-secondary p-6">
          {children}
        </main>
      </div>
    </div>
  );
}