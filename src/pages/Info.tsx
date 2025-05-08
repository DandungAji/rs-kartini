import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, User } from "lucide-react";
import { supabase } from "@/lib/supabase";

// Interface untuk tipe data Post
interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  publish_date: string;
  status: "published" | "draft";
  image_url: string | null;
  summary: string | null;
}

export default function Info() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Ambil data post dari Supabase
  useEffect(() => {
    async function fetchPosts() {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .eq("status", "published")
          .order("publish_date", { ascending: false });

        if (error) {
          throw new Error(error.message);
        }

        // Pastikan data sesuai dengan interface Post
        const formattedPosts: Post[] = data.map((post) => ({
          id: post.id,
          title: post.title,
          content: post.content,
          category: post.category,
          author: post.author,
          publish_date: post.publish_date,
          status: post.status,
          image_url: post.image_url || "/placeholder.svg",
          summary: post.summary || post.content.substring(0, 150) + "...",
        }));

        setPosts(formattedPosts);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchPosts();
  }, []);

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(posts.map((post) => post.category))];
    return uniqueCategories;
  }, [posts]);

  // Filter posts based on search query and category, and sort by date (newest first)
  const filteredPosts = useMemo(() => {
    return posts
      .filter((post) => {
        const matchesSearch =
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.author.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime());
  }, [searchQuery, selectedCategory, posts]);

  // Handle post click to show detailed view
  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setDialogOpen(true);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      <Navbar />

      <PageHeader
        title="Informasi Kesehatan"
        subtitle="Tetap terinformasi dengan berita kesehatan, kiat, dan informasi terbaru dari rumah sakit"
      />

      <div className="container mx-auto px-6 py-12">
        {/* Filters */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search information..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9"
            />
          </div>
          <div>
            <Tabs defaultValue="all" onValueChange={setSelectedCategory}>
              <TabsList className="w-full flex bg-primary text-muted-foreground">
                <TabsTrigger value="all" className="flex-1">Semua Kategori</TabsTrigger>
                {categories.map((category) => (
                  <TabsTrigger key={category} value={category} className="flex-1">
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading posts...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {/* Posts List */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Card
                key={post.id}
                className="hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
                onClick={() => handlePostClick(post)}
              >
                <div className="h-48 bg-gray-200 relative">
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-2 right-2">
                    {post.category}
                  </Badge>
                </div>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-lg">{post.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {post.summary}
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0 text-xs text-muted flex justify-between">
                  <div className="flex items-center ">
                    <User className="h-3 w-3 mr-1 text-muted" />
                    {post.author}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(post.publish_date)}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* No results message */}
        {!isLoading && !error && filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No information matching your search criteria.</p>
          </div>
        )}

        {/* Post Detail Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
            {selectedPost && (
              <>
                <DialogHeader>
                  <Badge variant="outline" className="mb-2 w-fit">
                    {selectedPost.category}
                  </Badge>
                  <DialogTitle className="text-2xl">
                    {selectedPost.title}
                  </DialogTitle>
                  <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {selectedPost.author}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(selectedPost.publish_date)}
                    </div>
                  </div>
                </DialogHeader>

                {selectedPost.image_url && (
                  <div className="my-4">
                    <img
                      src={selectedPost.image_url}
                      alt={selectedPost.title}
                      className="w-full h-64 object-cover rounded-md"
                    />
                  </div>
                )}

                <div className="mt-4 text-gray-700">
                  {selectedPost.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Additional Info */}
        <div className="mt-16 bg-secondary rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-gray-700 mb-6">
            Stay updated with the latest health tips, hospital news, and community events.
            Our monthly newsletter provides valuable information to help you and your family stay healthy.
          </p>
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Enter your email address"
              type="email"
              className="md:flex-grow"
            />
            <Button>Subscribe</Button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}