
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, User } from "lucide-react";

// Mock data for posts
const mockPosts = [
  {
    id: "1",
    title: "Understanding Diabetes Management",
    content: "Diabetes is a chronic health condition that affects how your body turns food into energy. Most of the food you eat is broken down into sugar (also called glucose) and released into your bloodstream. When your blood sugar goes up, it signals your pancreas to release insulin. Insulin acts like a key to let the blood sugar into your body's cells for use as energy.\n\nIf you have diabetes, your body either doesn't make enough insulin or can't use the insulin it makes as well as it should. When there isn't enough insulin or cells stop responding to insulin, too much blood sugar stays in your bloodstream. Over time, that can cause serious health problems, such as heart disease, vision loss, and kidney disease.\n\nThere isn't a cure yet for diabetes, but losing weight, eating healthy food, and being active can really help. Taking medicine as needed, getting diabetes self-management education and support, and keeping health care appointments can also reduce the impact of diabetes on your life.",
    category: "Health Tips",
    author: "Dr. Sarah Johnson",
    publishDate: "2025-03-15",
    status: "published" as const,
    imageUrl: "/placeholder.svg",
    summary: "Learn about managing diabetes effectively through lifestyle changes and medical interventions."
  },
  {
    id: "2",
    title: "New MRI Technology Arrives at Our Hospital",
    content: "We are excited to announce that our hospital has recently upgraded its diagnostic imaging capabilities with the installation of a state-of-the-art 3T MRI scanner. This advanced magnetic resonance imaging (MRI) technology represents a significant improvement over our previous equipment and will enhance our ability to detect and diagnose a wide range of medical conditions.\n\nThe new 3T MRI scanner provides twice the magnetic field strength of our previous machines, resulting in higher resolution images and more detailed visualization of anatomy and pathology. This allows our radiologists to detect smaller abnormalities and make more accurate diagnoses. The scanner also features advanced software algorithms that reduce scan times while improving image quality, making the examination process faster and more comfortable for patients.\n\nIn addition to improved image quality, the new scanner has a wider bore (opening) that reduces feelings of claustrophobia and can accommodate patients up to 550 pounds. The system also includes advanced noise reduction technology that makes the scanning process quieter and more comfortable.\n\nThis investment in cutting-edge technology demonstrates our ongoing commitment to providing the highest quality care to our patients and community.",
    category: "News",
    author: "Hospital Administration",
    publishDate: "2025-04-10",
    status: "published" as const,
    imageUrl: "/placeholder.svg",
    summary: "Our hospital has upgraded to a new 3T MRI scanner, providing superior diagnostic capabilities."
  },
  {
    id: "3",
    title: "Importance of Childhood Vaccinations",
    content: "Childhood vaccines protect children from a variety of serious or potentially fatal diseases, including diphtheria, measles, mumps, rubella, polio, tetanus, whooping cough (pertussis) and others. If these diseases seem uncommon — or even unheard of — it's usually because these vaccines are doing their job.\n\nVaccines help develop immunity by imitating an infection. This type of infection, however, almost never causes illness, but it does cause the immune system to produce T-lymphocytes and antibodies. Sometimes, after getting a vaccine, the imitation infection can cause minor symptoms, such as fever. Such minor symptoms are normal and should be expected as the body builds immunity.\n\nVaccines are thoroughly tested before licensing and carefully monitored even after they are licensed to ensure that they are very safe. Vaccines, like any medicine, can cause side effects, but most vaccine reactions are usually mild and temporary. The benefits of preventing serious and potentially life-threatening diseases far outweigh the risks of rare adverse events following immunization.\n\nFollow the vaccination schedule provided by your child's doctor to ensure they receive all necessary protection at the right times.",
    category: "Health Tips",
    author: "Dr. Robert Chen",
    publishDate: "2025-02-21",
    status: "published" as const,
    imageUrl: "/placeholder.svg",
    summary: "Why childhood vaccinations are crucial for protecting children against serious diseases."
  },
  {
    id: "4",
    title: "Hospital Expands Telemedicine Services",
    content: "As part of our ongoing commitment to increase healthcare accessibility, our hospital is proud to announce the expansion of our telemedicine services to include more specialties and extended hours. This initiative will allow patients to receive high-quality care from the comfort and safety of their homes.\n\nThe expanded telemedicine program now includes consultations with specialists in cardiology, dermatology, endocrinology, gastroenterology, neurology, oncology, and psychiatry, in addition to our existing primary care telemedicine services. Patients can schedule video appointments with these specialists without the need to travel to the hospital, saving time and reducing exposure to contagious illnesses.\n\nThe telemedicine platform is easy to use and accessible via smartphone, tablet, or computer with an internet connection. Patients receive instructions on how to join their virtual appointment prior to the scheduled time. During these consultations, doctors can discuss symptoms, review medical history, provide diagnoses for certain conditions, prescribe or adjust medications, and determine if an in-person visit is necessary.\n\nTo schedule a telemedicine appointment, patients can call our regular appointment line or use the online patient portal. Most insurance plans cover telemedicine visits similarly to in-person visits, but we encourage patients to verify coverage with their insurance provider.",
    category: "News",
    author: "Dr. Michelle Lee",
    publishDate: "2025-04-02",
    status: "published" as const,
    imageUrl: "/placeholder.svg",
    summary: "Our hospital is expanding telemedicine offerings to more specialties and extended hours."
  },
  {
    id: "5",
    title: "Healthy Eating Tips for Heart Health",
    content: "Heart disease is the leading cause of death in the United States, but a healthy diet can significantly reduce your risk. Here are some evidence-based dietary recommendations for maintaining heart health:\n\n1. Increase fruits and vegetables: Aim for at least 5 servings daily. These foods are rich in vitamins, minerals, and antioxidants that help protect your heart.\n\n2. Choose whole grains: Opt for whole grain bread, pasta, and rice instead of refined grains. Whole grains contain fiber that can help lower cholesterol levels.\n\n3. Limit unhealthy fats: Reduce saturated fats (found in red meat and full-fat dairy) and eliminate trans fats (found in some processed foods). Instead, use olive oil, avocados, nuts, and fatty fish as sources of healthier fats.\n\n4. Reduce sodium intake: Limit salt to help control blood pressure. Avoid processed foods, which often contain high sodium levels.\n\n5. Control portion sizes: Even when eating healthy foods, paying attention to portion sizes helps maintain a healthy weight, which is important for heart health.\n\n6. Include lean protein: Choose fish, skinless poultry, beans, and nuts as protein sources rather than fatty cuts of red meat.\n\n7. Limit added sugars: Excessive sugar intake is linked to higher risk of heart disease. Reduce sugary beverages and desserts.\n\n8. Stay hydrated: Water is the best choice for hydration. Limit sugary drinks and alcohol.\n\nIncorporating these dietary habits, along with regular physical activity, can significantly improve your heart health and reduce your risk of cardiovascular disease.",
    category: "Health Tips",
    author: "Dr. Emily Wong",
    publishDate: "2025-03-28",
    status: "published" as const,
    imageUrl: "/placeholder.svg",
    summary: "Dietary recommendations to improve heart health and reduce cardiovascular disease risk."
  }
];

export default function Info() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPost, setSelectedPost] = useState<typeof mockPosts[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(mockPosts.map(post => post.category))];
    return uniqueCategories;
  }, []);

  // Filter posts based on search query and category
  const filteredPosts = useMemo(() => {
    return mockPosts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           post.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
      return matchesSearch && matchesCategory && post.status === "published";
    });
  }, [searchQuery, selectedCategory]);

  // Handle post click to show detailed view
  const handlePostClick = (post: typeof mockPosts[0]) => {
    setSelectedPost(post);
    setDialogOpen(true);
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
        title="Health Information" 
        subtitle="Stay informed with health news, tips, and hospital updates"
      />
      
      <div className="container mx-auto px-4 py-12">
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
              <TabsList className="w-full flex">
                <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                {categories.map((category) => (
                  <TabsTrigger key={category} value={category} className="flex-1">
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        {/* Posts List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Card 
              key={post.id} 
              className="hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
              onClick={() => handlePostClick(post)}
            >
              <div className="h-48 bg-gray-200 relative">
                <img 
                  src={post.imageUrl} 
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
                  {post.summary || post.content.substring(0, 150) + '...'}
                </p>
              </CardContent>
              <CardFooter className="p-4 pt-0 text-xs text-gray-500 flex justify-between">
                <div className="flex items-center">
                  <User className="h-3 w-3 mr-1" />
                  {post.author}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(post.publishDate)}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {/* No results message */}
        {filteredPosts.length === 0 && (
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
                      {formatDate(selectedPost.publishDate)}
                    </div>
                  </div>
                </DialogHeader>
                
                {selectedPost.imageUrl && (
                  <div className="my-4">
                    <img
                      src={selectedPost.imageUrl}
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
