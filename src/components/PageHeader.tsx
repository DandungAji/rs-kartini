
import React from 'react';
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  isSectionHeader?: boolean;
}

export default function PageHeader({ title, subtitle, className, isSectionHeader = false }: PageHeaderProps) {
  return (
    <div className={cn(
      isSectionHeader ? "py-10" : "bg-primary py-10 md:py-16 relative",
      className
    )}>
      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 
          className={cn(
            "text-3xl md:text-4xl font-bold mb-2",
            isSectionHeader ? "text-foreground" : "text-white"
          )}
        >
          {title}
        </h1>
        {subtitle && (
          <p className={cn(
            "text-lg max-w-2xl mx-auto",
            isSectionHeader ? "text-muted-foreground" : "text-white/80"
          )}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
