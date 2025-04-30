
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { posts, postCategories } from "@/lib/mockData";
import { Post } from "@/lib/types";

export default function Info() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Filter posts based on search and category
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      // Only show published posts
      if (post.status !== "published") return false;
      
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Group posts by category
  const postsByCategory = useMemo(() => {
    const grouped: Record<string, Post[]> = {};
    
    filteredPosts.forEach(post => {
      if (!grouped[post.category]) {
        grouped[post.category] = [];
      }
      grouped[post.category].push(post);
    });
    
    return grouped;
  }, [filteredPosts]);

  // Truncate content for previews
  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + '...';
  };

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      <Navbar />
      
      <PageHeader 
        title="News & Information" 
        subtitle="Stay updated with the latest hospital news, health tips, and events"
      />
      
      <div className="container mx-auto px-4 py-12">
        {/* Filters */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by category" />
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
          </div>
        </div>
        
        {/* Display Options */}
        <Tabs defaultValue="grid" className="mb-8">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="categories">By Category</TabsTrigger>
          </TabsList>
          
          {/* Grid View */}
          <TabsContent value="grid" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  {post.imageUrl && (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={post.imageUrl} 
                        alt={post.title} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="flex items-center mb-3">
                      <span className="bg-secondary text-xs px-2 py-1 rounded">
                        {post.category}
                      </span>
                      <span className="text-gray-500 text-sm ml-auto">
                        {formatDate(post.publishDate)}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                    <p className="text-gray-600 mb-4">{truncateContent(post.content)}</p>
                    <p className="text-sm text-primary">By {post.author}</p>
                  </CardContent>
                  <CardFooter className="px-6 py-4 border-t bg-gray-50">
                    <Button variant="link" className="p-0 h-auto text-primary">
                      Read More
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No posts matching your search criteria.</p>
              </div>
            )}
          </TabsContent>
          
          {/* List View */}
          <TabsContent value="list" className="mt-6">
            <div className="space-y-6">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row">
                    {post.imageUrl && (
                      <div className="md:w-1/4 h-48 md:h-auto overflow-hidden">
                        <img 
                          src={post.imageUrl} 
                          alt={post.title} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className={`md:w-${post.imageUrl ? '3/4' : 'full'} p-6`}>
                      <div className="flex items-center mb-3">
                        <span className="bg-secondary text-xs px-2 py-1 rounded">
                          {post.category}
                        </span>
                        <span className="text-gray-500 text-sm ml-auto">
                          {formatDate(post.publishDate)}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                      <p className="text-gray-600 mb-4">{truncateContent(post.content, 200)}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-primary">By {post.author}</p>
                        <Button variant="link" className="p-0 h-auto text-primary">
                          Read More
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No posts matching your search criteria.</p>
              </div>
            )}
          </TabsContent>
          
          {/* By Category */}
          <TabsContent value="categories" className="mt-6">
            {Object.entries(postsByCategory).map(([category, categoryPosts]) => (
              <div key={category} className="mb-12">
                <h2 className="text-2xl font-bold mb-6 pb-2 border-b">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {categoryPosts.map((post) => (
                    <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="flex flex-col h-full">
                        {post.imageUrl && (
                          <div className="h-40 overflow-hidden">
                            <img 
                              src={post.imageUrl} 
                              alt={post.title} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <CardContent className="p-6 flex-grow">
                          <div className="flex items-center mb-3">
                            <span className="text-gray-500 text-sm">
                              {formatDate(post.publishDate)}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                          <p className="text-gray-600 mb-4">{truncateContent(post.content)}</p>
                          <p className="text-sm text-primary mt-auto">By {post.author}</p>
                        </CardContent>
                        <CardFooter className="px-6 py-4 border-t bg-gray-50">
                          <Button variant="link" className="p-0 h-auto text-primary">
                            Read More
                          </Button>
                        </CardFooter>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
            
            {Object.keys(postsByCategory).length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No posts matching your search criteria.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {/* Newsletter Signup */}
        <div className="mt-16 bg-secondary p-8 rounded-lg">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-gray-700 mb-6">
              Stay updated with the latest health tips, hospital news, and upcoming events.
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Your email address"
                type="email"
                className="sm:flex-grow"
                required
              />
              <Button type="submit">Subscribe</Button>
            </form>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
}
