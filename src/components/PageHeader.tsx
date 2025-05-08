
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export default function PageHeader({ title, subtitle, className }: PageHeaderProps) {
  return (
    <div className={cn("bg-primary py-10 md:py-16", className)}>
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl text-muted-foreground md:text-4xl font-bold mb-2">{title}</h1>
        {subtitle && (
          <p className="text-lg text-secondary max-w-2xl mx-auto">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
