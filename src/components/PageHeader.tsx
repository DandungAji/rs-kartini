import SplitText from '/Reactbits/SplitText/SplitText'
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
        <SplitText
          text={title}
          className="text-3xl text-muted-foreground md:text-4xl font-bold mb-2"
          delay={50}
          animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
          animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
          easing="easeOutCubic"
          threshold={0.2}
        />
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
