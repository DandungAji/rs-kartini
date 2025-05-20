import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Post, Doctor, Schedule, ensureObject } from "@/lib/types";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Users, FileText, Activity, ArrowRight, Calendar, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPosts: 0,
    totalAppointments: 0,
    activeAppointments: 0,
  });

  useEffect(() => {
    if (!user) return;

    const fetchRecentPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id, 
          title,
          status,
          publish_date,
          content,
          author:users (
            full_name
          )
        `)
        .order('publish_date', { ascending: false })
        .limit(5);
      
      if (error) {
        console.error("Error fetching posts:", error);
      } else {
        const processedPosts = data.map((post: any) => ({
          ...post,
          author: ensureObject(post.author),
          category: { id: "", name: "" } // Default value to satisfy type
        }));
        setPosts(processedPosts);
      }
    };

    const fetchStatistics = async () => {
      try {
        const [doctorsCount, postsCount, appointmentsCount, activeAppointmentsCount] = await Promise.all([
          supabase.from('doctors').select('id', { count: 'exact', head: true }),
          supabase.from('posts').select('id', { count: 'exact', head: true }),
          supabase.from('appointments').select('id', { count: 'exact', head: true }),
          supabase.from('appointments').select('id', { count: 'exact', head: true }).eq('status', 'active'),
        ]);

        setStats({
          totalDoctors: doctorsCount.count || 0,
          totalPosts: postsCount.count || 0,
          totalAppointments: appointmentsCount.count || 0,
          activeAppointments: activeAppointmentsCount.count || 0,
        });
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    const fetchDoctors = async () => {
      const { data, error } = await supabase
        .from('doctors')
        .select(`
          id, 
          name, 
          specialization:specializations (
            name
          ),
          photo_url
        `)
        .order('name')
        .limit(5);
      
      if (error) {
        console.error("Error fetching doctors:", error);
      } else {
        const processedDoctors = data.map((doctor: any) => ({
          ...doctor,
          specialization: ensureObject(doctor.specialization),
          specialization_id: "", // Default value to satisfy type
          contact: "",
          bio: ""
        }));
        setDoctors(processedDoctors);
      }
    };

    const fetchAppointments = async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id,
          patient_name,
          appointment_date,
          status,
          doctor:doctors (
            name
          )
        `)
        .order('appointment_date', { ascending: false })
        .limit(5);
      
      if (error) {
        console.error("Error fetching appointments:", error);
      } else {
        const processedAppointments = data.map((appointment: any) => ({
          ...appointment,
          doctor: ensureObject(appointment.doctor)
        }));
        setAppointments(processedAppointments);
      }
    };

    fetchRecentPosts();
    fetchStatistics();
    fetchDoctors();
    fetchAppointments();
  }, [user]);

  if (loading) return <div className="p-4">Memuat...</div>;
  if (!user) return <div className="p-4">Harap login untuk mengakses halaman ini.</div>;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Selamat datang kembali, {user.user_metadata?.full_name || user.email}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total Dokter</p>
              <p className="text-3xl font-bold">{stats.totalDoctors}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <Users className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total Artikel</p>
              <p className="text-3xl font-bold">{stats.totalPosts}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <FileText className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total Janji Temu</p>
              <p className="text-3xl font-bold">{stats.totalAppointments}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <CalendarDays className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Janji Temu Aktif</p>
              <p className="text-3xl font-bold">{stats.activeAppointments}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <Activity className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Posts */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Artikel Terbaru</CardTitle>
              <CardDescription>Artikel yang baru dipublikasikan</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/posts">
                Lihat Semua <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <div key={post.id} className="flex items-start space-x-4 border-b pb-4 last:border-0">
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">{post.title}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-1 h-3 w-3" />
                        {post.publish_date ? format(new Date(post.publish_date), 'dd MMM yyyy', { locale: id }) : 'Tanggal tidak tersedia'}
                      </div>
                    </div>
                    <Badge variant={post.status === 'published' ? 'default' : 'outline'}>
                      {post.status === 'published' ? 'Dipublikasikan' : 'Draft'}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">Belum ada artikel</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Appointments */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Janji Temu Terbaru</CardTitle>
              <CardDescription>Janji temu yang baru dibuat</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/appointments">
                Lihat Semua <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-start space-x-4 border-b pb-4 last:border-0">
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">{appointment.patient_name}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        {appointment.appointment_date ? format(new Date(appointment.appointment_date), 'dd MMM yyyy, HH:mm', { locale: id }) : 'Tanggal tidak tersedia'}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Dokter: {appointment.doctor?.name || 'Tidak tersedia'}
                      </p>
                    </div>
                    <Badge variant={appointment.status === 'active' ? 'default' : 'outline'}>
                      {appointment.status === 'active' ? 'Aktif' : appointment.status === 'completed' ? 'Selesai' : 'Dibatalkan'}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">Belum ada janji temu</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Doctors List */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Dokter</CardTitle>
              <CardDescription>Daftar dokter di rumah sakit</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/doctors">
                Lihat Semua <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctors.length > 0 ? (
                doctors.map((doctor) => (
                  <div key={doctor.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={doctor.photo_url || ''} alt={doctor.name} />
                      <AvatarFallback>{doctor.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{doctor.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {doctor.specialization?.name || 'Spesialis tidak tersedia'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4 col-span-3">Belum ada dokter</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
