
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Plus, Trash } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Doctor } from "@/lib/types";

// Sample data - in a real app this would come from API/database
const initialDoctors = [
  { 
    id: "1", 
    name: "Dr. Jane Smith", 
    specialization: "Cardiology", 
    imageUrl: "/placeholder.svg", 
    bio: "Board certified cardiologist with 15 years of experience",
    email: "jane.smith@medhub.com",
    phone: "+1 (555) 123-4567"
  },
  { 
    id: "2", 
    name: "Dr. John Davis", 
    specialization: "Neurology", 
    imageUrl: "/placeholder.svg", 
    bio: "Specializes in neurological disorders with focus on stroke prevention",
    email: "john.davis@medhub.com",
    phone: "+1 (555) 234-5678"
  }
];

const specializations = [
  "Cardiology", "Dermatology", "Endocrinology", "Gastroenterology", 
  "Neurology", "Obstetrics", "Ophthalmology", "Orthopedics", 
  "Pediatrics", "Psychiatry", "Radiology", "Urology"
];

export function DoctorsData() {
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentDoctor, setCurrentDoctor] = useState<Doctor | null>(null);
  const { toast } = useToast();

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.bio?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setCurrentDoctor({ 
      id: "", 
      name: "", 
      specialization: "",
      imageUrl: "/placeholder.svg",
      bio: "",
      email: "",
      phone: ""
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (doctor: Doctor) => {
    setCurrentDoctor({ ...doctor });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setDoctors(doctors.filter((d) => d.id !== id));
    toast({
      title: "Doctor deleted",
      description: "The doctor has been removed successfully.",
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentDoctor) return;

    if (currentDoctor.id) {
      // Update existing
      setDoctors(
        doctors.map((d) =>
          d.id === currentDoctor.id ? { ...currentDoctor } : d
        )
      );
      toast({
        title: "Doctor updated",
        description: "The doctor information has been updated successfully.",
      });
    } else {
      // Add new
      const newDoctor = {
        ...currentDoctor,
        id: Date.now().toString(),
      };
      setDoctors([...doctors, newDoctor]);
      toast({
        title: "Doctor added",
        description: "The new doctor has been added successfully.",
      });
    }
    
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search doctors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Doctor
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Specialization</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDoctors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No doctors found.
                </TableCell>
              </TableRow>
            ) : (
              filteredDoctors.map((doctor) => (
                <TableRow key={doctor.id}>
                  <TableCell className="font-medium">{doctor.name}</TableCell>
                  <TableCell>{doctor.specialization}</TableCell>
                  <TableCell>{doctor.email}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(doctor)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(doctor.id)}
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentDoctor?.id ? "Edit Doctor" : "Add Doctor"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name">Full Name</label>
                <Input
                  id="name"
                  value={currentDoctor?.name || ""}
                  onChange={(e) =>
                    setCurrentDoctor(
                      (prev) => prev && { ...prev, name: e.target.value }
                    )
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="specialization">Specialization</label>
                <Select
                  value={currentDoctor?.specialization || ""}
                  onValueChange={(value) =>
                    setCurrentDoctor(
                      (prev) => prev && { ...prev, specialization: value }
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    {specializations.map((spec) => (
                      <SelectItem key={spec} value={spec}>
                        {spec}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="email">Email</label>
                <Input
                  id="email"
                  type="email"
                  value={currentDoctor?.email || ""}
                  onChange={(e) =>
                    setCurrentDoctor(
                      (prev) => prev && { ...prev, email: e.target.value }
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone">Phone</label>
                <Input
                  id="phone"
                  value={currentDoctor?.phone || ""}
                  onChange={(e) =>
                    setCurrentDoctor(
                      (prev) => prev && { ...prev, phone: e.target.value }
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="bio">Bio</label>
                <Textarea
                  id="bio"
                  value={currentDoctor?.bio || ""}
                  onChange={(e) =>
                    setCurrentDoctor(
                      (prev) => prev && { ...prev, bio: e.target.value }
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
