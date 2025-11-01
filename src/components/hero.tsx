import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface HeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: string;
  ctaPrimary?: {
    text: string;
    href: string;
  };
  ctaSecondary?: {
    text: string;
    href: string;
  };
}

export function Hero({
  title,
  subtitle,
  description,
  backgroundImage,
  ctaPrimary,
  ctaSecondary,
}: HeroProps) {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundImage}
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}
      
      <div className="relative z-10 container mx-auto px-6 sm:px-6 lg:px-8 xl:px-12 text-center">
        <div className="max-w-4xl mx-auto">
          {subtitle && (
            <p className="text-lg text-muted-foreground mb-4">{subtitle}</p>
          )}
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            {title}
          </h1>
          {description && (
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {description}
            </p>
          )}
          
          {(ctaPrimary || ctaSecondary) && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {ctaPrimary && (
                <Button asChild size="lg">
                  <Link href={ctaPrimary.href}>{ctaPrimary.text}</Link>
                </Button>
              )}
              {ctaSecondary && (
                <Button variant="outline" asChild size="lg">
                  <Link href={ctaSecondary.href}>{ctaSecondary.text}</Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
