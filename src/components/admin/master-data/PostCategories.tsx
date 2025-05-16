import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pencil, Plus, Trash } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
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

interface PostCategory {
  id: string;
  name: string;
  slug: string;
}

export function PostCategories() {
  const [categories, setCategories] = useState<PostCategory[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentCategory, setCurrentCategory] = useState<PostCategory | null>(null);
  const { toast } = useToast();

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug')
        .order('name');
      if (error) {
        toast({
          title: "Error",
          description: "Gagal mengambil data kategori.",
          variant: "destructive",
        });
      } else {
        setCategories(data);
      }
    };
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setCurrentCategory({ id: "", name: "", slug: "" });
    setIsDialogOpen(true);
  };

  const handleEdit = (category: PostCategory) => {
    setCurrentCategory({ ...category });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus kategori.",
        variant: "destructive",
      });
    } else {
      setCategories(categories.filter((c) => c.id !== id));
      toast({
        title: "Category deleted",
        description: "Kategori berhasil dihapus.",
      });
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  const handleNameChange = (name: string) => {
    if (!currentCategory) return;
    
    const shouldUpdateSlug = !currentCategory.id || 
      currentCategory.slug === generateSlug(currentCategory.name) ||
      currentCategory.slug === "";
      
    setCurrentCategory({
      ...currentCategory,
      name,
      slug: shouldUpdateSlug ? generateSlug(name) : currentCategory.slug
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentCategory) return;

    if (currentCategory.id) {
      // Update existing
      const { data, error } = await supabase
        .from('categories')
        .update({ name: currentCategory.name, slug: currentCategory.slug })
        .eq('id', currentCategory.id)
        .select()
        .single();
      
      if (error) {
        toast({
          title: "Error",
          description: "Gagal memperbarui kategori.",
          variant: "destructive",
        });
      } else {
        setCategories(categories.map((c) => c.id === data.id ? data : c));
        toast({
          title: "Category updated",
          description: "Kategori berhasil diperbarui.",
        });
        setIsDialogOpen(false);
      }
    } else {
      // Add new
      const { data, error } = await supabase
        .from('categories')
        .insert([{ name: currentCategory.name, slug: currentCategory.slug }])
        .select()
        .single();
      
      if (error) {
        toast({
          title: "Error",
          description: "Gagal menambah kategori.",
          variant: "destructive",
        });
      } else {
        setCategories([...categories, data]);
        toast({
          title: "Category added",
          description: "Kategori baru berhasil ditambahkan.",
        });
        setIsDialogOpen(false);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Cari kategori..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Kategori
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="w-[100px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  Tidak ada kategori ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.slug}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(category)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
                            <AlertDialogDescription>
                              Apakah Anda yakin ingin menghapus kategori {category.name}? Tindakan ini tidak dapat dibatalkan.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(category.id)}>Hapus</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentCategory?.id ? "Edit Kategori" : "Tambah Kategori"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name">Nama</label>
                <Input
                  id="name"
                  value={currentCategory?.name || ""}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="slug">Slug</label>
                <Input
                  id="slug"
                  value={currentCategory?.slug || ""}
                  onChange={(e) =>
                    setCurrentCategory(
                      (prev) => prev && { ...prev, slug: e.target.value }
                    )
                  }
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Digunakan dalam URL. Otomatis dibuat dari nama jika dikosongkan.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>
                Batal
              </Button>
              <Button type="submit">Simpan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}