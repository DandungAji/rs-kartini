
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SpecialtyCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
}

export default function SpecialtyCard({ title, description, icon, className }: SpecialtyCardProps) {
  return (
    <Card className={cn("transition-all duration-300 hover:shadow-lg hover:-translate-y-1", className)}>
      <CardHeader className="text-center">
        <div className="flex justify-center items-center w-16 h-16 mx-auto mb-4 bg-secondary rounded-full">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-center">{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
