
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Specializations } from "@/components/admin/master-data/Specializations";
import { DoctorsData } from "@/components/admin/master-data/DoctorsData";
import { PostCategories } from "@/components/admin/master-data/PostCategories";

export default function MasterData() {
  const [activeTab, setActiveTab] = useState("doctors");

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Master Data</h2>
          <p className="text-muted-foreground">
          Mengelola data dasar untuk praktik medis Anda
          </p>
        </div>

        <Tabs defaultValue="specializations" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full border-b sm:w-auto">
            {/* <TabsTrigger value="doctors">Dokter</TabsTrigger> */}
            <TabsTrigger value="specializations">Spesialisasi</TabsTrigger>
            <TabsTrigger value="post-categories">Kategori Postingan</TabsTrigger>
          </TabsList>
          <div className="mt-4">
          <TabsContent value="specializations" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Spesialisasi</CardTitle>
                  <CardDescription>Mengelola spesialisasi medis</CardDescription>
                </CardHeader>
                <CardContent>
                  <Specializations />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="doctors" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Dokter</CardTitle>
                  <CardDescription>Mengelola profil dan informasi dokter</CardDescription>
                </CardHeader>
                <CardContent>
                  <DoctorsData />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="post-categories" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Kategori Postingan</CardTitle>
                  <CardDescription>Mengelola kategori postingan blog</CardDescription>
                </CardHeader>
                <CardContent>
                  <PostCategories />
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
