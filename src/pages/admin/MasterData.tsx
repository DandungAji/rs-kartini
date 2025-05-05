import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Specializations } from "@/components/admin/master-data/Specializations";
import { PostCategories } from "@/components/admin/master-data/PostCategories";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Trash } from "lucide-react";

interface Profile {
  id: string;
  username?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  role: "admin" | "author";
  password?: string;
  confirmPassword?: string;
}

export default function MasterData() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("specializations");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [newUser, setNewUser] = useState<Partial<Profile> & { password?: string; confirmPassword?: string }>({
    username: "",
    full_name: "",
    email: "",
    phone: "",
    role: "author",
    password: "",
    confirmPassword: "",
  });
  const [editingUser, setEditingUser] = useState<Profile | null>(null);

  // Fetch profiles if user is admin
  useEffect(() => {
    if (!user || user.user_metadata?.role !== "admin") return;

    const fetchProfiles = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, full_name, email, phone, role')
        .order('full_name');
      if (error) {
        toast({
          title: "Kesalahan",
          description: "Gagal mengambil data pengguna: " + error.message,
          variant: "destructive",
        });
        console.error("Fetch profiles error:", error);
      } else {
        setProfiles(data);
      }
    };

    fetchProfiles();
  }, [user, toast]);

  const handleAddUser = async () => {
    if (!newUser.username || !newUser.full_name || !newUser.email || !newUser.role || !newUser.password || !newUser.confirmPassword) {
      toast({
        title: "Informasi Kurang",
        description: "Harap isi username, nama lengkap, email, role, kata sandi, dan konfirmasi kata sandi.",
        variant: "destructive",
      });
      return;
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      toast({
        title: "Email Tidak Valid",
        description: "Harap masukkan alamat email yang valid.",
        variant: "destructive",
      });
      return;
    }

    // Validasi role
    if (!['admin', 'author'].includes(newUser.role)) {
      toast({
        title: "Role Tidak Valid",
        description: "Role harus berupa 'admin' atau 'author'.",
        variant: "destructive",
      });
      console.error("Invalid role:", newUser.role);
      return;
    }

    // Validasi kata sandi
    if (newUser.password.length < 8) {
      toast({
        title: "Kata Sandi Tidak Valid",
        description: "Kata sandi harus minimal 8 karakter.",
        variant: "destructive",
      });
      return;
    }

    // Validasi konfirmasi kata sandi
    if (newUser.password !== newUser.confirmPassword) {
      toast({
        title: "Konfirmasi Kata Sandi Gagal",
        description: "Kata sandi dan konfirmasi kata sandi tidak cocok.",
        variant: "destructive",
      });
      return;
    }

    const userData = {
      user_email: newUser.email,
      user_password: newUser.password,
      user_metadata: {
        username: newUser.username,
        full_name: newUser.full_name,
        role: newUser.role,
      },
    };
    console.log("Calling create_auth_user with:", userData);

    // Buat user baru di auth.users via RPC
    const { data: userId, error: authError } = await supabase
      .rpc('create_auth_user', userData);

    if (authError || !userId) {
      toast({
        title: "Kesalahan",
        description: "Gagal mendaftarkan pengguna: " + (authError?.message || "Tidak ada data pengguna"),
        variant: "destructive",
      });
      console.error("Auth error:", authError);
      return;
    }

    console.log("Created auth user with ID:", userId);

    // Tunggu sebentar untuk memastikan trigger selesai
    await new Promise(resolve => setTimeout(resolve, 500));

    // Ambil data profile yang baru dibuat
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, username, full_name, email, phone, role')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      toast({
        title: "Kesalahan",
        description: "Gagal mengambil data profile: " + (profileError?.message || "Profile tidak ditemukan"),
        variant: "destructive",
      });
      console.error("Profile fetch error:", profileError);
      // Hapus user dari auth.users jika profile gagal
      await supabase.rpc('delete_auth_user', { user_id: userId });
      return;
    }

    setProfiles([...profiles, profile]);
    toast({
      title: "Pengguna Ditambahkan",
      description: `Pengguna ${profile.full_name} telah ditambahkan sebagai ${profile.role}.`,
    });
    setNewUser({ username: "", full_name: "", email: "", phone: "", role: "author", password: "", confirmPassword: "" });
  };

  const handleUpdateUser = async () => {
    if (!editingUser || !editingUser.username || !editingUser.full_name || !editingUser.email) {
      toast({
        title: "Informasi Kurang",
        description: "Harap isi username, nama lengkap, dan email.",
        variant: "destructive",
      });
      return;
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editingUser.email)) {
      toast({
        title: "Email Tidak Valid",
        description: "Harap masukkan alamat email yang valid.",
        variant: "destructive",
      });
      return;
    }

    // Validasi role
    if (!['admin', 'author'].includes(editingUser.role)) {
      toast({
        title: "Role Tidak Valid",
        description: "Role harus berupa 'admin' atau 'author'.",
        variant: "destructive",
      });
      console.error("Invalid role:", editingUser.role);
      return;
    }

    // Validasi kata sandi jika diisi
    if (editingUser.password || editingUser.confirmPassword) {
      if (!editingUser.password || !editingUser.confirmPassword) {
        toast({
          title: "Informasi Kurang",
          description: "Harap isi kata sandi dan konfirmasi kata sandi.",
          variant: "destructive",
        });
        return;
      }
      if (editingUser.password.length < 8) {
        toast({
          title: "Kata Sandi Tidak Valid",
          description: "Kata sandi harus minimal 8 karakter.",
          variant: "destructive",
        });
        return;
      }
      if (editingUser.password !== editingUser.confirmPassword) {
        toast({
          title: "Konfirmasi Kata Sandi Gagal",
          description: "Kata sandi dan konfirmasi kata sandi tidak cocok.",
          variant: "destructive",
        });
        return;
      }
    }

    console.log("Updating user:", editingUser);

    // Perbarui profiles
    const { data, error } = await supabase
      .from('profiles')
      .update({
        username: editingUser.username,
        full_name: editingUser.full_name,
        email: editingUser.email,
        phone: editingUser.phone || null,
        role: editingUser.role,
      })
      .eq('id', editingUser.id)
      .select()
      .single();

    if (error) {
      toast({
        title: "Kesalahan",
        description: "Gagal memperbarui pengguna: " + error.message,
        variant: "destructive",
      });
      console.error("Update error:", error);
      return;
    }

    // Perbarui auth.users via RPC
    const { error: authError } = await supabase
      .rpc('update_auth_user', {
        user_id: editingUser.id,
        user_email: editingUser.email,
        user_password: editingUser.password || '', // Kirim kata sandi jika diisi
        user_metadata: {
          username: editingUser.username,
          full_name: editingUser.full_name,
          role: editingUser.role,
        },
      });

    if (authError) {
      toast({
        title: "Kesalahan",
        description: "Gagal memperbarui data autentikasi pengguna: " + authError.message,
        variant: "destructive",
      });
      console.error("Auth update error:", authError);
      return;
    }

    setProfiles(profiles.map(p => (p.id === data.id ? data : p)));
    toast({
      title: "Pengguna Diperbarui",
      description: `Pengguna ${data.full_name} telah diperbarui.`,
    });
    setEditingUser(null);
  };

  const handleDeleteUser = async (id: string) => {
    // Simpan profile untuk rollback jika perlu
    const profileToDelete = profiles.find(p => p.id === id);

    console.log("Deleting user with ID:", id);

    // Hapus dari profiles
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);

    if (profileError) {
      toast({
        title: "Kesalahan",
        description: "Gagal menghapus pengguna: " + profileError.message,
        variant: "destructive",
      });
      console.error("Delete profile error:", profileError);
      return;
    }

    // Panggil fungsi RPC untuk menghapus dari auth.users
    const { error: authError } = await supabase
      .rpc('delete_auth_user', { user_id: id });

    if (authError) {
      toast({
        title: "Kesalahan",
        description: "Gagal menghapus pengguna dari autentikasi: " + authError.message,
        variant: "destructive",
      });
      console.error("Delete auth error:", authError);
      // Rollback: Kembalikan profile yang dihapus
      if (profileToDelete) {
        await supabase
          .from('profiles')
          .insert(profileToDelete);
      }
      return;
    }

    setProfiles(profiles.filter(p => p.id !== id));
    toast({
      title: "Pengguna Dihapus",
      description: "Pengguna telah dihapus.",
    });
  };

  if (!user) return <div className="p-4">Harap login untuk mengakses halaman ini.</div>;
  if (user.user_metadata?.role !== "admin") return <div className="p-4">Akses ditolak. Hanya admin yang dapat mengelola master data.</div>;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Master Data</h2>
          <p className="text-muted-foreground">
            Mengelola data dasar untuk praktik medis Anda
          </p>
        </div>

        <Tabs defaultValue="specializations" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full border-b sm:w-auto">
            <TabsTrigger value="specializations">Spesialisasi</TabsTrigger>
            <TabsTrigger value="post-categories">Kategori Postingan</TabsTrigger>
            <TabsTrigger value="users">Pengguna</TabsTrigger>
          </TabsList>
          <div className="mt-4">
            <TabsContent value="specializations" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Spesialisasi</CardTitle>
                  <CardDescription>Mengelola spesialisasi medis</CardDescription>
                </CardHeader>
                <CardContent>
                  <Specializations />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="post-categories" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Kategori Postingan</CardTitle>
                  <CardDescription>Mengelola kategori postingan blog</CardDescription>
                </CardHeader>
                <CardContent>
                  <PostCategories />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="users" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Pengguna</CardTitle>
                  <CardDescription>Mengelola pengguna sistem</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Tambah Pengguna Baru</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          placeholder="Username"
                          value={newUser.username || ""}
                          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                        />
                        <Input
                          placeholder="Nama Lengkap"
                          value={newUser.full_name || ""}
                          onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                        />
                        <Input
                          placeholder="Email"
                          type="email"
                          value={newUser.email || ""}
                          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        />
                        <Input
                          placeholder="Nomor Telepon (opsional)"
                          value={newUser.phone || ""}
                          onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                        />
                        <Input
                          placeholder="Kata Sandi"
                          type="password"
                          value={newUser.password || ""}
                          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        />
                        <Input
                          placeholder="Konfirmasi Kata Sandi"
                          type="password"
                          value={newUser.confirmPassword || ""}
                          onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                        />
                        <Select
                          value={newUser.role}
                          onValueChange={(value) => {
                            console.log("Selected role:", value);
                            setNewUser({ ...newUser, role: value as "admin" | "author" });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="author">Author</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={handleAddUser}>Tambah Pengguna</Button>
                    </div>

                    {editingUser && (
                      <div className="space-y-4 border-t pt-4">
                        <h3 className="text-lg font-semibold">Edit Pengguna</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            placeholder="Username"
                            value={editingUser.username || ""}
                            onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                          />
                          <Input
                            placeholder="Nama Lengkap"
                            value={editingUser.full_name || ""}
                            onChange={(e) => setEditingUser({ ...editingUser, full_name: e.target.value })}
                          />
                          <Input
                            placeholder="Email"
                            type="email"
                            value={editingUser.email || ""}
                            onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                          />
                          <Input
                            placeholder="Nomor Telepon (opsional)"
                            value={editingUser.phone || ""}
                            onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                          />
                          <Input
                            placeholder="Kata Sandi Baru (opsional)"
                            type="password"
                            value={editingUser.password || ""}
                            onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                          />
                          <Input
                            placeholder="Konfirmasi Kata Sandi Baru (opsional)"
                            type="password"
                            value={editingUser.confirmPassword || ""}
                            onChange={(e) => setEditingUser({ ...editingUser, confirmPassword: e.target.value })}
                          />
                          <Select
                            value={editingUser.role}
                            onValueChange={(value) => {
                              console.log("Selected edit role:", value);
                              setEditingUser({ ...editingUser, role: value as "admin" | "author" });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih Role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="author">Author</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleUpdateUser}>Simpan Perubahan</Button>
                          <Button variant="outline" onClick={() => setEditingUser(null)}>Batal</Button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Daftar Pengguna</h3>
                      {profiles.length === 0 ? (
                        <p className="text-gray-500">Belum ada pengguna.</p>
                      ) : (
                        <div className="space-y-2">
                          {profiles.map((profile) => (
                            <div key={profile.id} className="flex items-center justify-between p-2 border rounded">
                              <div>
                                <p className="font-medium">{profile.full_name || "Tanpa Nama"}</p>
                                <p className="text-sm text-gray-500">{profile.username || "Tanpa Username"} | {profile.email} | {profile.role}</p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setEditingUser({ ...profile, password: "", confirmPassword: "" })}
                                >
                                  <Edit size={16} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteUser(profile.id)}
                                  className="text-red-500"
                                >
                                  <Trash size={16} />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </AdminLayout>
  );
}