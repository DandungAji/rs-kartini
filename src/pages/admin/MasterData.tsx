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
import { Edit, Trash, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      toast({
        title: "Email Tidak Valid",
        description: "Harap masukkan alamat email yang valid.",
        variant: "destructive",
      });
      return;
    }

    if (!['admin', 'author'].includes(newUser.role)) {
      toast({
        title: "Role Tidak Valid",
        description: "Role harus berupa 'admin' atau 'author'.",
        variant: "destructive",
      });
      console.error("Invalid role:", newUser.role);
      return;
    }

    if (newUser.password.length < 8) {
      toast({
        title: "Kata Sandi Tidak Valid",
        description: "Kata sandi harus minimal 8 karakter.",
        variant: "destructive",
      });
      return;
    }

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

    await new Promise(resolve => setTimeout(resolve, 500));

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
      await supabase.rpc('delete_auth_user', { user_id: userId });
      return;
    }

    setProfiles([...profiles, profile]);
    toast({
      title: "Pengguna Ditambahkan",
      description: `Pengguna ${profile.full_name} telah ditambahkan sebagai ${profile.role}.`,
    });
    setNewUser({ username: "", full_name: "", email: "", phone: "", role: "author", password: "", confirmPassword: "" });
    setIsAddDialogOpen(false);
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editingUser.email)) {
      toast({
        title: "Email Tidak Valid",
        description: "Harap masukkan alamat email yang valid.",
        variant: "destructive",
      });
      return;
    }

    if (!['admin', 'author'].includes(editingUser.role)) {
      toast({
        title: "Role Tidak Valid",
        description: "Role harus berupa 'admin' atau 'author'.",
        variant: "destructive",
      });
      console.error("Invalid role:", editingUser.role);
      return;
    }

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

    const { error: authError } = await supabase
      .rpc('update_auth_user', {
        user_id: editingUser.id,
        user_email: editingUser.email,
        user_password: editingUser.password || '',
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
    const profileToDelete = profiles.find(p => p.id === id);

    console.log("Deleting user with ID:", id);

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

    const { error: authError } = await supabase
      .rpc('delete_auth_user', { user_id: id });

    if (authError) {
      toast({
        title: "Kesalahan",
        description: "Gagal menghapus pengguna dari autentikasi: " + authError.message,
        variant: "destructive",
      });
      console.error("Delete auth error:", authError);
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
          <p className="text-muted">
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
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Tambah Pengguna
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Tambah Pengguna</DialogTitle>
                          <DialogDescription>Isi detail pengguna baru.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">Username</Label>
                            <div className="col-span-3">
                              <Input
                                id="username"
                                placeholder="Username"
                                value={newUser.username || ""}
                                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="fullName" className="text-right">Nama Lengkap</Label>
                            <div className="col-span-3">
                              <Input
                                id="fullName"
                                placeholder="Nama Lengkap"
                                value={newUser.full_name || ""}
                                onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">Email</Label>
                            <div className="col-span-3">
                              <Input
                                id="email"
                                type="email"
                                placeholder="Email"
                                value={newUser.email || ""}
                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone" className="text-right">Nomor Telepon (opsional)</Label>
                            <div className="col-span-3">
                              <Input
                                id="phone"
                                placeholder="Nomor Telepon (opsional)"
                                value={newUser.phone || ""}
                                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password" className="text-right">Kata Sandi</Label>
                            <div className="col-span-3">
                              <Input
                                id="password"
                                type="password"
                                placeholder="Kata Sandi"
                                value={newUser.password || ""}
                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="confirmPassword" className="text-right">Konfirmasi Kata Sandi</Label>
                            <div className="col-span-3">
                              <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Konfirmasi Kata Sandi"
                                value={newUser.confirmPassword || ""}
                                onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="role" className="text-right">Role</Label>
                            <div className="col-span-3">
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
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Batal</Button>
                          <Button onClick={handleAddUser}>Tambah Pengguna</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

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
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setEditingUser({ ...profile, password: "", confirmPassword: "" })}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                      <DialogTitle>Edit Pengguna</DialogTitle>
                                      <DialogDescription>Perbarui detail pengguna di bawah ini.</DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="editUsername" className="text-right">Username</Label>
                                        <div className="col-span-3">
                                          <Input
                                            id="editUsername"
                                            placeholder="Username"
                                            value={editingUser?.username || ""}
                                            onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value } as Profile)}
                                          />
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="editFullName" className="text-right">Nama Lengkap</Label>
                                        <div className="col-span-3">
                                          <Input
                                            id="editFullName"
                                            placeholder="Nama Lengkap"
                                            value={editingUser?.full_name || ""}
                                            onChange={(e) => setEditingUser({ ...editingUser, full_name: e.target.value } as Profile)}
                                          />
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="editEmail" className="text-right">Email</Label>
                                        <div className="col-span-3">
                                          <Input
                                            id="editEmail"
                                            type="email"
                                            placeholder="Email"
                                            value={editingUser?.email || ""}
                                            onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value } as Profile)}
                                          />
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="editPhone" className="text-right">Nomor Telepon (opsional)</Label>
                                        <div className="col-span-3">
                                          <Input
                                            id="editPhone"
                                            placeholder="Nomor Telepon (opsional)"
                                            value={editingUser?.phone || ""}
                                            onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value } as Profile)}
                                          />
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="editPassword" className="text-right">Kata Sandi Baru (opsional)</Label>
                                        <div className="col-span-3">
                                          <Input
                                            id="editPassword"
                                            type="password"
                                            placeholder="Kata Sandi Baru (opsional)"
                                            value={editingUser?.password || ""}
                                            onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value } as Profile)}
                                          />
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="editConfirmPassword" className="text-right">Konfirmasi Kata Sandi (opsional)</Label>
                                        <div className="col-span-3">
                                          <Input
                                            id="editConfirmPassword"
                                            type="password"
                                            placeholder="Konfirmasi Kata Sandi (opsional)"
                                            value={editingUser?.confirmPassword || ""}
                                            onChange={(e) => setEditingUser({ ...editingUser, confirmPassword: e.target.value } as Profile)}
                                          />
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="editRole" className="text-right">Role</Label>
                                        <div className="col-span-3">
                                          <Select
                                            value={editingUser?.role || "author"}
                                            onValueChange={(value) => setEditingUser({ ...editingUser, role: value as "admin" | "author" } as Profile)}
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
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button variant="outline" onClick={() => setEditingUser(null)}>Batal</Button>
                                      <Button onClick={handleUpdateUser}>Simpan Perubahan</Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Apakah Anda yakin ingin menghapus pengguna {profile.full_name || "Tanpa Nama"}? Tindakan ini tidak dapat dibatalkan.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Batal</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDeleteUser(profile.id)}>Hapus</AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
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