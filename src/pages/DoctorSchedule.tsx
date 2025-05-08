import { useMemo, useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  photo_url: string | null;
  bio: string | null;
}

interface Schedule {
  id: string;
  doctor_id: string;
  days: string;
  start_time: string;
  end_time: string;
  status: string;
}

interface Specialization {
  id: string;
  name: string;
}

const weekDays = [
  "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"
];

export default function DoctorSchedule() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch doctors with specialization name
        const { data: doctorsData, error: doctorsError } = await supabase
          .from('doctors')
          .select(`
            id,
            name,
            photo_url,
            bio,
            specializations:specialization_id (name)
          `);
        
        if (doctorsError) throw new Error("Gagal mengambil data dokter: " + doctorsError.message);

        // Fetch schedules
        const { data: schedulesData, error: schedulesError } = await supabase
          .from('schedules')
          .select('id, doctor_id, days, start_time, end_time, status')
          .eq('status', 'active');

        if (schedulesError) throw new Error("Gagal mengambil data jadwal: " + schedulesError.message);

        // Fetch specializations
        const { data: specializationsData, error: specializationsError } = await supabase
          .from('specializations')
          .select('id, name');

        if (specializationsError) throw new Error("Gagal mengambil data spesialisasi: " + specializationsError.message);

        // Transform doctors data to include specialization name
        const formattedDoctors: Doctor[] = doctorsData.map(doctor => ({
          id: doctor.id,
          name: doctor.name,
          specialization: doctor.specializations.name,
          photo_url: doctor.photo_url,
          bio: doctor.bio,
        }));

        setDoctors(formattedDoctors);
        setSchedules(schedulesData);
        setSpecializations(specializationsData);
      } catch (err: any) {
        setError(err.message);
        toast({
          title: "Kesalahan",
          description: err.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Filter doctors based on search and department
  const filteredDoctors = useMemo(() => {
    return doctors.filter(doctor => {
      const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDepartment = selectedDepartment === "all" || doctor.specialization === selectedDepartment;
      return matchesSearch && matchesDepartment;
    });
  }, [doctors, searchQuery, selectedDepartment]);

  // Group doctors by specialization
  const doctorsBySpecialization = useMemo(() => {
    const grouped: Record<string, Doctor[]> = {};
    
    filteredDoctors.forEach(doctor => {
      if (!grouped[doctor.specialization]) {
        grouped[doctor.specialization] = [];
      }
      grouped[doctor.specialization].push(doctor);
    });
    
    return grouped;
  }, [filteredDoctors]);

  // Get schedules for a specific doctor
  const getDoctorSchedules = (doctorId: string) => {
    return schedules.filter(schedule => schedule.doctor_id === doctorId);
  };

  // Check if there are any doctors with schedules on the given day
  const hasDoctorsOnDay = (day: string) => {
    return filteredDoctors.some(doctor => 
      getDoctorSchedules(doctor.id).some(schedule => schedule.days === day)
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground">Memuat jadwal dokter...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-destructive">Terjadi kesalahan: {error}</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      
      <PageHeader 
        title="Jadwal Dokter" 
        subtitle="Cari dan pesan janji temu dengan profesional medis kami"
      />
      
      <div className="container mx-auto px-4 py-12">
        {/* Filters */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              placeholder="Cari nama dokter"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-primary focus:ring-primary"
            />
          </div>
          <div>
            <Select
              value={selectedDepartment}
              onValueChange={setSelectedDepartment}
            >
              <SelectTrigger className="w-full border-primary focus:ring-primary">
                <SelectValue placeholder="Filter berdasarkan spesialisasi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Spesialis</SelectItem>
                {specializations.map((spec) => (
                  <SelectItem key={spec.id} value={spec.name}>
                    {spec.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Schedules by Day of Week */}
        <Tabs defaultValue="Senin" className="mb-12">
          <TabsList className="w-full overflow-x-auto flex justify-start md:justify-center bg-primary text-muted-foreground">
            {weekDays.map(day => (
              <TabsTrigger key={day} value={day} className="flex-1 md:flex-none">
                {day}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {weekDays.map(day => (
            <TabsContent key={day} value={day} className="mt-6">
              <h3 className="text-xl font-semibold mb-6 text-foreground">Dokter yang tersedia di hari {day}</h3>
              
              {Object.entries(doctorsBySpecialization).map(([specialization, docs]) => {
                // Filter doctors who have a schedule on this day
                const doctorsOnThisDay = docs.filter(doctor => {
                  return getDoctorSchedules(doctor.id).some(schedule => schedule.days === day);
                });
                
                if (doctorsOnThisDay.length === 0) return null;
                
                return (
                  <div key={specialization} className="mb-8">
                    <h4 className="text-lg font-medium mb-4 bg-secondary text-foreground py-2 px-4 rounded-md">
                      {specialization}
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {doctorsOnThisDay.map(doctor => {
                        const doctorSchedules = getDoctorSchedules(doctor.id).filter(
                          schedule => schedule.days === day
                        );
                        
                        return (
                          <Card key={doctor.id} className="overflow-hidden hover:shadow-md transition-shadow bg-card text-foreground border-primary">
                            <div className="flex items-center p-4 border-b border-primary">
                              <div className="h-16 w-16 rounded-full overflow-hidden mr-4">
                                <img 
                                  src={doctor.photo_url || "https://via.placeholder.com/200"} 
                                  alt={doctor.name} 
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <h5 className="font-semibold text-foreground">{doctor.name}</h5>
                                <p className="text-sm text-muted">{doctor.specialization}</p>
                              </div>
                            </div>
                            <CardContent className="p-4">
                              {doctorSchedules.map(schedule => (
                                <div key={schedule.id} className="flex items-center mb-2">
                                  <Clock size={16} className="mr-2 text-primary" />
                                  <span className="text-foreground">
                                    {schedule.start_time} - {schedule.end_time}
                                  </span>
                                </div>
                              ))}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              
              {!hasDoctorsOnDay(day) && (
                <div className="text-center py-8">
                  <p className="text-muted">Dokter yang Anda cari tidak praktek pada hari {day}.</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Schedule Change Notice */}
        <p className="text-sm text-muted italic mb-8">
          *Jadwal dapat berubah sewaktu-waktu.
        </p>

        {/* All Doctors */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Dokter Spesialis Kami</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map(doctor => (
              <Card key={doctor.id} className="overflow-hidden hover:shadow-md transition-shadow bg-card text-foreground border-primary">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={doctor.photo_url || "https://via.placeholder.com/400"} 
                    alt={doctor.name} 
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-1 text-foreground">{doctor.name}</h3>
                  <p className="text-primary mb-3">{doctor.specialization}</p>
                  <p className="text-muted mb-4 line-clamp-2">{doctor.bio || "Tidak ada bio tersedia."}</p>
                  
                  <div className="mt-auto">
                    <h4 className="font-medium mb-2 text-foreground">Tersedia di:</h4>
                    <div className="flex flex-wrap gap-1">
                      {getDoctorSchedules(doctor.id).map(schedule => (
                        <span key={schedule.id} className="text-xs bg-primary text-background py-1 px-2 rounded">
                          {schedule.days}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredDoctors.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Dokter yang Anda cari tidak ditemukan.</p>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </>
  );
}