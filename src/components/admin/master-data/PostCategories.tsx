
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pencil, Plus, Trash } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { PostCategory } from "@/lib/types";

// Sample data - in a real app this would come from API/database
const initialCategories = [
  { id: "1", name: "News", slug: "news" },
  { id: "2", name: "Health Tips", slug: "health-tips" },
  { id: "3", name: "Medical Research", slug: "medical-research" },
  { id: "4", name: "Events", slug: "events" },
];

export function PostCategories() {
  const [categories, setCategories] = useState<PostCategory[]>(initialCategories);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentCategory, setCurrentCategory] = useState<PostCategory | null>(null);
  const { toast } = useToast();

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

  const handleDelete = (id: string) => {
    setCategories(categories.filter((c) => c.id !== id));
    toast({
      title: "Category deleted",
      description: "The category has been removed successfully.",
    });
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  const handleNameChange = (name: string) => {
    if (!currentCategory) return;
    
    // Auto-generate slug when name changes, but only if the user hasn't manually edited the slug
    // or if it's a new category
    const shouldUpdateSlug = !currentCategory.id || 
      currentCategory.slug === generateSlug(currentCategory.name) ||
      currentCategory.slug === "";
      
    setCurrentCategory({
      ...currentCategory,
      name,
      slug: shouldUpdateSlug ? generateSlug(name) : currentCategory.slug
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentCategory) return;

    if (currentCategory.id) {
      // Update existing
      setCategories(
        categories.map((c) =>
          c.id === currentCategory.id ? { ...currentCategory } : c
        )
      );
      toast({
        title: "Category updated",
        description: "The category has been updated successfully.",
      });
    } else {
      // Add new
      const newCategory = {
        ...currentCategory,
        id: Date.now().toString(),
      };
      setCategories([...categories, newCategory]);
      toast({
        title: "Category added",
        description: "The new category has been added successfully.",
      });
    }
    
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No categories found.
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
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(category.id)}
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
              {currentCategory?.id ? "Edit Category" : "Add Category"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name">Name</label>
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
                  Used in URLs. Auto-generated from name if left empty.
                </p>
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
