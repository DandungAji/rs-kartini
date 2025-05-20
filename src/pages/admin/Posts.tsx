
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
import { Calendar, Edit, Search, Plus, Trash } from "lucide-react";
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
import { Post, ensureObject } from "@/lib/types";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface Category {
  id: string;
  name: string;
}

interface User {
  id: string;
  full_name: string;
  email: string;
}

export default function Posts() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [newPost, setNewPost] = useState<Partial<Post>>({
    title: "",
    content: "",
    status: "draft",
    publish_date: new Date().toISOString().split('T')[0],
    summary: "",
    image_url: "",
    author: { id: "", full_name: "", email: "" },
    category: { id: "", name: "" }
  });

  const [deletePostId, setDeletePostId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id, 
          title,
          content,
          status,
          publish_date,
          summary,
          image_url,
          author:users (
            id,
            full_name,
            email
          ),
          category:post_categories (
            id,
            name
          )
        `);
      if (error) {
        toast({
          title: "Kesalahan",
          description: "Gagal mengambil data posting: " + error.message,
          variant: "destructive",
        });
        console.error("Fetch posts error:", error);
      } else {
        const processedPosts = data.map((post: any) => ({
          ...post,
          author: ensureObject(post.author),
          category: ensureObject(post.category)
        }));
        setPosts(processedPosts);
      }
    };

    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id, full_name, email');
      if (error) {
        toast({
          title: "Kesalahan",
          description: "Gagal mengambil data pengguna: " + error.message,
          variant: "destructive",
        });
        console.error("Fetch users error:", error);
      } else {
        setUsers(data);
        if (data.length > 0) {
          setNewPost(prev => ({
            ...prev,
            author: {
              id: data[0].id,
              full_name: data[0].full_name,
              email: data[0].email
            }
          }));
        }
        console.log("Users fetched:", data);
      }
    };

    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('post_categories')
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
          setNewPost(prev => ({
            ...prev,
            category: {
              id: data[0].id,
              name: data[0].name
            }
          }));
        }
        console.log("Categories fetched:", data);
      }
    };

    fetchPosts();
    fetchUsers();
    fetchCategories();
  }, [user]);

  const filteredPosts = posts.filter((post) => {
    const categoryMatch = selectedCategory === "all" || post.category.id === selectedCategory;
    const searchMatch =
      !searchTerm ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    return categoryMatch && searchMatch;
  });

  const handleAddPost = async () => {
    if (!newPost.title || !newPost.content || !newPost.category?.id || !newPost.author?.id) {
      toast({
        title: "Informasi Kurang",
        description: "Harap isi judul, konten, kategori, dan penulis.",
        variant: "destructive",
      });
      return;
    }

    const { data, error } = await supabase
      .from('posts')
      .insert([{
        title: newPost.title,
        content: newPost.content,
        status: newPost.status,
        publish_date: newPost.publish_date,
        summary: newPost.summary,
        image_url: newPost.image_url,
        author_id: newPost.author.id,
        category_id: newPost.category.id
      }])
      .select(`
        id, 
        title,
        content,
        status,
        publish_date,
        summary,
        image_url,
        author:users (
          id,
          full_name,
          email
        ),
        category:post_categories (
          id,
          name
        )
      `)
      .single();

    if (error) {
      toast({
        title: "Kesalahan",
        description: "Gagal menambah posting: " + error.message,
        variant: "destructive",
      });
      console.error("Insert error:", error);
    } else {
      const newPostData = {
        ...data,
        author: ensureObject(data.author),
        category: ensureObject(data.category)
      };
      setPosts([...posts, newPostData as Post]);
      toast({
        title: "Posting Ditambahkan",
        description: "Posting berhasil ditambahkan.",
      });
      setNewPost({
        title: "",
        content: "",
        status: "draft",
        publish_date: new Date().toISOString().split('T')[0],
        summary: "",
        image_url: "",
        author: { id: users[0]?.id || "", full_name: users[0]?.full_name || "", email: users[0]?.email || "" },
        category: { id: categories[0]?.id || "", name: categories[0]?.name || "" }
      });
      setIsDialogOpen(false);
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPost({ ...post });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingPost) return;

    const { data, error } = await supabase
      .from('posts')
      .update({
        title: editingPost.title,
        content: editingPost.content,
        status: editingPost.status,
        publish_date: editingPost.publish_date,
        summary: editingPost.summary,
        image_url: editingPost.image_url,
        author_id: editingPost.author.id,
        category_id: editingPost.category.id
      })
      .eq('id', editingPost.id)
      .select(`
        id, 
        title,
        content,
        status,
        publish_date,
        summary,
        image_url,
        author:users (
          id,
          full_name,
          email
        ),
        category:post_categories (
          id,
          name
        )
      `)
      .single();

    if (error) {
      toast({
        title: "Kesalahan",
        description: "Gagal memperbarui posting: " + error.message,
        variant: "destructive",
      });
      console.error("Update error:", error);
    } else {
      const updatedPost = {
        ...data,
        author: ensureObject(data.author),
        category: ensureObject(data.category)
      };
      setPosts(posts.map(p => p.id === data.id ? updatedPost as Post : p));
      toast({
        title: "Posting Diperbarui",
        description: "Posting berhasil diperbarui.",
      });
      setIsDialogOpen(false);
      setEditingPost(null);
    }
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
        description: "Gagal menghapus posting: " + error.message,
        variant: "destructive",
      });
      console.error("Delete error:", error);
    } else {
      setPosts(posts.filter(p => p.id !== deletePostId));
      toast({
        title: "Posting Dihapus",
        description: "Posting berhasil dihapus.",
      });
    }
    setDeletePostId(null);
  };

  if (loading) return <div className="p-4">Memuat...</div>;
  if (!user) return <div className="p-4">Harap login untuk mengakses halaman ini.</div>;

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Kelola Artikel</h1>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            placeholder="Cari artikel..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-4">
          <div className="w-[180px]">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Semua kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua kategori</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Add Post Button */}
      <div className="mb-6">
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingPost(null);
          }
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Artikel
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPost ? "Edit Artikel" : "Tambah Artikel"}</DialogTitle>
              <DialogDescription>
                {editingPost ? "Perbarui detail artikel di bawah ini." : "Isi detail artikel baru."}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Judul
                </Label>
                <div className="col-span-3">
                  <Input
                    id="title"
                    placeholder="Judul artikel"
                    value={editingPost ? editingPost.title : newPost.title}
                    onChange={(e) =>
                      editingPost
                        ? setEditingPost((prev) => (prev ? { ...prev, title: e.target.value } : null))
                        : setNewPost({ ...newPost, title: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="content" className="text-right mt-2">
                  Konten
                </Label>
                <div className="col-span-3">
                  <ReactQuill
                    theme="snow"
                    value={editingPost ? editingPost.content : newPost.content}
                    onChange={(content) =>
                      editingPost
                        ? setEditingPost((prev) => (prev ? { ...prev, content } : null))
                        : setNewPost({ ...newPost, content })
                    }
                    className="h-[200px] mb-12"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="summary" className="text-right">
                  Ringkasan
                </Label>
                <div className="col-span-3">
                  <Input
                    id="summary"
                    placeholder="Ringkasan singkat artikel"
                    value={editingPost ? editingPost.summary : newPost.summary}
                    onChange={(e) =>
                      editingPost
                        ? setEditingPost((prev) => (prev ? { ...prev, summary: e.target.value } : null))
                        : setNewPost({ ...newPost, summary: e.target.value })
                    }
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image_url" className="text-right">
                  URL Gambar
                </Label>
                <div className="col-span-3">
                  <Input
                    id="image_url"
                    placeholder="URL gambar artikel"
                    value={editingPost ? editingPost.image_url : newPost.image_url}
                    onChange={(e) =>
                      editingPost
                        ? setEditingPost((prev) => (prev ? { ...prev, image_url: e.target.value } : null))
                        : setNewPost({ ...newPost, image_url: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Kategori
                </Label>
                <div className="col-span-3">
                  <Select
                    value={editingPost ? editingPost.category.id : newPost.category?.id}
                    onValueChange={(value) => {
                      const selectedCategory = categories.find(cat => cat.id === value) || { id: value, name: "" };
                      
                      if (editingPost) {
                        setEditingPost((prev) => (prev ? { 
                          ...prev, 
                          category: { 
                            id: selectedCategory.id, 
                            name: selectedCategory.name 
                          } 
                        } : null));
                      } else {
                        setNewPost({ 
                          ...newPost, 
                          category: { 
                            id: selectedCategory.id, 
                            name: selectedCategory.name 
                          } 
                        });
                      }
                    }}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Pilih Kategori" />
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
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="author" className="text-right">
                  Penulis
                </Label>
                <div className="col-span-3">
                  <Select
                    value={editingPost ? editingPost.author.id : newPost.author?.id}
                    onValueChange={(value) => {
                      const selectedUser = users.find(u => u.id === value) || { id: value, full_name: "", email: "" };
                      
                      if (editingPost) {
                        setEditingPost((prev) => (prev ? { 
                          ...prev, 
                          author: { 
                            id: selectedUser.id, 
                            full_name: selectedUser.full_name,
                            email: selectedUser.email
                          } 
                        } : null));
                      } else {
                        setNewPost({ 
                          ...newPost, 
                          author: { 
                            id: selectedUser.id, 
                            full_name: selectedUser.full_name,
                            email: selectedUser.email
                          } 
                        });
                      }
                    }}
                  >
                    <SelectTrigger id="author">
                      <SelectValue placeholder="Pilih Penulis" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="publish_date" className="text-right">
                  Tanggal Publikasi
                </Label>
                <div className="col-span-3">
                  <Input
                    type="date"
                    id="publish_date"
                    value={editingPost ? editingPost.publish_date : newPost.publish_date}
                    onChange={(e) =>
                      editingPost
                        ? setEditingPost((prev) => (prev ? { ...prev, publish_date: e.target.value } : null))
                        : setNewPost({ ...newPost, publish_date: e.target.value })
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
                    checked={editingPost ? editingPost.status === "published" : newPost.status === "published"}
                    onCheckedChange={(checked) =>
                      editingPost
                        ? setEditingPost((prev) =>
                            prev ? { ...prev, status: checked ? "published" : "draft" } : null
                          )
                        : setNewPost({ ...newPost, status: checked ? "published" : "draft" })
                    }
                  />
                  <span>
                    {editingPost
                      ? editingPost.status === "published" ? "Published" : "Draft"
                      : newPost.status === "published" ? "Published" : "Draft"}
                  </span>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  setEditingPost(null);
                }}
              >
                Batal
              </Button>
              <Button onClick={editingPost ? handleSave : handleAddPost}>
                {editingPost ? "Simpan Perubahan" : "Tambah Artikel"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Post Table */}
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Judul</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Penulis</TableHead>
              <TableHead>Tanggal Publikasi</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right w-[120px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>{post.category.name}</TableCell>
                  <TableCell>{post.author.full_name}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-primary" />
                      <span>{post.publish_date}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={post.status === "published" ? "default" : "outline"}
                      className={cn(
                        post.status === "published"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                      )}
                    >
                      {post.status === "published" ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(post)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletePostId(post.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
                          <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus artikel berjudul "{post.title}"? Tindakan ini tidak dapat dibatalkan.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setDeletePostId(null)}>
                            Batal
                          </AlertDialogCancel>
                          <AlertDialogAction onClick={confirmDeletePost}>
                            Hapus
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Tidak ada artikel ditemukan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}
