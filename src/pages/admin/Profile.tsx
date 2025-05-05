import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export default function Profile() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    full_name: "",
    phone: "",
  });
  
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch profile data on mount
  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, full_name, email, phone')
        .eq('id', user.id)
        .single();

      if (error) {
        toast({
          title: "Kesalahan",
          description: "Gagal mengambil data profil: " + error.message,
          variant: "destructive",
        });
        console.error("Fetch profile error:", error);
        // Gunakan user_metadata sebagai fallback
        setProfileData({
          username: user.user_metadata?.username || user.email || "",
          email: user.email || "",
          full_name: user.user_metadata?.full_name || user.email || "",
          phone: user.user_metadata?.phone || "",
        });
      } else {
        setProfileData({
          username: data.username || user.user_metadata?.username || user.email || "",
          email: data.email || user.email || "",
          full_name: data.full_name || user.user_metadata?.full_name || user.email || "",
          phone: data.phone || "",
        });
      }
    };

    fetchProfile();
  }, [user, toast]);

  const handleProfileUpdate = async () => {
    if (!profileData.username || !profileData.full_name || !profileData.email) {
      toast({
        title: "Informasi Kurang",
        description: "Harap isi username, nama lengkap, dan email.",
        variant: "destructive",
      });
      return;
    }

    // Perbarui profiles
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        username: profileData.username,
        full_name: profileData.full_name,
        email: profileData.email,
        phone: profileData.phone || null,
      })
      .eq('id', user?.id);

    if (profileError) {
      toast({
        title: "Kesalahan",
        description: "Gagal memperbarui profil: " + profileError.message,
        variant: "destructive",
      });
      console.error("Update profile error:", profileError);
      return;
    }

    // Perbarui auth.users
    const { error: authError } = await supabase.auth.updateUser({
      email: profileData.email,
      data: { username: profileData.username, full_name: profileData.full_name, phone: profileData.phone },
    });

    if (authError) {
      toast({
        title: "Kesalahan",
        description: "Gagal memperbarui data autentikasi: " + authError.message,
        variant: "destructive",
      });
      console.error("Update auth error:", authError);
      return;
    }

    toast({
      title: "Profil Diperbarui",
      description: "Informasi profil Anda telah diperbarui.",
    });
  };
  
  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Kata Sandi Tidak Cocok",
        description: "Kata sandi baru dan konfirmasi tidak cocok.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Kata Sandi Lemah",
        description: "Kata sandi baru harus minimal 6 karakter.",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: passwordData.newPassword,
    });

    if (error) {
      toast({
        title: "Kesalahan",
        description: "Gagal mengubah kata sandi: " + error.message,
        variant: "destructive",
      });
      console.error("Change password error:", error);
      return;
    }

    toast({
      title: "Kata Sandi Diubah",
      description: "Kata sandi Anda telah diperbarui.",
    });

    // Reset form
    setPasswordData({
      newPassword: "",
      confirmPassword: "",
    });
  };

  if (loading) return <div className="p-4">Memuat...</div>;
  if (!user) return <div className="p-4">Harap login untuk mengakses halaman ini.</div>;

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Profil Anda</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informasi Profil</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <Input
                  id="username"
                  value={profileData.username}
                  onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Alamat Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                />
              </div>
              
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Lengkap
                </label>
                <Input
                  id="fullName"
                  value={profileData.full_name}
                  onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor Telepon
                </label>
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                />
              </div>
              
              <Button onClick={handleProfileUpdate}>
                Perbarui Profil
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ubah Kata Sandi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Kata Sandi Baru
                </label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Konfirmasi Kata Sandi Baru
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                />
              </div>
              
              <Button onClick={handlePasswordChange}>
                Ubah Kata Sandi
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}