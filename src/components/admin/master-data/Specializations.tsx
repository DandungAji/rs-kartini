import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Plus, Trash } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

interface Specialization {
  id: string;
  name: string;
  description?: string;
}

export function Specializations() {
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSpecialization, setCurrentSpecialization] = useState<Specialization | null>(null);
  const { toast } = useToast();

  // Fetch specializations on mount
  useEffect(() => {
    const fetchSpecializations = async () => {
      const { data, error } = await supabase
        .from('specializations')
        .select('id, name, description')
        .order('name');
      if (error) {
        toast({
          title: "Error",
          description: "Gagal mengambil data spesialisasi.",
          variant: "destructive",
        });
      } else {
        setSpecializations(data);
      }
    };
    fetchSpecializations();
  }, []);

  const filteredSpecializations = specializations.filter((specialization) =>
    specialization.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (specialization.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  const handleAdd = () => {
    setCurrentSpecialization({ id: "", name: "", description: "" });
    setIsDialogOpen(true);
  };

  const handleEdit = (specialization: Specialization) => {
    setCurrentSpecialization({ ...specialization });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('specializations')
      .delete()
      .eq('id', id);
    
    if (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus spesialisasi.",
        variant: "destructive",
      });
    } else {
      setSpecializations(specializations.filter((s) => s.id !== id));
      toast({
        title: "Specialization deleted",
        description: "Spesialisasi berhasil dihapus.",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentSpecialization) return;

    if (currentSpecialization.id) {
      // Update existing
      const { data, error } = await supabase
        .from('specializations')
        .update({ name: currentSpecialization.name, description: currentSpecialization.description })
        .eq('id', currentSpecialization.id)
        .select()
        .single();
      
      if (error) {
        toast({
          title: "Error",
          description: "Gagal memperbarui spesialisasi.",
          variant: "destructive",
        });
      } else {
        setSpecializations(specializations.map((s) => s.id === data.id ? data : s));
        toast({
          title: "Specialization updated",
          description: "Spesialisasi berhasil diperbarui.",
        });
        setIsDialogOpen(false);
      }
    } else {
      // Add new
      const { data, error } = await supabase
        .from('specializations')
        .insert([{ name: currentSpecialization.name, description: currentSpecialization.description }])
        .select()
        .single();
      
      if (error) {
        toast({
          title: "Error",
          description: "Gagal menambah spesialisasi.",
          variant: "destructive",
        });
      } else {
        setSpecializations([...specializations, data]);
        toast({
          title: "Specialization added",
          description: "Spesialisasi baru berhasil ditambahkan.",
        });
        setIsDialogOpen(false);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Cari spesialisasi..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Spesialisasi
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead className="w-[100px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSpecializations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  Tidak ada spesialisasi ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              filteredSpecializations.map((specialization) => (
                <TableRow key={specialization.id}>
                  <TableCell className="font-medium">{specialization.name}</TableCell>
                  <TableCell>{specialization.description || '-'}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(specialization)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(specialization.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
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
              {currentSpecialization?.id ? "Edit Spesialisasi" : "Tambah Spesialisasi"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name">Nama</label>
                <Input
                  id="name"
                  value={currentSpecialization?.name || ""}
                  onChange={(e) =>
                    setCurrentSpecialization(
                      (prev) => prev && { ...prev, name: e.target.value }
                    )
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description">Deskripsi</label>
                <Textarea
                  id="description"
                  value={currentSpecialization?.description || ""}
                  onChange={(e) =>
                    setCurrentSpecialization(
                      (prev) => prev && { ...prev, description: e.target.value }
                    )
                  }
                  rows={3}
                />
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