import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase";
import { Calendar, Clock, Edit, Filter, Search, Plus, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface Doctor {
  id: string;
  name: string;
}

interface Schedule {
  id: string;
  doctor_id: string;
  doctor?: { name: string };
  days: string;
  start_time: string;
  end_time: string;
  status: "active" | "inactive";
}

export default function Schedules() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<string>("all");
  const [selectedDay, setSelectedDay] = useState<string>("all");
  
  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [newSchedule, setNewSchedule] = useState<Partial<Schedule>>({
    doctor_id: "",
    days: "Senin",
    start_time: "",
    end_time: "",
    status: "active"
  });

  // Fetch schedules and doctors on mount
  useEffect(() => {
    if (!user) return;

    const fetchSchedules = async () => {
      const { data, error } = await supabase
        .from('schedules')
        .select(`
          id, 
          doctor_id, 
          doctor:doctors!doctor_id(name), 
          days, 
          start_time, 
          end_time, 
          status
        `);
      if (error) {
        toast({
          title: "Kesalahan",
          description: "Gagal mengambil data jadwal: " + error.message,
          variant: "destructive",
        });
        console.error("Fetch schedules error:", error);
      } else {
        setSchedules(data.map(schedule => ({
          ...schedule,
          doctor: schedule.doctor || { name: 'Dokter Tidak Diketahui' }
        })));
        console.log("Schedules fetched:", data);
      }
    };

    const fetchDoctors = async () => {
      const { data, error } = await supabase
        .from('doctors')
        .select('id, name')
        .order('name');
      if (error) {
        toast({
          title: "Kesalahan",
          description: "Gagal mengambil data dokter: " + error.message,
          variant: "destructive",
        });
        console.error("Fetch doctors error:", error);
      } else {
        setDoctors(data);
        if (data.length > 0) {
          setNewSchedule(prev => ({ ...prev, doctor_id: data[0].id }));
        }
        console.log("Doctors fetched:", data);
      }
    };

    fetchSchedules();
    fetchDoctors();
  }, [user]);

  // Filter schedules
  const filteredSchedules = schedules.filter((schedule) => {
    const doctorMatch = selectedDoctor === "all" || schedule.doctor_id === selectedDoctor;
    const dayMatch = selectedDay === "all" || schedule.days === selectedDay;
    const searchMatch =
      !searchTerm ||
      (schedule.doctor?.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return doctorMatch && dayMatch && searchMatch;
  });

  const handleAddSchedule = async () => {
    if (!newSchedule.doctor_id || !newSchedule.start_time || !newSchedule.end_time) {
      toast({
        title: "Informasi Kurang",
        description: "Harap isi dokter, waktu mulai, dan waktu selesai.",
        variant: "destructive",
      });
      return;
    }

    // Validasi format waktu (HH.MM)
    const timeRegex = /^([0-1]?[0-9]|2[0-3])\.[0-5][0-9]$/;
    if (!timeRegex.test(newSchedule.start_time) || !timeRegex.test(newSchedule.end_time)) {
      toast({
        title: "Format Waktu Salah",
        description: "Waktu harus dalam format HH.MM (contoh: 08.00).",
        variant: "destructive",
      });
      return;
    }

    const { data, error } = await supabase
      .from('schedules')
      .insert([{
        doctor_id: newSchedule.doctor_id,
        days: newSchedule.days,
        start_time: newSchedule.start_time,
        end_time: newSchedule.end_time,
        status: newSchedule.status
      }])
      .select(`
        id, 
        doctor_id, 
        doctor:doctors!doctor_id(name), 
        days, 
        start_time, 
        end_time, 
        status
      `)
      .single();

    if (error) {
      toast({
        title: "Kesalahan",
        description: "Gagal menambah jadwal: " + error.message,
        variant: "destructive",
      });
      console.error("Insert error:", error);
    } else {
      setSchedules([...schedules, { ...data, doctor: data.doctor || { name: 'Dokter Tidak Diketahui' } }]);
      toast({
        title: "Jadwal Ditambahkan",
        description: "Jadwal berhasil ditambahkan.",
      });
      setNewSchedule({
        doctor_id: doctors[0]?.id || "",
        days: "Senin",
        start_time: "",
        end_time: "",
        status: "active"
      });
      setIsDialogOpen(false);
    }
  };

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule({ ...schedule });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingSchedule) return;

    // Validasi format waktu (HH.MM)
    const timeRegex = /^([0-1]?[0-9]|2[0-3])\.[0-5][0-9]$/;
    if (!timeRegex.test(editingSchedule.start_time) || !timeRegex.test(editingSchedule.end_time)) {
      toast({
        title: "Format Waktu Salah",
        description: "Waktu harus dalam format HH.MM (contoh: 08.00).",
        variant: "destructive",
      });
      return;
    }

    const { data, error } = await supabase
      .from('schedules')
      .update({
        doctor_id: editingSchedule.doctor_id,
        days: editingSchedule.days,
        start_time: editingSchedule.start_time,
        end_time: editingSchedule.end_time,
        status: editingSchedule.status
      })
      .eq('id', editingSchedule.id)
      .select(`
        id, 
        doctor_id, 
        doctor:doctors!doctor_id(name), 
        days, 
        start_time, 
        end_time, 
        status
      `)
      .single();

    if (error) {
      toast({
        title: "Kesalahan",
        description: "Gagal memperbarui jadwal: " + error.message,
        variant: "destructive",
      });
      console.error("Update error:", error);
    } else {
      setSchedules(schedules.map(s => s.id === data.id ? { ...data, doctor: data.doctor || { name: 'Dokter Tidak Diketahui' } } : s));
      toast({
        title: "Jadwal Diperbarui",
        description: "Jadwal berhasil diperbarui.",
      });
      setIsDialogOpen(false);
      setEditingSchedule(null);
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    const { error } = await supabase
      .from('schedules')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Kesalahan",
        description: "Gagal menghapus jadwal: " + error.message,
        variant: "destructive",
      });
      console.error("Delete error:", error);
    } else {
      setSchedules(schedules.filter(s => s.id !== id));
      toast({
        title: "Jadwal Dihapus",
        description: "Jadwal berhasil dihapus.",
      });
    }
  };

  const days = [
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
    "Minggu",
  ];

  if (loading) return <div className="p-4">Memuat...</div>;
  if (!user) return <div className="p-4">Harap login untuk mengakses halaman ini.</div>;

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Jadwal Dokter</h1>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            placeholder="Cari dokter..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-4">
          <div className="w-[180px]">
            <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
              <SelectTrigger>
                <SelectValue placeholder="Semua dokter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua dokter</SelectItem>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-[180px]">
            <Select value={selectedDay} onValueChange={setSelectedDay}>
              <SelectTrigger>
                <SelectValue placeholder="Semua hari" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua hari</SelectItem>
                {days.map((day) => (
                  <SelectItem key={day} value={day}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Add Schedule Button */}
      <div className="mb-6">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Jadwal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingSchedule ? "Edit Jadwal" : "Tambah Jadwal"}</DialogTitle>
              <DialogDescription>
                {editingSchedule ? "Perbarui detail jadwal di bawah ini." : "Isi detail jadwal baru."}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="doctor" className="text-right">
                  Dokter
                </Label>
                <div className="col-span-3">
                  <Select
                    value={editingSchedule ? editingSchedule.doctor_id : newSchedule.doctor_id}
                    onValueChange={(value) =>
                      editingSchedule
                        ? setEditingSchedule(prev => prev ? { ...prev, doctor_id: value } : null)
                        : setNewSchedule({ ...newSchedule, doctor_id: value })
                    }
                    disabled={doctors.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={doctors.length === 0 ? "Tidak ada dokter" : "Pilih dokter"} />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="day" className="text-right">
                  Hari
                </Label>
                <div className="col-span-3">
                  <Select
                    value={editingSchedule ? editingSchedule.days : newSchedule.days}
                    onValueChange={(value) =>
                      editingSchedule
                        ? setEditingSchedule(prev => prev ? { ...prev, days: value } : null)
                        : setNewSchedule({ ...newSchedule, days: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih hari" />
                    </SelectTrigger>
                    <SelectContent>
                      {days.map((day) => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startTime" className="text-right">
                  Waktu Mulai
                </Label>
                <div className="col-span-3">
                  <Input
                    id="startTime"
                    placeholder="08.00"
                    value={editingSchedule ? editingSchedule.start_time : newSchedule.start_time}
                    onChange={(e) =>
                      editingSchedule
                        ? setEditingSchedule(prev => prev ? { ...prev, start_time: e.target.value } : null)
                        : setNewSchedule({ ...newSchedule, start_time: e.target.value })
                    }
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endTime" className="text-right">
                  Waktu Selesai
                </Label>
                <div className="col-span-3">
                  <Input
                    id="endTime"
                    placeholder="12.00"
                    value={editingSchedule ? editingSchedule.end_time : newSchedule.end_time}
                    onChange={(e) =>
                      editingSchedule
                        ? setEditingSchedule(prev => prev ? { ...prev, end_time: e.target.value } : null)
                        : setNewSchedule({ ...newSchedule, end_time: e.target.value })
                    }
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Switch
                    id="status"
                    checked={editingSchedule ? editingSchedule.status === "active" : newSchedule.status === "active"}
                    onCheckedChange={(checked) =>
                      editingSchedule
                        ? setEditingSchedule(prev => 
                            prev ? { ...prev, status: checked ? "active" : "inactive" } : null
                          )
                        : setNewSchedule({ ...newSchedule, status: checked ? "active" : "inactive" })
                    }
                  />
                  <span>
                    {editingSchedule
                      ? editingSchedule.status === "active" ? "Aktif" : "Tidak Aktif"
                      : newSchedule.status === "active" ? "Aktif" : "Tidak Aktif"}
                  </span>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsDialogOpen(false);
                setEditingSchedule(null);
              }}>
                Batal
              </Button>
              <Button onClick={editingSchedule ? handleSave : handleAddSchedule}>
                {editingSchedule ? "Simpan Perubahan" : "Tambah Jadwal"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Schedule Table */}
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Dokter</TableHead>
              <TableHead>Hari</TableHead>
              <TableHead>Waktu</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right w-[120px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSchedules.length > 0 ? (
              filteredSchedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell className="font-medium">
                    {schedule.doctor?.name || "Dokter Tidak Diketahui"}
                  </TableCell>
                  <TableCell>{schedule.days}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-primary" />
                      <span>
                        {schedule.start_time} - {schedule.end_time}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={schedule.status === "active" ? "default" : "outline"}
                      className={
                        schedule.status === "active"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                      }
                    >
                      {schedule.status === "active" ? "Aktif" : "Tidak Aktif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(schedule)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSchedule(schedule.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Tidak ada jadwal ditemukan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}