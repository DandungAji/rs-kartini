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

interface Doctor {
  id: string;
  name: string;
}

interface Schedule {
  id: string;
  doctor_id: string;
  doctor?: { name: string };
  day: string;
  start_time: string;
  end_time: string;
  location?: string;
  status: "active" | "inactive";
}

export default function Schedules() {
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
    day: "Monday",
    start_time: "",
    end_time: "",
    location: "",
    status: "active"
  });

  // Fetch schedules and doctors on mount
  useEffect(() => {
    const fetchSchedules = async () => {
      const { data, error } = await supabase
        .from('schedules')
        .select('id, doctor_id, doctors(name), day, start_time, end_time, location, status');
      if (error) {
        toast({
          title: "Error",
          description: "Gagal mengambil data jadwal.",
          variant: "destructive",
        });
      } else {
        setSchedules(data);
      }
    };

    const fetchDoctors = async () => {
      const { data, error } = await supabase
        .from('doctors')
        .select('id, name')
        .order('name');
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

    fetchSchedules();
    fetchDoctors();
  }, []);

  // Filter schedules
  const filteredSchedules = schedules.filter((schedule) => {
    const doctorMatch = selectedDoctor === "all" || schedule.doctor_id === selectedDoctor;
    const dayMatch = selectedDay === "all" || schedule.day === selectedDay;
    const searchMatch =
      !searchTerm ||
      (schedule.doctor?.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return doctorMatch && dayMatch && searchMatch;
  });

  const handleAddSchedule = async () => {
    if (!newSchedule.doctor_id || !newSchedule.start_time || !newSchedule.end_time) {
      toast({
        title: "Missing Information",
        description: "Harap isi dokter, waktu mulai, dan waktu selesai.",
        variant: "destructive",
      });
      return;
    }

    const { data, error } = await supabase
      .from('schedules')
      .insert([{
        doctor_id: newSchedule.doctor_id,
        day: newSchedule.day,
        start_time: newSchedule.start_time,
        end_time: newSchedule.end_time,
        location: newSchedule.location,
        status: newSchedule.status
      }])
      .select('id, doctor_id, doctors(name), day, start_time, end_time, location, status')
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Gagal menambah jadwal.",
        variant: "destructive",
      });
    } else {
      setSchedules([...schedules, data]);
      toast({
        title: "Schedule Added",
        description: "Jadwal berhasil ditambahkan.",
      });
      setNewSchedule({
        doctor_id: "",
        day: "Monday",
        start_time: "",
        end_time: "",
        location: "",
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

    const { data, error } = await supabase
      .from('schedules')
      .update({
        doctor_id: editingSchedule.doctor_id,
        day: editingSchedule.day,
        start_time: editingSchedule.start_time,
        end_time: editingSchedule.end_time,
        location: editingSchedule.location,
        status: editingSchedule.status
      })
      .eq('id', editingSchedule.id)
      .select('id, doctor_id, doctors(name), day, start_time, end_time, location, status')
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Gagal memperbarui jadwal.",
        variant: "destructive",
      });
    } else {
      setSchedules(schedules.map(s => s.id === data.id ? data : s));
      toast({
        title: "Schedule Updated",
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
        title: "Error",
        description: "Gagal menghapus jadwal.",
        variant: "destructive",
      });
    } else {
      setSchedules(schedules.filter(s => s.id !== id));
      toast({
        title: "Schedule Deleted",
        description: "Jadwal berhasil dihapus.",
      });
    }
  };

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

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
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih dokter" />
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
                    value={editingSchedule ? editingSchedule.day : newSchedule.day}
                    onValueChange={(value) =>
                      editingSchedule
                        ? setEditingSchedule(prev => prev ? { ...prev, day: value } : null)
                        : setNewSchedule({ ...newSchedule, day: value })
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
                    type="time"
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
                    type="time"
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
                <Label htmlFor="location" className="text-right">
                  Lokasi
                </Label>
                <div className="col-span-3">
                  <Input
                    id="location"
                    placeholder="Nomor ruangan"
                    value={editingSchedule ? editingSchedule.location : newSchedule.location}
                    onChange={(e) =>
                      editingSchedule
                        ? setEditingSchedule(prev => prev ? { ...prev, location: e.target.value } : null)
                        : setNewSchedule({ ...newSchedule, location: e.target.value })
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
              <TableHead>Lokasi</TableHead>
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
                  <TableCell>{schedule.day}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-primary" />
                      <span>
                        {schedule.start_time} - {schedule.end_time}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{schedule.location || '-'}</TableCell>
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
                <TableCell colSpan={6} className="h-24 text-center">
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