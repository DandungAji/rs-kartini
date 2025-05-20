import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ensureObject } from "@/lib/types";
import PageHeader from "@/components/PageHeader";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";

export default function Info() {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [info, setInfo] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const [infoCategoriesResult, infoResult, authorResult] = await Promise.all([
          supabase.from("info_categories").select("id, name").order("name"),
          supabase.from("info").select("id, title, content, publish_date, category(id, name)"),
          supabase.from("users").select("id, full_name, email").eq("role", "admin")
        ]);

        if (infoCategoriesResult.error) throw infoCategoriesResult.error;
        if (infoResult.error) throw infoResult.error;
        if (authorResult.error) throw authorResult.error;

        setCategories(infoCategoriesResult.data);
        
        // Process info data to handle nested objects
        const processedInfo = infoResult.data.map((info: any) => ({
          ...info,
          category: ensureObject(info.category)
        }));
        setInfo(processedInfo);
        
        setAuthors(authorResult.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Terjadi kesalahan saat memuat data");
      } finally {
        setLoading(false);
      }
    };

    fetchInfo();
  }, []);

  if (loading) return <div className="p-4">Memuat informasi...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div>
      <Navbar />
      <PageHeader title="Informasi" subtitle="Berita terbaru dan artikel kesehatan" />

      <div className="container mx-auto py-8 px-4">
        {categories.map((category) => (
          <div key={category.id} className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{category.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {info
                .filter((item) => item.category.id === category.id)
                .map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md p-4">
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.content.substring(0, 100)}...</p>
                    <p className="text-gray-500 mt-2">
                      Publish Date: {new Date(item.publish_date).toLocaleDateString()}
                    </p>
                    <Badge className="mt-2">{item.category.name}</Badge>
                  </div>
                ))}
            </div>
          </div>
        ))}

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Authors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {authors.map((author) => (
              <div key={author.id} className="bg-gray-100 rounded-lg p-4">
                <h3 className="text-lg font-semibold">{author.full_name}</h3>
                <p className="text-gray-600">{author.email}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
