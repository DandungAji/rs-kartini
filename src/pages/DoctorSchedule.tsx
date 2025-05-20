
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import PageHeader from "@/components/PageHeader";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Schedule, Doctor, ensureObject } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, Clock } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

export default function DoctorSchedule() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDay, setSelectedDay] = useState("all");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");

  // Fetch doctors and schedules
  const { data: doctors = [], isLoading: loadingDoctors } = useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("doctors")
        .select(`
          id, 
          name, 
          specialization:specializations (
            name,
            id
          )
        `)
        .order("name");
      
      if (error) throw error;
      
      return data.map((doctor: any) => ({
        ...doctor,
        specialization: ensureObject(doctor.specialization)
      })) as Doctor[];
    },
  });

  const { data: schedules = [], isLoading: loadingSchedules } = useQuery({
    queryKey: ["schedules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("schedules")
        .select(`
          id,
          doctor_id,
          doctor:doctors (
            id,
            name,
            specialization:specializations (
              id,
              name
            )
          ),
          days,
          start_time,
          end_time,
          status
        `)
        .eq("status", "active");

      if (error) throw error;

      return data.map((schedule: any) => ({
        ...schedule,
        doctor: {
          ...ensureObject(schedule.doctor),
          specialization: schedule.doctor?.specialization ? ensureObject(schedule.doctor.specialization) : undefined
        }
      })) as Schedule[];
    },
  });

  // Extract unique specialties from doctors
  const specialties = React.useMemo(() => {
    const specialtySet = new Set<string>();
    doctors.forEach((doctor) => {
      if (doctor.specialization?.name) {
        specialtySet.add(doctor.specialization.name);
      }
    });
    return Array.from(specialtySet);
  }, [doctors]);

  // Filter schedules based on search and filters
  const filteredSchedules = React.useMemo(() => {
    return schedules.filter((schedule) => {
      const doctorName = schedule.doctor?.name || "";
      const specialtyName = schedule.doctor?.specialization?.name || "";
      
      const matchesSearch = doctorName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDay = selectedDay === "all" || schedule.days === selectedDay;
      const matchesSpecialty = selectedSpecialty === "all" || specialtyName === selectedSpecialty;
      
      return matchesSearch && matchesDay && matchesSpecialty;
    });
  }, [schedules, searchTerm, selectedDay, selectedSpecialty]);

  // Group schedules by day for better organization
  const schedulesByDay = React.useMemo(() => {
    const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const grouped: Record<string, Schedule[]> = {};
    
    days.forEach(day => {
      grouped[day] = filteredSchedules.filter(schedule => schedule.days === day);
    });
    
    return grouped;
  }, [filteredSchedules]);

  return (
    <div>
      <Navbar />
      
      <PageHeader 
        title="Jadwal Dokter" 
        subtitle="Temukan jadwal praktik dokter spesialis kami dan buat janji temu untuk konsultasi"
      />
      
      <div className="container mx-auto px-4 py-12">
        <AnimatedSection animationStyle="fade-in" className="mb-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Cari Jadwal Dokter</h2>
            <p className="text-muted-foreground mb-6">
              Gunakan filter di bawah untuk menemukan jadwal dokter yang Anda butuhkan
            </p>
          </div>
        </AnimatedSection>
        
        <AnimatedSection animationStyle="slide-up" className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                placeholder="Cari nama dokter..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-4">
              <Select value={selectedDay} onValueChange={setSelectedDay}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Pilih hari" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua hari</SelectItem>
                  <SelectItem value="Senin">Senin</SelectItem>
                  <SelectItem value="Selasa">Selasa</SelectItem>
                  <SelectItem value="Rabu">Rabu</SelectItem>
                  <SelectItem value="Kamis">Kamis</SelectItem>
                  <SelectItem value="Jumat">Jumat</SelectItem>
                  <SelectItem value="Sabtu">Sabtu</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Pilih spesialisasi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua spesialisasi</SelectItem>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </AnimatedSection>
        
        {loadingDoctors || loadingSchedules ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Memuat jadwal dokter...</p>
          </div>
        ) : (
          <AnimatedSection animationStyle="fade-in" className="space-y-8">
            {Object.entries(schedulesByDay).map(([day, daySchedules]) => 
              daySchedules.length > 0 && (
                <Card key={day} className="overflow-hidden">
                  <CardHeader className="bg-primary text-white">
                    <CardTitle className="flex items-center">
                      <Calendar className="mr-2 h-5 w-5" />
                      {day}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {daySchedules.map((schedule) => (
                        <Card key={schedule.id} className="overflow-hidden">
                          <CardContent className="p-4">
                            <div className="font-medium text-lg mb-1">
                              {schedule.doctor?.name || "Dokter Tidak Diketahui"}
                            </div>
                            <Badge variant="outline" className="mb-3 bg-secondary/50">
                              {schedule.doctor?.specialization?.name || "Umum"}
                            </Badge>
                            <div className="flex items-center text-sm text-muted-foreground mb-4">
                              <Clock className="h-4 w-4 mr-2 text-primary" />
                              <span>
                                {schedule.start_time} - {schedule.end_time}
                              </span>
                            </div>
                            <Button size="sm" className="hover-scale w-full">
                              Buat Janji
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            )}
            
            {filteredSchedules.length === 0 && (
              <Card className="p-12 text-center">
                <div className="text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p className="text-lg">Tidak ada jadwal dokter yang ditemukan</p>
                  <p className="mt-2">Silakan coba dengan filter yang berbeda</p>
                </div>
              </Card>
            )}
          </AnimatedSection>
        )}
        
        <AnimatedSection animationStyle="slide-up" className="mt-12 max-w-3xl mx-auto bg-secondary/50 p-6 rounded-lg">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="md:w-2/3">
              <h3 className="text-xl font-bold mb-2">Butuh bantuan untuk reservasi?</h3>
              <p className="text-muted-foreground">
                Hubungi kami melalui WhatsApp atau telepon untuk bantuan dalam membuat janji temu dengan dokter
              </p>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <Button size="lg" className="hover-scale">
                Hubungi Kami
              </Button>
            </div>
          </div>
        </AnimatedSection>
      </div>
      
      <Footer />
    </div>
  );
}
