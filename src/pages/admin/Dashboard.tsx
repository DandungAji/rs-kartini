import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase";
import { Calendar, File, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Doctor {
  id: string;
  name: string;
  specialization?: { name: string };
  photo_url?: string;
}

interface Post {
  id: string;
  title: string;
  author?: { email: string };
  status: 'draft' | 'published';
}

interface Stats {
  totalDoctors: number;
  totalSchedules: number;
  publishedPosts: number;
  draftPosts: number;
}

export default function Dashboard() {
  const { toast } = useToast();
  const [stats, setStats] = useState<Stats>({ totalDoctors: 0, totalSchedules: 0, publishedPosts: 0, draftPosts: 0 });
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  // Fetch data on mount
  useEffect(() => {
    const fetchStats = async () => {
      const [doctorsCount, schedulesCount, publishedPostsCount, draftPostsCount] = await Promise.all([
        supabase.from('doctors').select('count', { count: 'exact' }).single(),
        supabase.from('schedules').select('count', { count: 'exact' }).single(),
        supabase.from('posts').select('count', { count: 'exact' }).eq('status', 'published').single(),
        supabase.from('posts').select('count', { count: 'exact' }).eq('status', 'draft').single(),
      ]);

      setStats({
        totalDoctors: doctorsCount.data?.count || 0,
        totalSchedules: schedulesCount.data?.count || 0,
        publishedPosts: publishedPostsCount.data?.count || 0,
        draftPosts: draftPostsCount.data?.count || 0,
      });

      if (doctorsCount.error || schedulesCount.error || publishedPostsCount.error || draftPostsCount.error) {
        toast({
          title: "Error",
          description: "Gagal mengambil statistik.",
          variant: "destructive",
        });
      }
    };

    const fetchDoctors = async () => {
      const { data, error } = await supabase
        .from('doctors')
        .select('id, name, specializations(name), photo_url')
        .order('created_at', { ascending: false })
        .limit(5);
      
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

    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, author:auth.users(email), status')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) {
        toast({
          title: "Error",
          description: "Gagal mengambil data postingan.",
          variant: "destructive",
        });
      } else {
        setPosts(data);
      }
    };

    fetchStats();
    fetchDoctors();
    fetchPosts();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Dokter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <User className="h-6 w-6 text-primary mr-2" />
              <span className="text-3xl font-bold">{stats.totalDoctors}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Jadwal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-6 w-6 text-primary mr-2" />
              <span className="text-3xl font-bold">{stats.totalSchedules}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Postingan Dipublikasikan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <File className="h-6 w-6 text-primary mr-2" />
              <span className="text-3xl font-bold">{stats.publishedPosts}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Postingan Draft</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <File className="h-6 w-6 text-gray-400 mr-2" />
              <span className="text-3xl font-bold">{stats.draftPosts}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Dokter Terbaru Ditambahkan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {doctors.map(doctor => (
                <div key={doctor.id} className="flex items-center">
                  <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                    <img 
                      src={doctor.photo_url || "https://via.placeholder.com/40"} 
                      alt={doctor.name} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{doctor.name}</p>
                    <p className="text-sm text-gray-500">{doctor.specialization?.name || '-'}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Postingan Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {posts.map(post => (
                <div key={post.id} className="flex items-center">
                  <div className="h-10 w-10 bg-secondary rounded-full flex items-center justify-center mr-3">
                    <File size={16} className="text-primary" />
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium">{post.title}</p>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{post.author?.email || 'Unknown'}</span>
                      <span className="bg-gray-100 px-2 py-0.5 rounded">
                        {post.status === 'published' ? 'Dipublikasikan' : 'Draft'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}