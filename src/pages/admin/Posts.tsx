import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar as CalendarIcon, Edit, Plus, Search, Trash } from "lucide-react";
import { format } from "date-fns";
import id from "date-fns/locale/id";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
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

interface Post {
  id: string;
  title: string;
  content: string;
  category: { id: string; name: string };
  author?: { id: string; full_name?: string; email?: string };
  publish_date?: string;
  status: 'draft' | 'published';
  summary?: string;
  image_url?: string;
}

interface Category {
  id: string;
  name: string;
}

interface Profile {
  id: string;
  full_name: string;
  email?: string;
}

export default function Posts() {
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"all" | "published" | "draft">("all");
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [deletePostId, setDeletePostId] = useState<string | null>(null); // State untuk dialog hapus
  
  const [newPost, setNewPost] = useState<Partial<Post>>({
    title: "",
    content: "",
    category: { id: "", name: "" },
    author: user ? { id: user.id, email: user.email, full_name: user.user_metadata?.full_name } : undefined,
    status: "draft",
    publish_date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (!user) return;

    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');
      if (error) {
        toast({
          title: "Kesalahan",
          description: "Gagal mengambil data kategori: " + error.message,
          variant: "destructive",
        });
        console.error("Fetch categories error:", error);
      } else {
        setCategories(data);
        if (data.length > 0) {
          setNewPost((prev) => ({ ...prev, category: { id: data[0].id, name: data[0].name } }));
        }
        console.log("Categories fetched:", data);
      }
    };

    const fetchProfiles = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .order('full_name');
      if (error) {
        toast({
          title: "Kesalahan",
          description: "Gagal mengambil data pengguna: " + error.message,
          variant: "destructive",
        });
        console.error("Fetch profiles error:", error);
      } else {
        setProfiles(data);
        console.log("Profiles fetched:", data);
      }
    };

    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id, title, content, status, publish_date, summary, image_url,
          category:categories(id, name),
          author:profiles(id, full_name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        toast({
          title: "Kesalahan",
          description: `Gagal mengambil data postingan: ${error.message}. Detail: ${error.details || 'Tidak ada detail'}`,
          variant: "destructive",
        });
        console.error("Fetch posts error:", error);
        return;
      }

      setPosts(data.map(post => ({
        ...post,
        author: post.author ? {
          id: post.author.id,
          full_name: post.author.full_name || undefined,
          email: user.email || undefined,
        } : undefined,
      })));
      console.log("Posts fetched:", data);
    };

    fetchCategories();
    fetchProfiles();
    fetchPosts();
  }, [user, toast]);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (post.author?.full_name || post.author?.email || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || post.category.id === selectedCategory;
    const matchesStatus = activeTab === "all" ||
                         (activeTab === "published" && post.status === "published") ||
                         (activeTab === "draft" && post.status === "draft");
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Belum Dipublikasikan";
    try {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('id-ID', options);
    } catch {
      return "Tanggal Tidak Valid";
    }
  };

  const handleImageUpload = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `post-${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage
      .from('post-images')
      .upload(fileName, file);
    
    if (error) {
      toast({
        title: "Kesalahan",
        description: "Gagal mengunggah gambar: " + error.message,
        variant: "destructive",
      });
      console.error("Upload error:", error);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from('post-images')
      .getPublicUrl(fileName);
    
    return publicUrlData.publicUrl;
  };

  const handleAddPost = async () => {
    if (!newPost.title || !newPost.content || !newPost.category?.id) {
      toast({
        title: "Informasi Kurang",
        description: "Harap isi judul, konten, dan kategori.",
        variant: "destructive",
      });
      return;
    }

    let imageUrl = newPost.image_url;
    if (imageFile) {
      imageUrl = await handleImageUpload(imageFile);
      if (!imageUrl) return;
    }

    const postToAdd = {
      title: newPost.title,
      content: newPost.content,
      category_id: newPost.category.id,
      author_id: newPost.author?.id || null,
      status: newPost.status || 'draft',
      publish_date: newPost.publish_date || null,
      summary: newPost.summary || null,
      image_url: imageUrl || null,
    };

    const { data, error } = await supabase
      .from('posts')
      .insert([postToAdd])
      .select(`
        id, title, content, status, publish_date, summary, image_url,
        category:categories(id, name),
        author:profiles(id, full_name)
      `)
      .single();

    if (error) {
      toast({
        title: "Kesalahan",
        description: "Gagal menambah postingan: " + error.message,
        variant: "destructive",
      });
      console.error("Insert error:", error);
      return;
    }

    if (!data) {
      toast({
        title: "Kesalahan",
        description: "Tidak ada data yang dikembalikan setelah menambah postingan.",
        variant: "destructive",
      });
      return;
    }

    setPosts([{ 
      ...data, 
      author: data.author ? {
        id: data.author.id,
        full_name: data.author.full_name || undefined,
        email: profiles.find(p => p.id === data.author?.id)?.email || undefined,
      } : undefined
    }, ...posts]);
    toast({
      title: "Postingan Ditambahkan",
      description: `Postingan telah ditambahkan sebagai ${data.status === 'published' ? 'Dipublikasikan' : 'Draft'}.`,
    });
    setNewPost({
      title: "",
      content: "",
      category: categories[0] ? { id: categories[0].id, name: categories[0].name } : { id: "", name: "" },
      author: user ? { id: user.id, email: user.email, full_name: user.user_metadata?.full_name } : undefined,
      status: "draft",
      publish_date: new Date().toISOString().split('T')[0],
    });
    setImageFile(null);
  };

  const handleUpdatePost = async () => {
    if (!editingPost) return;

    let imageUrl = editingPost.image_url;
    if (imageFile) {
      imageUrl = await handleImageUpload(imageFile);
      if (!imageUrl) return;
    }

    const { data, error } = await supabase
      .from('posts')
      .update({
        title: editingPost.title,
        content: editingPost.content,
        category_id: editingPost.category.id,
        author_id: editingPost.author?.id || null,
        status: editingPost.status,
        publish_date: editingPost.publish_date || null,
        summary: editingPost.summary || null,
        image_url: imageUrl || null,
      })
      .eq('id', editingPost.id)
      .select(`
        id, title, content, status, publish_date, summary, image_url,
        category:categories(id, name),
        author:profiles(id, full_name)
      `)
      .single();

    if (error) {
      toast({
        title: "Kesalahan",
        description: "Gagal memperbarui postingan: " + error.message,
        variant: "destructive",
      });
      console.error("Update error:", error);
      return;
    }

    if (!data) {
      toast({
        title: "Kesalahan",
        description: "Tidak ada data yang dikembalikan setelah memperbarui postingan.",
        variant: "destructive",
      });
      return;
    }

    setPosts(posts.map(post => post.id === data.id ? { 
      ...data, 
      author: data.author ? {
        id: data.author.id,
        full_name: data.author.full_name || undefined,
        email: profiles.find(p => p.id === data.author?.id)?.email || undefined,
      } : undefined
    } : post));
    toast({
      title: "Postingan Diperbarui",
      description: "Postingan telah diperbarui.",
    });
    setEditingPost(null);
    setImageFile(null);
  };

  const confirmDeletePost = async () => {
    if (!deletePostId) return;

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', deletePostId);
    
    if (error) {
      toast({
        title: "Kesalahan",
        description: "Gagal menghapus postingan: " + error.message,
        variant: "destructive",
      });
      console.error("Delete error:", error);
      return;
    }

    setPosts(posts.filter(post => post.id !== deletePostId));
    toast({
      title: "Postingan Dihapus",
      description: "Postingan telah dihapus.",
    });
    setDeletePostId(null); // Reset state setelah penghapusan
  };

  if (loading) return <div className="p-4">Memuat...</div>;
  if (!user) return <div className="p-4">Harap login untuk mengakses halaman ini.</div>;

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Kelola Postingan</h1>
        <div className="flex gap-2">
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Cari Postingan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-full md:w-[200px]"
            />
          </div>
        </div>
      </div>
      
      {!editingPost ? (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Buat Postingan Baru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Judul
                </label>
                <Input
                  id="title"
                  placeholder="Judul Postingan"
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Kategori
                  </label>
                  <Select
                    value={newPost.category?.id}
                    onValueChange={(value) => {
                      const selected = categories.find(c => c.id === value);
                      setNewPost({...newPost, category: selected ? { id: selected.id, name: selected.name } : { id: "", name: "" }});
                    }}
                    disabled={categories.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={categories.length === 0 ? "Tidak ada kategori" : "Pilih Kategori"} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                    Penulis
                  </label>
                  <Select
                    value={newPost.author?.id}
                    onValueChange={(value) => {
                      const selected = profiles.find(p => p.id === value);
                      setNewPost({
                        ...newPost,
                        author: selected ? { id: selected.id, full_name: selected.full_name, email: selected.email } : undefined
                      });
                    }}
                    disabled={profiles.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={profiles.length === 0 ? "Tidak ada penulis" : "Pilih Penulis"} />
                    </SelectTrigger>
                    <SelectContent>
                      {profiles.map((profile) => (
                        <SelectItem key={profile.id} value={profile.id}>
                          {profile.full_name || "Anonim"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label htmlFor="publishDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Publikasi
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="publishDate"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !newPost.publish_date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newPost.publish_date ? (
                        format(new Date(newPost.publish_date), "PPP", { locale: id })
                      ) : (
                        <span>Pilih tanggal</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={newPost.publish_date ? new Date(newPost.publish_date) : undefined}
                      onSelect={(date) => 
                        setNewPost({
                          ...newPost, 
                          publish_date: date ? date.toISOString().split('T')[0] : undefined
                        })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
                  Ringkasan (opsional)
                </label>
                <Input
                  id="summary"
                  placeholder="Ringkasan singkat"
                  value={newPost.summary || ""}
                  onChange={(e) => setNewPost({...newPost, summary: e.target.value})}
                />
              </div>
              
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                  Gambar (opsional)
                </label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
              </div>
              
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  Konten
                </label>
                <Textarea
                  id="content"
                  placeholder="Tulis konten postingan di sini..."
                  rows={8}
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Status</label>
                    <Select
                      value={newPost.status}
                      onValueChange={(value) => setNewPost({
                        ...newPost, 
                        status: value as "draft" | "published",
                        publish_date: value === "published" && !newPost.publish_date 
                          ? new Date().toISOString().split('T')[0] 
                          : newPost.publish_date
                      })}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Dipublikasikan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button onClick={handleAddPost}>
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Postingan
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Edit Postingan</CardTitle>
            <Button variant="outline" onClick={() => {
              setEditingPost(null);
              setImageFile(null);
            }}>
              Batal
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="editTitle" className="block text-sm font-medium text-gray-700 mb-1">
                  Judul
                </label>
                <Input
                  id="editTitle"
                  value={editingPost.title}
                  onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="editCategory" className="block text-sm font-medium text-gray-700 mb-1">
                    Kategori
                  </label>
                  <Select
                    value={editingPost.category.id}
                    onValueChange={(value) => {
                      const selected = categories.find(c => c.id === value);
                      setEditingPost({...editingPost, category: selected ? { id: selected.id, name: selected.name } : editingPost.category});
                    }}
                    disabled={categories.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label htmlFor="editAuthor" className="block text-sm font-medium text-gray-700 mb-1">
                    Penulis
                  </label>
                  <Select
                    value={editingPost.author?.id}
                    onValueChange={(value) => {
                      const selected = profiles.find(p => p.id === value);
                      setEditingPost({
                        ...editingPost,
                        author: selected ? { id: selected.id, full_name: selected.full_name, email: selected.email } : undefined
                      });
                    }}
                    disabled={profiles.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={profiles.length === 0 ? "Tidak ada penulis" : "Pilih Penulis"} />
                    </SelectTrigger>
                    <SelectContent>
                      {profiles.map((profile) => (
                        <SelectItem key={profile.id} value={profile.id}>
                          {profile.full_name || "Anonim"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label htmlFor="editPublishDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Publikasi
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="editPublishDate"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !editingPost.publish_date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {editingPost.publish_date ? (
                        format(new Date(editingPost.publish_date), "PPP", { locale: id })
                      ) : (
                        <span>Pilih tanggal</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={editingPost.publish_date ? new Date(editingPost.publish_date) : undefined}
                      onSelect={(date) => 
                        setEditingPost({
                          ...editingPost, 
                          publish_date: date ? date.toISOString().split('T')[0] : undefined
                        })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <label htmlFor="editSummary" className="block text-sm font-medium text-gray-700 mb-1">
                  Ringkasan
                </label>
                <Input
                  id="editSummary"
                  value={editingPost.summary || ""}
                  onChange={(e) => setEditingPost({...editingPost, summary: e.target.value})}
                />
              </div>
              
              <div>
                <label htmlFor="editImage" className="block text-sm font-medium text-gray-700 mb-1">
                  Gambar
                </label>
                <Input
                  id="editImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
                {editingPost.image_url && (
                  <img src={editingPost.image_url} alt="Preview" className="mt-2 h-24 w-auto" />
                )}
              </div>
              
              <div>
                <label htmlFor="editContent" className="block text-sm font-medium text-gray-700 mb-1">
                  Konten
                </label>
                <Textarea
                  id="editContent"
                  rows={8}
                  value={editingPost.content}
                  onChange={(e) => setEditingPost({...editingPost, content: e.target.value})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Status</label>
                  <Select
                    value={editingPost.status}
                    onValueChange={(value) => setEditingPost({
                      ...editingPost, 
                      status: value as "draft" | "published",
                      publish_date: value === "published" && !editingPost.publish_date 
                        ? new Date().toISOString().split('T')[0] 
                        : editingPost.publish_date
                    })}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Dipublikasikan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button onClick={handleUpdatePost}>
                  Perbarui Postingan
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Tabs defaultValue="all" onValueChange={(value) => setActiveTab(value as "all" | "published" | "draft")}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">Semua Postingan</TabsTrigger>
          <TabsTrigger value="published">Dipublikasikan</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {renderPostsList(filteredPosts)}
        </TabsContent>
        
        <TabsContent value="published" className="space-y-4">
          {renderPostsList(filteredPosts)}
        </TabsContent>
        
        <TabsContent value="draft" className="space-y-4">
          {renderPostsList(filteredPosts)}
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
  
  function renderPostsList(posts: Post[]) {
    if (posts.length === 0) {
      return (
        <div className="bg-gray-50 border rounded-lg p-8 text-center">
          <CalendarIcon className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">Tidak Ada Postingan</h3>
          <p className="text-gray-500 mb-4">
            Tidak ada postingan yang cocok dengan kriteria pencarian Anda.
          </p>
        </div>
      );
    }
    
    return posts.map(post => (
      <Card key={post.id} className="overflow-hidden hover:shadow-sm transition-shadow">
        <div className="flex flex-col md:flex-row">
          {post.image_url && (
            <div className="md:w-48 h-32 md:h-auto overflow-hidden">
              <img 
                src={post.image_url} 
                alt={post.title} 
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <CardContent className={`p-4 flex-grow ${post.image_url ? '' : 'md:w-full'}`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
              <h3 className="font-semibold text-lg mb-2 md:mb-0">{post.title}</h3>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded ${
                  post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {post.status === 'published' ? 'Dipublikasikan' : 'Draft'}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setEditingPost(post)} 
                  className="text-gray-500 hover:text-primary"
                >
                  <Edit size={16} />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setDeletePostId(post.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash size={16} />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
                      <AlertDialogDescription>
                        Apakah Anda yakin ingin menghapus postingan "{post.title}"? Tindakan ini tidak dapat dibatalkan.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setDeletePostId(null)}>Batal</AlertDialogCancel>
                      <AlertDialogAction onClick={confirmDeletePost}>Hapus</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="text-xs bg-secondary px-2 py-1 rounded">
                {post.category.name}
              </span>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">{post.summary || post.content.substring(0, 100) + '...'}</p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Oleh {post.author?.full_name || post.author?.email || "Anonim"}</span>
              <span>{formatDate(post.publish_date)}</span>
            </div>
          </CardContent>
        </div>
      </Card>
    ));
  }
}