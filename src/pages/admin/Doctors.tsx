
import { useState } from "react";
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
import { Doctor } from "@/lib/types";
import { doctors as initialDoctors, departments } from "@/lib/mockData";
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

export default function Doctors() {
  const { toast } = useToast();
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  
  const [newDoctor, setNewDoctor] = useState<Partial<Doctor>>({
    name: "",
    specialization: "",
    email: "",
    phone: "",
    bio: ""
  });
  
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  
  // Filter doctors based on search query and department
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === "all" || doctor.specialization === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });
  
  const handleAddDoctor = () => {
    if (!newDoctor.name || !newDoctor.specialization) {
      toast({
        title: "Missing Information",
        description: "Please provide at least a name and specialization.",
        variant: "destructive",
      });
      return;
    }
    
    const newId = `${doctors.length + 1}`;
    
    const doctorToAdd: Doctor = {
      id: newId,
      name: newDoctor.name || "",
      specialization: newDoctor.specialization || "",
      email: newDoctor.email,
      phone: newDoctor.phone,
      bio: newDoctor.bio,
    };
    
    setDoctors([...doctors, doctorToAdd]);
    
    toast({
      title: "Doctor Added",
      description: "The new doctor has been added successfully.",
    });
    
    // Reset form
    setNewDoctor({
      name: "",
      specialization: "",
      email: "",
      phone: "",
      bio: ""
    });
  };
  
  const handleUpdateDoctor = () => {
    if (!editingDoctor) return;
    
    setDoctors(doctors.map(doc => 
      doc.id === editingDoctor.id ? editingDoctor : doc
    ));
    
    toast({
      title: "Doctor Updated",
      description: "The doctor information has been updated successfully.",
    });
    
    setEditingDoctor(null);
  };
  
  const handleDeleteDoctor = (id: string) => {
    setDoctors(doctors.filter(doctor => doctor.id !== id));
    
    toast({
      title: "Doctor Deleted",
      description: "The doctor has been removed from the system.",
    });
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
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Spesialisasi</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.name}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search doctors..."
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
                value={newDoctor.specialization}
                onValueChange={(value) => setNewDoctor({...newDoctor, specialization: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Specialization" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.name}>
                      {dept.name}
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
                  <TableCell>{doctor.specialization}</TableCell>
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
                                value={editingDoctor.specialization}
                                onValueChange={(value) => setEditingDoctor({
                                  ...editingDoctor,
                                  specialization: value
                                })}
                              >
                                <SelectTrigger className="col-span-3">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {departments.map((dept) => (
                                    <SelectItem key={dept.id} value={dept.name}>
                                      {dept.name}
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
