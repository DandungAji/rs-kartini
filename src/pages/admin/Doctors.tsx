import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { 
  Edit, 
  Plus, 
  Search, 
  Trash, 
  User 
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
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

interface Doctor {
  id: string;
  name: string;
  specialization_id?: string;
  specialization?: { name: string };
  contact?: string;
  bio?: string;
  photo_url?: string;
}

interface Specialization {
  id: string;
  name: string;
}

export default function Doctors() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [newDoctor, setNewDoctor] = useState<Partial<Doctor>>({
    name: "",
    specialization_id: "",
    contact: "",
    bio: "",
    photo_url: ""
  });
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [deleteDoctorId, setDeleteDoctorId] = useState<string | null>(null); // State untuk dialog hapus

  useEffect(() => {
    if (!user) return;

    const fetchDoctors = async () => {
      const { data, error } = await supabase
        .from('doctors')
        .select(`
          id, 
          name, 
          specialization_id, 
          specialization:specializations!specialization_id(name), 
          contact, 
          bio, 
          photo_url
        `);
      if (error) {
        toast({
          title: "Kesalahan",
          description: "Gagal mengambil data dokter: " + error.message,
          variant: "destructive",
        });
        console.error("Fetch doctors error:", error);
      } else {
        setDoctors(data.map(doc => ({
          ...doc,
          specialization: doc.specialization || { name: '-' }
        })));
        console.log("Doctors fetched:", data);
      }
    };

    const fetchSpecializations = async () => {
      const { data, error } = await supabase
        .from('specializations')
        .select('id, name')
        .order('name');
      if (error) {
        toast({
          title: "Kesalahan",
          description: "Gagal mengambil data spesialisasi: " + error.message,
          variant: "destructive",
        });
        console.error("Fetch specializations error:", error);
      } else {
        setSpecializations(data);
        if (data.length > 0) {
          setNewDoctor(prev => ({ ...prev, specialization_id: data[0].id }));
        }
        console.log("Specializations fetched:", data);
      }
    };

    fetchDoctors();
    fetchSpecializations();
  }, [user]);

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === "all" || doctor.specialization_id === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const handleAddDoctor = async () => {
    if (!newDoctor.name || !newDoctor.specialization_id) {
      toast({
        title: "Informasi Kurang",
        description: "Harap masukkan nama dan spesialisasi.",
        variant: "destructive",
      });
      return;
    }

    if (newDoctor.contact && !/^\+?\d{10,15}$/.test(newDoctor.contact.replace(/\s/g, ''))) {
      toast({
        title: "Nomor Kontak Tidak Valid",
        description: "Harap masukkan nomor kontak yang valid (10-15 digit).",
        variant: "destructive",
      });
      return;
    }

    let photoUrl = newDoctor.photo_url;
    if (photoFile) {
      const fileExt = photoFile.name.split('.').pop();
      const fileName = `doctor-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('doctor-photos')
        .upload(fileName, photoFile);
      if (uploadError) {
        toast({
          title: "Kesalahan",
          description: "Gagal mengunggah foto dokter: " + uploadError.message,
          variant: "destructive",
        });
        console.error("Upload error:", uploadError);
        return;
      }
      const { data: publicUrlData } = supabase.storage
        .from('doctor-photos')
        .getPublicUrl(fileName);
      photoUrl = publicUrlData.publicUrl;
    }

    const { data, error } = await supabase
      .from('doctors')
      .insert([{
        name: newDoctor.name,
        specialization_id: newDoctor.specialization_id,
        contact: newDoctor.contact || null,
        bio: newDoctor.bio || null,
        photo_url: photoUrl || null
      }])
      .select(`
        id, 
        name, 
        specialization_id, 
        specialization:specializations!specialization_id(name), 
        contact, 
        bio, 
        photo_url
      `)
      .single();

    if (error) {
      toast({
        title: "Kesalahan",
        description: "Gagal menambah dokter: " + error.message,
        variant: "destructive",
      });
      console.error("Insert error:", error);
    } else {
      setDoctors([...doctors, { ...data, specialization: data.specialization || { name: '-' } }]);
      toast({
        title: "Dokter Ditambahkan",
        description: "Dokter berhasil ditambahkan.",
      });
      setNewDoctor({
        name: "",
        specialization_id: specializations[0]?.id || "",
        contact: "",
        bio: "",
        photo_url: ""
      });
      setPhotoFile(null);
    }
  };

  const handleUpdateDoctor = async () => {
    if (!editingDoctor) return;

    if (editingDoctor.contact && !/^\+?\d{10,15}$/.test(editingDoctor.contact.replace(/\s/g, ''))) {
      toast({
        title: "Nomor Kontak Tidak Valid",
        description: "Harap masukkan nomor kontak yang valid (10-15 digit).",
        variant: "destructive",
      });
      return;
    }

    let photoUrl = editingDoctor.photo_url;
    if (photoFile) {
      const fileExt = photoFile.name.split('.').pop();
      const fileName = `doctor-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('doctor-photos')
        .upload(fileName, photoFile, { upsert: true });
      if (uploadError) {
        toast({
          title: "Kesalahan",
          description: "Gagal mengunggah foto dokter: " + uploadError.message,
          variant: "destructive",
        });
        console.error("Upload error:", uploadError);
        return;
      }
      const { data: publicUrlData } = supabase.storage
        .from('doctor-photos')
        .getPublicUrl(fileName);
      photoUrl = publicUrlData.publicUrl;
    }

    const { data, error } = await supabase
      .from('doctors')
      .update({
        name: editingDoctor.name,
        specialization_id: editingDoctor.specialization_id,
        contact: editingDoctor.contact || null,
        bio: editingDoctor.bio || null,
        photo_url: photoUrl || null
      })
      .eq('id', editingDoctor.id)
      .select(`
        id, 
        name, 
        specialization_id, 
        specialization:specializations!specialization_id(name), 
        contact, 
        bio, 
        photo_url
      `)
      .single();

    if (error) {
      toast({
        title: "Kesalahan",
        description: "Gagal memperbarui dokter: " + error.message,
        variant: "destructive",
      });
      console.error("Update error:", error);
    } else {
      setDoctors(doctors.map(doc => doc.id === data.id ? { ...data, specialization: data.specialization || { name: '-' } } : doc));
      toast({
        title: "Dokter Diperbarui",
        description: "Dokter berhasil diperbarui.",
      });
      setEditingDoctor(null);
      setPhotoFile(null);
    }
  };

  const confirmDeleteDoctor = async () => {
    if (!deleteDoctorId) return;

    const { error } = await supabase
      .from('doctors')
      .delete()
      .eq('id', deleteDoctorId);

    if (error) {
      toast({
        title: "Kesalahan",
        description: "Gagal menghapus dokter: " + error.message,
        variant: "destructive",
      });
      console.error("Delete error:", error);
    } else {
      setDoctors(doctors.filter(doctor => doctor.id !== deleteDoctorId));
      toast({
        title: "Dokter Dihapus",
        description: "Dokter berhasil dihapus.",
      });
    }
    setDeleteDoctorId(null); // Reset state setelah penghapusan
  };

  if (loading) return <div className="p-4">Memuat...</div>;
  if (!user) return <div className="p-4">Harap login untuk mengakses halaman ini.</div>;

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Manajemen Dokter</h1>
        <div className="flex gap-2">
          <Select
            value={selectedDepartment}
            onValueChange={setSelectedDepartment}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Spesialisasi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Spesialisasi</SelectItem>
              {specializations.map((spec) => (
                <SelectItem key={spec.id} value={spec.id}>
                  {spec.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Cari dokter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-full md:w-[200px]"
            />
          </div>
        </div>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Tambah Dokter Baru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nama
              </label>
              <Input
                id="name"
                placeholder="Nama dokter"
                value={newDoctor.name}
                onChange={(e) => setNewDoctor({...newDoctor, name: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">
                Spesialisasi
              </label>
              <Select
                value={newDoctor.specialization_id}
                onValueChange={(value) => setNewDoctor({...newDoctor, specialization_id: value})}
                disabled={specializations.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder={specializations.length === 0 ? "Tidak ada spesialisasi" : "Pilih Spesialisasi"} />
                </SelectTrigger>
                <SelectContent>
                  {specializations.map((spec) => (
                    <SelectItem key={spec.id} value={spec.id}>
                      {spec.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
                Nomor Kontak
              </label>
              <Input
                id="contact"
                placeholder="+62 888 8888 888"
                value={newDoctor.contact}
                onChange={(e) => setNewDoctor({...newDoctor, contact: e.target.value})}
              />
            </div>
            
            <div>
              <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">
                Foto
              </label>
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <Textarea
                id="bio"
                placeholder="Deskripsi singkat dokter"
                value={newDoctor.bio}
                onChange={(e) => setNewDoctor({...newDoctor, bio: e.target.value})}
                className="min-h-[100px]"
              />
            </div>
          </div>
          
          <Button onClick={handleAddDoctor} className="mt-4" disabled={specializations.length === 0}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Dokter
          </Button>
        </CardContent>
      </Card>
      
      <h2 className="text-lg font-medium mb-4">Daftar Dokter</h2>
      
      {filteredDoctors.length > 0 ? (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Spesialisasi</TableHead>
                <TableHead>Kontak</TableHead>
                <TableHead className="w-[100px] text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDoctors.map((doctor) => (
                <TableRow key={doctor.id}>
                  <TableCell className="font-medium">{doctor.name}</TableCell>
                  <TableCell>{doctor.specialization?.name || '-'}</TableCell>
                  <TableCell>
                    {doctor.contact && <div className="text-sm text-gray-500">{doctor.contact}</div>}
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setEditingDoctor(doctor)}
                        >
                          <Edit size={16} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Dokter</DialogTitle>
                        </DialogHeader>
                        {editingDoctor && (
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <label htmlFor="edit-name" className="text-right text-sm">
                                Nama
                              </label>
                              <Input
                                id="edit-name"
                                className="col-span-3"
                                value={editingDoctor.name}
                                onChange={(e) => setEditingDoctor({
                                  ...editingDoctor,
                                  name: e.target.value
                                })}
                                required
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <label htmlFor="edit-spec" className="text-right text-sm">
                                Spesialisasi
                              </label>
                              <Select
                                value={editingDoctor.specialization_id}
                                onValueChange={(value) => setEditingDoctor({
                                  ...editingDoctor,
                                  specialization_id: value
                                })}
                                disabled={specializations.length === 0}
                              >
                                <SelectTrigger className="col-span-3">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {specializations.map((spec) => (
                                    <SelectItem key={spec.id} value={spec.id}>
                                      {spec.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <label htmlFor="edit-contact" className="text-right text-sm">
                                Nomor Kontak
                              </label>
                              <Input
                                id="edit-contact"
                                className="col-span-3"
                                value={editingDoctor.contact || ""}
                                onChange={(e) => setEditingDoctor({
                                  ...editingDoctor,
                                  contact: e.target.value
                                })}
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <label htmlFor="edit-photo" className="text-right text-sm">
                                Foto
                              </label>
                              <Input
                                id="edit-photo"
                                type="file"
                                accept="image/*"
                                className="col-span-3"
                                onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                              />
                              {editingDoctor.photo_url && (
                                <img src={editingDoctor.photo_url} alt="Preview" className="col-span-3 mt-2 h-24 w-auto" />
                              )}
                            </div>
                            <div className="grid grid-cols-4 items-start gap-4">
                              <label htmlFor="edit-bio" className="text-right text-sm pt-2">
                                Bio
                              </label>
                              <Textarea
                                id="edit-bio"
                                className="col-span-3"
                                value={editingDoctor.bio || ""}
                                onChange={(e) => setEditingDoctor({
                                  ...editingDoctor,
                                  bio: e.target.value
                                })}
                              />
                            </div>
                          </div>
                        )}
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Batal</Button>
                          </DialogClose>
                          <Button onClick={handleUpdateDoctor}>Simpan Perubahan</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setDeleteDoctorId(doctor.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash size={16} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
                          <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus dokter {doctor.name}? Tindakan ini tidak dapat dibatalkan.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setDeleteDoctorId(null)}>Batal</AlertDialogCancel>
                          <AlertDialogAction onClick={confirmDeleteDoctor}>Hapus</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="bg-gray-50 border rounded-lg p-8 text-center">
          <User className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">Dokter Tidak Ditemukan</h3>
          <p className="text-gray-500 mb-4">
            Tidak ada dokter yang sesuai dengan kriteria pencarian Anda.
          </p>
        </div>
      )}
    </AdminLayout>
  );
}