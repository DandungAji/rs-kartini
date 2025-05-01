
import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { posts as initialPosts, postCategories } from "@/lib/mockData";
import { Post } from "@/lib/types";
import { Calendar as CalendarIcon, Edit, Plus, Search, Trash } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

export default function Posts() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"all" | "published" | "draft">("all");
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  
  const [newPost, setNewPost] = useState<Partial<Post>>({
    title: "",
    content: "",
    category: postCategories[0]?.name || "",
    author: "",
    status: "draft",
  });
  
  // Sort posts by publishDate (newest first) then filter based on search, category and status
  const filteredPosts = [...posts]
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
    .filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           post.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
      const matchesStatus = activeTab === "all" || 
                           (activeTab === "published" && post.status === "published") ||
                           (activeTab === "draft" && post.status === "draft");
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const handleAddPost = () => {
    if (!newPost.title || !newPost.content || !newPost.category || !newPost.author) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    const currentDate = newPost.publishDate || new Date().toISOString().split('T')[0];
    const newId = `${posts.length + 1}`;
    
    const postToAdd: Post = {
      id: newId,
      title: newPost.title,
      content: newPost.content,
      category: newPost.category,
      author: newPost.author,
      publishDate: currentDate,
      status: newPost.status as "draft" | "published",
      imageUrl: newPost.imageUrl,
      summary: newPost.summary,
    };
    
    setPosts([...posts, postToAdd]);
    
    toast({
      title: "Post Added",
      description: `The post has been added as ${postToAdd.status}.`,
    });
    
    // Reset form
    setNewPost({
      title: "",
      content: "",
      category: postCategories[0]?.name || "",
      author: "",
      status: "draft",
    });
  };
  
  const handleUpdatePost = () => {
    if (!editingPost) return;
    
    setPosts(posts.map(post => post.id === editingPost.id ? editingPost : post));
    
    toast({
      title: "Post Updated",
      description: "The post has been updated successfully.",
    });
    
    setEditingPost(null);
  };
  
  const handleDeletePost = (id: string) => {
    setPosts(posts.filter(post => post.id !== id));
    
    toast({
      title: "Post Deleted",
      description: "The post has been removed.",
    });
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Manage Posts</h1>
        <div className="flex gap-2">
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {postCategories.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search posts..."
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
            <CardTitle className="text-lg">Create New Post</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <Input
                  id="title"
                  placeholder="Post title"
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <Select
                    value={newPost.category}
                    onValueChange={(value) => setNewPost({...newPost, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {postCategories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                    Author
                  </label>
                  <Input
                    id="author"
                    placeholder="Author name"
                    value={newPost.author}
                    onChange={(e) => setNewPost({...newPost, author: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="publishDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Publish Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="publishDate"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !newPost.publishDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newPost.publishDate ? (
                        format(new Date(newPost.publishDate), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={newPost.publishDate ? new Date(newPost.publishDate) : undefined}
                      onSelect={(date) => 
                        setNewPost({
                          ...newPost, 
                          publishDate: date ? date.toISOString().split('T')[0] : undefined
                        })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
                  Summary (optional)
                </label>
                <Input
                  id="summary"
                  placeholder="Brief summary"
                  value={newPost.summary || ""}
                  onChange={(e) => setNewPost({...newPost, summary: e.target.value})}
                />
              </div>
              
              <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL (optional)
                </label>
                <Input
                  id="imageUrl"
                  placeholder="https://example.com/image.jpg"
                  value={newPost.imageUrl || ""}
                  onChange={(e) => setNewPost({...newPost, imageUrl: e.target.value})}
                />
              </div>
              
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <Textarea
                  id="content"
                  placeholder="Write your post content here..."
                  rows={8}
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Status</label>
                    <select 
                      className="w-full p-2 border rounded"
                      value={newPost.status}
                      onChange={(e) => setNewPost({...newPost, status: e.target.value as "draft" | "published"})}
                      required
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>
                
                <Button onClick={handleAddPost}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Post
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Edit Post</CardTitle>
            <Button variant="outline" onClick={() => setEditingPost(null)}>
              Cancel
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="editTitle" className="block text-sm font-medium text-gray-700 mb-1">
                  Title
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
                    Category
                  </label>
                  <Select
                    value={editingPost.category}
                    onValueChange={(value) => setEditingPost({...editingPost, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {postCategories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label htmlFor="editAuthor" className="block text-sm font-medium text-gray-700 mb-1">
                    Author
                  </label>
                  <Input
                    id="editAuthor"
                    value={editingPost.author}
                    onChange={(e) => setEditingPost({...editingPost, author: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="editPublishDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Publish Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="editPublishDate"
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(new Date(editingPost.publishDate), "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={new Date(editingPost.publishDate)}
                      onSelect={(date) => 
                        setEditingPost({
                          ...editingPost, 
                          publishDate: date ? date.toISOString().split('T')[0] : editingPost.publishDate
                        })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <label htmlFor="editSummary" className="block text-sm font-medium text-gray-700 mb-1">
                  Summary
                </label>
                <Input
                  id="editSummary"
                  value={editingPost.summary || ""}
                  onChange={(e) => setEditingPost({...editingPost, summary: e.target.value})}
                />
              </div>
              
              <div>
                <label htmlFor="editImageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <Input
                  id="editImageUrl"
                  value={editingPost.imageUrl || ""}
                  onChange={(e) => setEditingPost({...editingPost, imageUrl: e.target.value})}
                />
              </div>
              
              <div>
                <label htmlFor="editContent" className="block text-sm font-medium text-gray-700 mb-1">
                  Content
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
                  <select 
                    className="w-full p-2 border rounded"
                    value={editingPost.status}
                    onChange={(e) => setEditingPost({...editingPost, status: e.target.value as "draft" | "published"})}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                
                <Button onClick={handleUpdatePost}>
                  Update Post
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Tabs defaultValue="all" onValueChange={(value) => setActiveTab(value as "all" | "published" | "draft")}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
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
          <h3 className="text-lg font-medium text-gray-900 mb-1">No Posts Found</h3>
          <p className="text-gray-500 mb-4">
            There are no posts matching your search criteria.
          </p>
        </div>
      );
    }
    
    return posts.map(post => (
      <Card key={post.id} className="overflow-hidden hover:shadow-sm transition-shadow">
        <div className="flex flex-col md:flex-row">
          {post.imageUrl && (
            <div className="md:w-48 h-32 md:h-auto overflow-hidden">
              <img 
                src={post.imageUrl} 
                alt={post.title} 
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <CardContent className={`p-4 flex-grow ${post.imageUrl ? '' : 'md:w-full'}`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
              <h3 className="font-semibold text-lg mb-2 md:mb-0">{post.title}</h3>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded ${
                  post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {post.status}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setEditingPost(post)} 
                  className="text-gray-500 hover:text-primary"
                >
                  <Edit size={16} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleDeletePost(post.id)} 
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash size={16} />
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="text-xs bg-secondary px-2 py-1 rounded">
                {post.category}
              </span>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">{post.summary || post.content.substring(0, 100) + '...'}</p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>By {post.author}</span>
              <span>{formatDate(post.publishDate)}</span>
            </div>
          </CardContent>
        </div>
      </Card>
    ));
  }
}
