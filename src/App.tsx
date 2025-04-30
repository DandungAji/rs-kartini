
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
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

// Create router with all routes
const router = createBrowserRouter([
  // Public Routes
  {
    path: "/",
    element: <Index />
  },
  {
    path: "/doctor-schedule",
    element: <DoctorSchedule />
  },
  {
    path: "/services",
    element: <Services />
  },
  {
    path: "/contact",
    element: <Contact />
  },
  {
    path: "/about",
    element: <About />
  },
  {
    path: "/info",
    element: <Info />
  },
  
  // Admin Routes
  {
    path: "/admin/login",
    element: <Login />
  },
  {
    path: "/admin",
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>
  },
  {
    path: "/admin/schedules",
    element: <ProtectedRoute><Schedules /></ProtectedRoute>
  },
  {
    path: "/admin/posts",
    element: <ProtectedRoute><Posts /></ProtectedRoute>
  },
  {
    path: "/admin/profile",
    element: <ProtectedRoute><Profile /></ProtectedRoute>
  },
  {
    path: "/admin/*",
    element: <AdminNotFound />
  },
  
  // 404 Route
  {
    path: "*",
    element: <NotFound />
  }
]);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <RouterProvider router={router} />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
