
import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { doctors, schedules, departments } from "@/lib/mockData";
import { Doctor, Schedule, Department } from "@/lib/types";
import { Clock } from "lucide-react";

const weekDays = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

export default function DoctorSchedule() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");

  // Filter doctors based on search and department
  const filteredDoctors = useMemo(() => {
    return doctors.filter(doctor => {
      const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDepartment = selectedDepartment === "all" || doctor.specialization === selectedDepartment;
      return matchesSearch && matchesDepartment;
    });
  }, [searchQuery, selectedDepartment]);

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
    return schedules.filter(schedule => schedule.doctorId === doctorId);
  };

  return (
    <>
      <Navbar />
      
      <PageHeader 
        title="Jadwal Dokter" 
        subtitle="Find and book appointments with our medical professionals"
      />
      
      <div className="container mx-auto px-4 py-12">
        {/* Filters */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              placeholder="Cari nama dokter"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <Select
              value={selectedDepartment}
              onValueChange={setSelectedDepartment}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Spesialis</SelectItem>
                {departments.map((dept: Department) => (
                  <SelectItem key={dept.id} value={dept.name}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Schedules by Day of Week */}
        <Tabs defaultValue="Senin" className="mb-12">
          <TabsList className="w-full overflow-x-auto flex justify-start md:justify-center">
            {weekDays.map(day => (
              <TabsTrigger key={day} value={day} className="flex-1 md:flex-none">
                {day}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {weekDays.map(day => (
            <TabsContent key={day} value={day} className="mt-6">
              <h3 className="text-xl font-semibold mb-6">Dokter yang tersedia di hari {day}</h3>
              
              {Object.entries(doctorsBySpecialization).map(([specialization, docs]) => {
                // Filter doctors who have a schedule on this day
                const doctorsOnThisDay = docs.filter(doctor => {
                  return getDoctorSchedules(doctor.id).some(schedule => schedule.day === day);
                });
                
                if (doctorsOnThisDay.length === 0) return null;
                
                return (
                  <div key={specialization} className="mb-8">
                    <h4 className="text-lg font-medium mb-4 bg-secondary py-2 px-4 rounded-md">
                      {specialization}
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {doctorsOnThisDay.map(doctor => {
                        const doctorSchedules = getDoctorSchedules(doctor.id).filter(
                          schedule => schedule.day === day
                        );
                        
                        return (
                          <Card key={doctor.id} className="overflow-hidden hover:shadow-md transition-shadow">
                            <div className="flex items-center p-4 border-b">
                              <div className="h-16 w-16 rounded-full overflow-hidden mr-4">
                                <img 
                                  src={doctor.imageUrl || "https://via.placeholder.com/200"} 
                                  alt={doctor.name} 
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <h5 className="font-semibold">{doctor.name}</h5>
                                <p className="text-sm text-gray-600">{doctor.specialization}</p>
                              </div>
                            </div>
                            <CardContent className="p-4">
                              {doctorSchedules.map(schedule => (
                                <div key={schedule.id} className="flex items-center mb-2">
                                  <Clock size={16} className="mr-2 text-primary" />
                                  <span>
                                    {schedule.startTime} - {schedule.endTime}
                                  </span>
                                  <span className="ml-auto text-sm text-gray-500">
                                    {schedule.location}
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
              
              {Object.keys(doctorsBySpecialization).length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">Tidak ada dokter yang sesuai dengan kriteria Anda yang ditemukan di hari {day}.</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* All Doctors */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Dokter Spesialis Kami</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map(doctor => (
              <Card key={doctor.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={doctor.imageUrl || "https://via.placeholder.com/400"} 
                    alt={doctor.name} 
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-1">{doctor.name}</h3>
                  <p className="text-primary mb-3">{doctor.specialization}</p>
                  <p className="text-gray-600 mb-4 line-clamp-2">{doctor.bio}</p>
                  
                  <div className="mt-auto">
                    <h4 className="font-medium mb-2">Tersedia di:</h4>
                    <div className="flex flex-wrap gap-1">
                      {getDoctorSchedules(doctor.id).map(schedule => (
                        <span key={schedule.id} className="text-xs bg-secondary py-1 px-2 rounded">
                          {schedule.day}
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
              <p className="text-gray-500">Tidak ada dokter yang sesuai dengan kriteria pencarian Anda.</p>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </>
  );
}
