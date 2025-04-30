
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
            Manage foundational data for your medical practice
          </p>
        </div>

        <Tabs defaultValue="doctors" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full border-b sm:w-auto">
            <TabsTrigger value="doctors">Doctors</TabsTrigger>
            <TabsTrigger value="specializations">Specializations</TabsTrigger>
            <TabsTrigger value="post-categories">Post Categories</TabsTrigger>
          </TabsList>
          <div className="mt-4">
            <TabsContent value="doctors" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Doctors</CardTitle>
                  <CardDescription>Manage doctor profiles and information</CardDescription>
                </CardHeader>
                <CardContent>
                  <DoctorsData />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="specializations" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Specializations</CardTitle>
                  <CardDescription>Manage medical specializations</CardDescription>
                </CardHeader>
                <CardContent>
                  <Specializations />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="post-categories" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Post Categories</CardTitle>
                  <CardDescription>Manage blog post categories</CardDescription>
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
