
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Plus, Trash } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Initial specializations data
const initialSpecializations = [
  { id: "1", name: "Cardiology", description: "Deals with disorders of the heart and blood vessels" },
  { id: "2", name: "Neurology", description: "Focuses on disorders of the nervous system" },
  { id: "3", name: "Pediatrics", description: "Specializes in medical care for infants, children, and adolescents" },
  { id: "4", name: "Orthopedics", description: "Concerned with conditions involving the musculoskeletal system" },
];

type Specialization = {
  id: string;
  name: string;
  description?: string;
};

export function Specializations() {
  const [specializations, setSpecializations] = useState<Specialization[]>(initialSpecializations);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSpecialization, setCurrentSpecialization] = useState<Specialization | null>(null);
  const { toast } = useToast();

  const filteredSpecializations = specializations.filter((specialization) =>
    specialization.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    specialization.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setCurrentSpecialization({ id: "", name: "", description: "" });
    setIsDialogOpen(true);
  };

  const handleEdit = (specialization: Specialization) => {
    setCurrentSpecialization({ ...specialization });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setSpecializations(specializations.filter((s) => s.id !== id));
    toast({
      title: "Specialization deleted",
      description: "The specialization has been removed successfully.",
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentSpecialization) return;

    if (currentSpecialization.id) {
      // Update existing
      setSpecializations(
        specializations.map((s) =>
          s.id === currentSpecialization.id ? { ...currentSpecialization } : s
        )
      );
      toast({
        title: "Specialization updated",
        description: "The specialization has been updated successfully.",
      });
    } else {
      // Add new
      const newSpecialization = {
        ...currentSpecialization,
        id: Date.now().toString(),
      };
      setSpecializations([...specializations, newSpecialization]);
      toast({
        title: "Specialization added",
        description: "The new specialization has been added successfully.",
      });
    }
    
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search specializations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Specialization
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSpecializations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No specializations found.
                </TableCell>
              </TableRow>
            ) : (
              filteredSpecializations.map((specialization) => (
                <TableRow key={specialization.id}>
                  <TableCell className="font-medium">{specialization.name}</TableCell>
                  <TableCell>{specialization.description}</TableCell>
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
              {currentSpecialization?.id ? "Edit Specialization" : "Add Specialization"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name">Name</label>
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
                <label htmlFor="description">Description</label>
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
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
