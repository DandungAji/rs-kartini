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

interface Doctor {
  id: string;
  name: string;
  specialization_id?: string;
  specialization?: { name: string };
  email?: string;
  phone?: string;
  bio?: string;
  photo_url?: string;
}

interface Specialization {
  id: string;
  name: string;
}

export default function Doctors() {
  const { toast } = useToast();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  
  const [newDoctor, setNewDoctor] = useState<Partial<Doctor>>({
    name: "",
    specialization_id: "",
    email: "",
    phone: "",
    bio: "",
    photo_url: ""
  });
  
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  // Fetch doctors and specializations on mount
  useEffect(() => {
    const fetchDoctors = async () => {
      const { data, error } = await supabase
        .from('doctors')
        .select('id, name, specialization_id, specializations(name), email, phone, bio, photo_url');
      if (error) {
        toast({
          title: "Error",
          description: "Gagal mengambil data dokter.",
          variant: "destructive",
        });
      } else {
        setDoctors(data);
      }
    };

    const fetchSpecializations = async () => {
      const { data, error } = await supabase
        .from('specializations')
        .select('id, name')
        .order('name');
      if (error) {
        toast({
          title: "Error",
          description: "Gagal mengambil data spesialisasi.",
          variant: "destructive",
        });
      } else {
        setSpecializations(data);
      }
    };

    fetchDoctors();
    fetchSpecializations();
  }, []);

  // Filter doctors based on search query and department
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === "all" || doctor.specialization_id === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const handleAddDoctor = async () => {
    if (!newDoctor.name || !newDoctor.specialization_id) {
      toast({
        title: "Missing Information",
        description: "Please provide at least a name and specialization.",
        variant: "destructive",
      });
      return;
    }

    let photoUrl = '';
    if (photoFile) {
      const fileName = `doctor-${Date.now()}.${photoFile.name.split('.').pop()}`;
      const { error: uploadError } = await supabase.storage
        .from('doctor-photos')
        .upload(fileName, photoFile);
      if (uploadError) {
        toast({
          title: "Error",
          description: "Gagal mengupload foto dokter.",
          variant: "destructive",
        });
        return;
      }
      photoUrl = `${supabaseUrl}/storage/v1/object/public/doctor-photos/${fileName}`;
    }

    const { data, error } = await supabase
      .from('doctors')
      .insert([{
        name: newDoctor.name,
        specialization_id: newDoctor.specialization_id,
        email: newDoctor.email,
        phone: newDoctor.phone,
        bio: newDoctor.bio,
        photo_url: photoUrl
      }])
      .select('id, name, specialization_id, specializations(name), email, phone, bio, photo_url')
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Gagal menambah dokter.",
        variant: "destructive",
      });
    } else {
      setDoctors([...doctors, data]);
      toast({
        title: "Doctor Added",
        description: "Dokter berhasil ditambahkan.",
      });
      setNewDoctor({
        name: "",
        specialization_id: "",
        email: "",
        phone: "",
        bio: "",
        photo_url: ""
      });
      setPhotoFile(null);
    }
  };

  const handleUpdateDoctor = async () => {
    if (!editingDoctor) return;

    let photoUrl = editingDoctor.photo_url;
    if (photoFile) {
      const fileName = `doctor-${Date.now()}.${photoFile.name.split('.').pop()}`;
      const { error: uploadError } = await supabase.storage
        .from('doctor-photos')
        .upload(fileName, photoFile, { upsert: true });
      if (uploadError) {
        toast({
          title: "Error",
          description: "Gagal mengupload foto dokter.",
          variant: "destructive",
        });
        return;
      }
      photoUrl = `${supabaseUrl}/storage/v1/object/public/doctor-photos/${fileName}`;
    }

    const { data, error } = await supabase
      .from('doctors')
      .update({
        name: editingDoctor.name,
        specialization_id: editingDoctor.specialization_id,
        email: editingDoctor.email,
        phone: editingDoctor.phone,
        bio: editingDoctor.bio,
        photo_url: photoUrl
      })
      .eq('id', editingDoctor.id)
      .select('id, name, specialization_id, specializations(name), email, phone, bio, photo_url')
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Gagal memperbarui dokter.",
        variant: "destructive",
      });
    } else {
      setDoctors(doctors.map(doc => doc.id === data.id ? data : doc));
      toast({
        title: "Doctor Updated",
        description: "Dokter berhasil diperbarui.",
      });
      setEditingDoctor(null);
      setPhotoFile(null);
    }
  };

  const handleDeleteDoctor = async (id: string) => {
    const { error } = await supabase
      .from('doctors')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus dokter.",
        variant: "destructive",
      });
    } else {
      setDoctors(doctors.filter(doctor => doctor.id !== id));
      toast({
        title: "Doctor Deleted",
        description: "Dokter berhasil dihapus.",
      });
    }
  };

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
                placeholder="Dr. Jane Smith"
                value={newDoctor.name}
                onChange={(e) => setNewDoctor({...newDoctor, name: e.target.value})}
              />
            </div>
            
            <div>
              <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">
                Spesialisasi
              </label>
              <Select
                value={newDoctor.specialization_id}
                onValueChange={(value) => setNewDoctor({...newDoctor, specialization_id: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Spesialisasi" />
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
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="dokter@rskartini.id"
                value={newDoctor.email}
                onChange={(e) => setNewDoctor({...newDoctor, email: e.target.value})}
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Nomor Telepon
              </label>
              <Input
                id="phone"
                placeholder="(62) 123-4567"
                value={newDoctor.phone}
                onChange={(e) => setNewDoctor({...newDoctor, phone: e.target.value})}
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
                placeholder="Dokter Anak Profesional"
                value={newDoctor.bio}
                onChange={(e) => setNewDoctor({...newDoctor, bio: e.target.value})}
                className="min-h-[100px]"
              />
            </div>
          </div>
          
          <Button onClick={handleAddDoctor} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Dokter
          </Button>
        </CardContent>
      </Card>
      
      <h2 className="text-lg font-medium mb-4">Daftar Dokter</h2>
      
      {filteredDoctors.length > 0 ? (
        <div className="overflow-x-auto">
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
                    {doctor.email && <div>{doctor.email}</div>}
                    {doctor.phone && <div className="text-sm text-gray-500">{doctor.phone}</div>}
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
                              <label htmlFor="edit-email" className="text-right text-sm">
                                Email
                              </label>
                              <Input
                                id="edit-email"
                                type="email"
                                className="col-span-3"
                                value={editingDoctor.email || ""}
                                onChange={(e) => setEditingDoctor({
                                  ...editingDoctor,
                                  email: e.target.value
                                })}
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <label htmlFor="edit-phone" className="text-right text-sm">
                                Nomor Telepon
                              </label>
                              <Input
                                id="edit-phone"
                                className="col-span-3"
                                value={editingDoctor.phone || ""}
                                onChange={(e) => setEditingDoctor({
                                  ...editingDoctor,
                                  phone: e.target.value
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
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteDoctor(doctor.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="bg-gray-50 border rounded-lg p-8 text-center">
          <User className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">Dokter tidak ditemukan</h3>
          <p className="text-gray-500 mb-4">
            Tidak ada dokter yang sesuai dengan kriteria pencarian Anda.
          </p>
        </div>
      )}
    </AdminLayout>
  );
}