import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(formData.email, formData.password);
      
      if (success) {
        navigate("/admin");
      } else {
        toast({
          title: "Autentikasi Gagal",
          description: "Email atau kata sandi salah.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Kesalahan Autentikasi",
        description: "Terjadi kesalahan saat login. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <div className="flex justify-center">
            <img src="/images/logo.png" alt="RS Kartini" className="h-16 mr-2" />
          </div>
          <h2 className="mt-4 text-2xl font-bold">Admin RS Kartini</h2>
          <p className="mt-2 text-gray-600">Masuk ke akun Anda</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1"
                placeholder="Email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Kata Sandi
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1"
                placeholder="Kata Sandi"
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Masuk..." : "Masuk"}
            </Button>
          </div>
        </form>
        
        <div className="text-center mt-4">
          <a
            href="/"
            className="text-sm text-primary hover:underline"
          >
            Kembali ke Website
          </a>
        </div>
      </div>
    </div>
  );
}