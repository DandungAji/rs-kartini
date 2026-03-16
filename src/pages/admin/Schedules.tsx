import React, { useState, useEffect, useCallback } from "react";
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
import { // Hapus Popover
  Command,
  CommandDialog, // Tambahkan CommandDialog
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase";
import { Clock, Edit, Search, Plus, Trash, Check, Copy } from "lucide-react"; // Hapus ChevronsUpDown
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
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
import { cn } from "@/lib/utils";

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
  const { user } = useAuth();
  const { toast } = useToast();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<string>("all");
  const [selectedDay, setSelectedDay] = useState<string>("all");
  
  // State untuk Dialog Utama (Form)
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  // State BARU untuk Dialog Pencarian Dokter
  const [isDoctorSearchOpen, setIsDoctorSearchOpen] = useState(false);

  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [formState, setFormState] = useState<Partial<Schedule>>({
    doctor_id: "",
    days: "Senin",
    start_time: "",
    end_time: "",
    status: "active"
  });
  const [deleteScheduleId, setDeleteScheduleId] = useState<string | null>(null);

  useEffect(() => {
    // ... (Fungsi fetchSchedules dan fetchDoctors tetap sama)
    const fetchSchedules = async () => {
      const { data, error } = await supabase.from('schedules').select(`id, doctor_id, doctor:doctors!doctor_id(name), days, start_time, end_time, status`);
      if (error) { toast({ title: "Kesalahan", description: "Gagal mengambil data jadwal: " + error.message, variant: "destructive" }); } 
      else { setSchedules(data.map(schedule => ({ ...schedule, doctor: schedule.doctor || { name: 'Dokter Tidak Diketahui' } }))); }
    };
    const fetchDoctors = async () => {
      const { data, error } = await supabase.from('doctors').select('id, name').order('name');
      if (error) { toast({ title: "Kesalahan", description: "Gagal mengambil data dokter: " + error.message, variant: "destructive" }); } 
      else { setDoctors(data); }
    };
    if (user) { fetchSchedules(); fetchDoctors(); }
  }, [user, toast]);

  const filteredSchedules = schedules.filter((schedule) => {
    const doctorMatch = selectedDoctor === "all" || schedule.doctor_id === selectedDoctor;
    const dayMatch = selectedDay === "all" || schedule.days === selectedDay;
    const searchMatch = !searchTerm || (schedule.doctor?.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return doctorMatch && dayMatch && searchMatch;
  });

  const resetForm = useCallback(() => {
    setFormState({ doctor_id: "", days: "Senin", start_time: "", end_time: "", status: "active" });
    setEditingSchedule(null);
  }, []);

  const handleOpenDialog = (scheduleToEdit: Schedule | null = null, scheduleToDuplicate: Schedule | null = null) => {
    if (scheduleToEdit) {
      setEditingSchedule(scheduleToEdit);
      setFormState(scheduleToEdit);
    } else if (scheduleToDuplicate) {
      setEditingSchedule(null);
      setFormState({ doctor_id: scheduleToDuplicate.doctor_id, days: scheduleToDuplicate.days, start_time: scheduleToDuplicate.start_time, end_time: scheduleToDuplicate.end_time, status: scheduleToDuplicate.status });
      toast({ title: "Jadwal Diduplikasi", description: "Data sudah disalin ke form. Silakan simpan sebagai jadwal baru." });
    } else {
      resetForm();
    }
    setIsFormDialogOpen(true);
  };
  
  const handleFormSubmit = async () => {
    if (!formState.doctor_id || !formState.start_time || !formState.end_time) {
        toast({ title: "Informasi Kurang", description: "Harap isi dokter, waktu mulai, dan waktu selesai.", variant: "destructive" }); 
        return;
    }

    // 1. Ekstrak (pisahkan) 'id' dan 'doctor' agar tidak ikut masuk ke payload database
    const { id, doctor, ...payloadData } = formState as Schedule;

    if (editingSchedule) {
        // 2. Gunakan payloadData untuk update
        const { data, error } = await supabase
            .from('schedules')
            .update(payloadData) 
            .eq('id', editingSchedule.id)
            .select(`*, doctor:doctors!doctor_id(name)`)
            .single();

        if (error) { 
            toast({ title: "Kesalahan", description: "Gagal memperbarui jadwal: " + error.message, variant: "destructive" }); 
        } else { 
            setSchedules(schedules.map(s => s.id === data.id ? { ...data, doctor: data.doctor || { name: 'Dokter Tidak Diketahui' } } : s)); 
            toast({ title: "Jadwal Diperbarui", description: "Jadwal berhasil diperbarui." }); 
            setIsFormDialogOpen(false); 
        }
    } else {
        // 3. Gunakan payloadData untuk insert
        const { data, error } = await supabase
            .from('schedules')
            .insert([payloadData])
            .select(`*, doctor:doctors!doctor_id(name)`)
            .single();

        if (error) { 
            toast({ title: "Kesalahan", description: "Gagal menambah jadwal: " + error.message, variant: "destructive" }); 
        } else { 
            setSchedules([...schedules, { ...data, doctor: data.doctor || { name: 'Dokter Tidak Diketahui' } }]); 
            toast({ title: "Jadwal Ditambahkan", description: "Jadwal berhasil ditambahkan." }); 
            setIsFormDialogOpen(false); 
        }
    }
  };

  const confirmDeleteSchedule = async () => {
    // ... (Fungsi confirmDeleteSchedule tetap sama)
    if (!deleteScheduleId) return;
    const { error } = await supabase.from('schedules').delete().eq('id', deleteScheduleId);
    if (error) { toast({ title: "Kesalahan", description: "Gagal menghapus jadwal: " + error.message, variant: "destructive" }); } 
    else { setSchedules(schedules.filter(s => s.id !== deleteScheduleId)); toast({ title: "Jadwal Dihapus", description: "Jadwal berhasil dihapus." }); }
    setDeleteScheduleId(null);
  };

  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Jadwal Dokter</h1>
      
      {/* Filter dan Search Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input placeholder="Cari dokter..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="flex gap-4">
          <Select value={selectedDoctor} onValueChange={setSelectedDoctor}><SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Semua dokter" /></SelectTrigger><SelectContent><SelectItem value="all">Semua dokter</SelectItem>{doctors.map((doctor) => (<SelectItem key={doctor.id} value={doctor.id}>{doctor.name}</SelectItem>))}</SelectContent></Select>
          <Select value={selectedDay} onValueChange={setSelectedDay}><SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Semua hari" /></SelectTrigger><SelectContent><SelectItem value="all">Semua hari</SelectItem>{days.map((day) => (<SelectItem key={day} value={day}>{day}</SelectItem>))}</SelectContent></Select>
        </div>
      </div>

      <div className="mb-6">
        {/* ======================= DIALOG FORM UTAMA ======================= */}
        <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Jadwal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingSchedule ? "Edit Jadwal" : "Tambah Jadwal"}</DialogTitle>
              <DialogDescription>{editingSchedule ? "Perbarui detail jadwal." : "Isi detail jadwal baru."}</DialogDescription>
            </DialogHeader>
  
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="doctor" className="text-right">Dokter</Label>
                {/* INI BAGIAN YANG DIGANTI */}
                <Button 
                    variant="outline" 
                    className="col-span-3 justify-start font-normal"
                    onClick={() => setIsDoctorSearchOpen(true)}
                >
                  {formState.doctor_id ? doctors.find((doc) => doc.id === formState.doctor_id)?.name : "Pilih dokter..."}
                </Button>
              </div>
              
              {/* Form Fields lainnya */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="day" className="text-right">Hari</Label>
                <Select value={formState.days} onValueChange={(value) => setFormState(prev => ({...prev, days: value}))}><SelectTrigger id="day" className="col-span-3"><SelectValue placeholder="Pilih hari" /></SelectTrigger><SelectContent>{days.map((day) => (<SelectItem key={day} value={day}>{day}</SelectItem>))}</SelectContent></Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startTime" className="text-right">Waktu Mulai</Label>
                <Input id="startTime" placeholder="08:00" value={formState.start_time || ''} onChange={(e) => setFormState(prev => ({ ...prev, start_time: e.target.value }))} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endTime" className="text-right">Waktu Selesai</Label>
                <Input id="endTime" placeholder="12:00" value={formState.end_time || ''} onChange={(e) => setFormState(prev => ({ ...prev, end_time: e.target.value }))} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">Status</Label>
                <Switch id="status" checked={formState.status === "active"} onCheckedChange={(checked) => setFormState(prev => ({ ...prev, status: checked ? "active" : "inactive" }))} />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsFormDialogOpen(false)}>Batal</Button>
              <Button onClick={handleFormSubmit}>{editingSchedule ? "Simpan Perubahan" : "Tambah Jadwal"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* ======================= DIALOG PENCARIAN DOKTER (BARU) ======================= */}
      <CommandDialog open={isDoctorSearchOpen} onOpenChange={setIsDoctorSearchOpen}>
        <CommandInput placeholder="Ketik nama dokter untuk mencari..." />
        <CommandList>
          <CommandEmpty>Dokter tidak ditemukan.</CommandEmpty>
          <CommandGroup heading="Daftar Dokter">
            {doctors.map((doctor) => (
              <CommandItem
                key={doctor.id}
                value={doctor.name}
                onSelect={() => {
                  setFormState(prev => ({ ...prev, doctor_id: doctor.id }));
                  setIsDoctorSearchOpen(false); // Tutup dialog pencarian setelah memilih
                }}
              >
                <Check className={cn("mr-2 h-4 w-4", formState.doctor_id === doctor.id ? "opacity-100" : "opacity-0")} />
                {doctor.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {/* Tabel Data */}
      <div className="rounded-md border overflow-hidden">
        {/* ... (Kode Tabel tetap sama seperti sebelumnya) ... */}
        <Table>
          <TableHeader><TableRow><TableHead className="w-[250px]">Dokter</TableHead><TableHead>Hari</TableHead><TableHead>Waktu</TableHead><TableHead className="text-center">Status</TableHead><TableHead className="text-right w-[150px]">Aksi</TableHead></TableRow></TableHeader>
          <TableBody>
            {filteredSchedules.length > 0 ? (
              filteredSchedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell className="font-medium">{schedule.doctor?.name || "Dokter Tidak Diketahui"}</TableCell>
                  <TableCell>{schedule.days}</TableCell>
                  <TableCell><div className="flex items-center"><Clock className="h-4 w-4 mr-2 text-primary" /><span>{schedule.start_time} - {schedule.end_time}</span></div></TableCell>
                  <TableCell className="text-center"><Badge variant={schedule.status === "active" ? "default" : "outline"}>{schedule.status === "active" ? "Aktif" : "Tidak Aktif"}</Badge></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(null, schedule)}><Copy className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(schedule)}><Edit className="h-4 w-4" /></Button>
                    <AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="sm" onClick={() => setDeleteScheduleId(schedule.id)} className="text-red-500 hover:text-red-700"><Trash className="h-4 w-4" /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle><AlertDialogDescription>Apakah Anda yakin ingin menghapus jadwal ini? Tindakan ini tidak dapat dibatalkan.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel onClick={() => setDeleteScheduleId(null)}>Batal</AlertDialogCancel><AlertDialogAction onClick={confirmDeleteSchedule}>Hapus</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (<TableRow><TableCell colSpan={5} className="h-24 text-center">Tidak ada jadwal ditemukan.</TableCell></TableRow>)}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}