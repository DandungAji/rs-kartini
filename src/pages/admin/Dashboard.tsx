
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLayout from "@/components/admin/AdminLayout";
import { doctors, schedules, posts } from "@/lib/mockData";
import { Calendar, File, User } from "lucide-react";

export default function Dashboard() {
  // Count published posts
  const publishedPosts = posts.filter(post => post.status === "published").length;
  
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Doctors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <User className="h-6 w-6 text-primary mr-2" />
              <span className="text-3xl font-bold">{doctors.length}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Schedules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-6 w-6 text-primary mr-2" />
              <span className="text-3xl font-bold">{schedules.length}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Published Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <File className="h-6 w-6 text-primary mr-2" />
              <span className="text-3xl font-bold">{publishedPosts}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Draft Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <File className="h-6 w-6 text-gray-400 mr-2" />
              <span className="text-3xl font-bold">{posts.length - publishedPosts}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Doctors Added</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {doctors.slice(0, 5).map(doctor => (
                <div key={doctor.id} className="flex items-center">
                  <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                    <img 
                      src={doctor.imageUrl || "https://via.placeholder.com/40"} 
                      alt={doctor.name} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{doctor.name}</p>
                    <p className="text-sm text-gray-500">{doctor.specialization}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {posts.slice(0, 5).map(post => (
                <div key={post.id} className="flex items-center">
                  <div className="h-10 w-10 bg-secondary rounded-full flex items-center justify-center mr-3">
                    <File size={16} className="text-primary" />
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium">{post.title}</p>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{post.author}</span>
                      <span className="bg-gray-100 px-2 py-0.5 rounded">
                        {post.status}
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
