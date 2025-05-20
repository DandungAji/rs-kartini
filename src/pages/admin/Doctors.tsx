import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import AdminLayout from "@/components/admin/AdminLayout";
import { Doctor, ensureObject } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Plus, Trash } from "lucide-react";
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

export default function Doctors() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specializations, setSpecializations] = useState<{ id: string; name: string; }[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [newDoctor, setNewDoctor] = useState<Omit<Doctor, 'id'>>({
    name: "",
    specialization_id: "",
    specialization: { name: "" },
    contact: "",
    bio: "",
    photo_url: "",
  });
	const [deleteDoctorId, setDeleteDoctorId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchDoctors = async () => {
      const { data, error } = await supabase
        .from('doctors')
        .select(`
          id, 
          name, 
          specialization_id,
          specialization:specializations (
            name,
            id
          ),
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
        const processedData = data.map((doctor: any) => ({
          ...doctor,
          specialization: ensureObject(doctor.specialization)
        }));
        setDoctors(processedData);
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
          setNewDoctor(prev => ({ ...prev, specialization_id: data[0].id, specialization: { name: data[0].name } }));
        }
      }
    };

    fetchDoctors();
    fetchSpecializations();
  }, [user]);

  const handleAddDoctor = async () => {
    if (!newDoctor.name || !newDoctor.specialization_id) {
      toast({
        title: "Informasi Kurang",
        description: "Harap isi nama dan pilih spesialisasi.",
        variant: "destructive",
      });
      return;
    }

    const { data, error } = await supabase
      .from('doctors')
      .insert([{
        name: newDoctor.name,
        specialization_id: newDoctor.specialization_id,
        contact: newDoctor.contact,
        bio: newDoctor.bio,
        photo_url: newDoctor.photo_url,
      }])
      .select(`
        id, 
        name, 
        specialization_id,
        specialization:specializations (
          name,
          id
        ),
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
      const processedData = {
        ...data,
        specialization: ensureObject(data.specialization)
      };
      setDoctors([...doctors, processedData]);
      toast({
        title: "Dokter Ditambahkan",
        description: "Dokter berhasil ditambahkan.",
      });
      setNewDoctor({
        name: "",
        specialization_id: specializations[0]?.id || "",
        specialization: { name: specializations[0]?.name || "" },
        contact: "",
        bio: "",
        photo_url: "",
      });
      setIsDialogOpen(false);
    }
  };

  const handleEdit = (doctor: Doctor) => {
    setEditingDoctor({
      ...doctor,
      specialization: ensureObject(doctor.specialization)
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingDoctor) return;

    const { data, error } = await supabase
      .from('doctors')
      .update({
        name: editingDoctor.name,
        specialization_id: editingDoctor.specialization_id,
        contact: editingDoctor.contact,
        bio: editingDoctor.bio,
        photo_url: editingDoctor.photo_url,
      })
      .eq('id', editingDoctor.id)
      .select(`
        id, 
        name, 
        specialization_id,
        specialization:specializations (
          name,
          id
        ),
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
      const processedData = {
        ...data,
        specialization: ensureObject(data.specialization)
      };
      setDoctors(doctors.map(d => d.id === data.id ? processedData : d));
      toast({
        title: "Dokter Diperbarui",
        description: "Data dokter berhasil diperbarui.",
      });
      setIsDialogOpen(false);
      setEditingDoctor(null);
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
      setDoctors(doctors.filter(d => d.id !== deleteDoctorId));
      toast({
        title: "Dokter Dihapus",
        description: "Dokter berhasil dihapus.",
      });
    }
    setDeleteDoctorId(null);
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Data Dokter</h1>

      {/* Add Doctor Button */}
      <div className="mb-6">
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingDoctor(null);
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Dokter
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingDoctor ? "Edit Dokter" : "Tambah Dokter"}</DialogTitle>
              <DialogDescription>
                {editingDoctor ? "Perbarui detail dokter di bawah ini." : "Isi detail dokter baru."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nama
                </Label>
                <div className="col-span-3">
                  <Input
                    id="name"
                    value={editingDoctor ? editingDoctor.name : newDoctor.name}
                    onChange={(e) =>
                      editingDoctor
                        ? setEditingDoctor({ ...editingDoctor, name: e.target.value })
                        : setNewDoctor({ ...newDoctor, name: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="specialization" className="text-right">
                  Spesialisasi
                </Label>
                <div className="col-span-3">
                  <Select
                    value={editingDoctor ? editingDoctor.specialization_id : newDoctor.specialization_id}
                    onValueChange={(value) => {
                      const selectedSpecialization = specializations.find(s => s.id === value);
                      if (editingDoctor) {
                        setEditingDoctor({
                          ...editingDoctor,
                          specialization_id: value,
                          specialization: selectedSpecialization ? { name: selectedSpecialization.name } : { name: "" }
                        });
                      } else {
                        setNewDoctor({
                          ...newDoctor,
                          specialization_id: value,
                          specialization: selectedSpecialization ? { name: selectedSpecialization.name } : { name: "" }
                        });
                      }
                    }}
                  >
                    <SelectTrigger id="specialization">
                      <SelectValue placeholder="Pilih Spesialisasi" />
                    </SelectTrigger>
                    <SelectContent>
                      {specializations.map((specialization) => (
                        <SelectItem key={specialization.id} value={specialization.id}>
                          {specialization.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contact" className="text-right">
                  Kontak
                </Label>
                <div className="col-span-3">
                  <Input
                    id="contact"
                    type="text"
                    value={editingDoctor ? editingDoctor.contact : newDoctor.contact}
                    onChange={(e) =>
                      editingDoctor
                        ? setEditingDoctor({ ...editingDoctor, contact: e.target.value })
                        : setNewDoctor({ ...newDoctor, contact: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="bio" className="text-right">
                  Bio
                </Label>
                <div className="col-span-3">
                  <Input
                    id="bio"
                    type="text"
                    value={editingDoctor ? editingDoctor.bio : newDoctor.bio}
                    onChange={(e) =>
                      editingDoctor
                        ? setEditingDoctor({ ...editingDoctor, bio: e.target.value })
                        : setNewDoctor({ ...newDoctor, bio: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="photo_url" className="text-right">
                  URL Foto
                </Label>
                <div className="col-span-3">
                  <Input
                    id="photo_url"
                    type="text"
                    value={editingDoctor ? editingDoctor.photo_url : newDoctor.photo_url}
                    onChange={(e) =>
                      editingDoctor
                        ? setEditingDoctor({ ...editingDoctor, photo_url: e.target.value })
                        : setNewDoctor({ ...newDoctor, photo_url: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsDialogOpen(false);
                  setEditingDoctor(null);
                }}
              >
                Batal
              </Button>
              <Button type="submit" onClick={editingDoctor ? handleSave : handleAddDoctor}>
                {editingDoctor ? "Simpan Perubahan" : "Tambah Dokter"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Doctor Table */}
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Spesialisasi</TableHead>
              <TableHead>Kontak</TableHead>
              <TableHead>Bio</TableHead>
              <TableHead>URL Foto</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {doctors.map((doctor) => (
              <TableRow key={doctor.id}>
                <TableCell>{doctor.name}</TableCell>
                <TableCell>{doctor.specialization?.name}</TableCell>
                <TableCell>{doctor.contact}</TableCell>
                <TableCell>{doctor.bio}</TableCell>
                <TableCell>{doctor.photo_url}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(doctor)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
									<AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteDoctorId(doctor.id)}
													className="text-red-500 hover:text-red-700"
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Hapus
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
                          <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus dokter ini? Tindakan ini tidak dapat dibatalkan.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setDeleteDoctorId(null)}>
                            Batal
                          </AlertDialogCancel>
                          <AlertDialogAction onClick={confirmDeleteDoctor}>
                            Hapus
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}
