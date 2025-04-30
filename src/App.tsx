
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navigate, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Main pages
import Index from "./pages/Index";
import DoctorSchedule from "./pages/DoctorSchedule";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Info from "./pages/Info";
import NotFound from "./pages/NotFound";

// Admin pages
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import Doctors from "./pages/admin/Doctors";
import Schedules from "./pages/admin/Schedules";
import Posts from "./pages/admin/Posts";
import Profile from "./pages/admin/Profile";
import AdminNotFound from "./pages/admin/NotFound";

const queryClient = new QueryClient();

// Route guard for admin routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/doctor-schedule" element={<DoctorSchedule />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/info" element={<Info />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/doctors" element={<ProtectedRoute><Doctors /></ProtectedRoute>} />
          <Route path="/admin/schedules" element={<ProtectedRoute><Schedules /></ProtectedRoute>} />
          <Route path="/admin/posts" element={<ProtectedRoute><Posts /></ProtectedRoute>} />
          <Route path="/admin/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/admin/*" element={<AdminNotFound />} />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
