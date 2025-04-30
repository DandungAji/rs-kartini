
import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { services } from "@/lib/mockData";
import { Service } from "@/lib/types";
import * as LucideIcons from "lucide-react";

export default function Services() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(services.map(service => service.category))];
    return uniqueCategories;
  }, []);

  // Filter services based on search query and category
  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          service.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <>
      <Navbar />
      
      <PageHeader 
        title="Our Services" 
        subtitle="Comprehensive healthcare services for all your medical needs"
      />
      
      <div className="container mx-auto px-4 py-12">
        {/* Filters */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              placeholder="Search services..."
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
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Services List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service: Service) => {
            const Icon = LucideIcons[service.icon as keyof typeof LucideIcons] || LucideIcons.Activity;
            
            return (
              <Card key={service.id} id={service.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-secondary rounded-full mr-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">{service.name}</h3>
                  </div>
                  <p className="text-gray-600">{service.description}</p>
                  <p className="text-sm text-primary mt-4">{service.category}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No services matching your search criteria.</p>
          </div>
        )}
        
        {/* Additional Info */}
        <div className="mt-16 bg-secondary rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Need Specialized Care?</h2>
          <p className="text-gray-700 mb-4">
            Our hospital offers a wide range of specialized medical services beyond what's listed here. 
            If you have specific healthcare needs or questions, please contact our medical team for personalized assistance.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-white p-6 rounded-md shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Emergency Services</h3>
              <p className="text-gray-600">
                24/7 emergency care for urgent medical situations. Call (555) 123-4567 for immediate assistance.
              </p>
            </div>
            <div className="bg-white p-6 rounded-md shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Appointment Booking</h3>
              <p className="text-gray-600">
                Schedule routine appointments through our online portal or by calling our reception at (555) 765-4321.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
}
