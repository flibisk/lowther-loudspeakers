import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  featured?: boolean;
  inStock?: boolean;
  kit?: boolean;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardHeader className="p-0">
        <Link href={`/speakers/${product.slug}`}>
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src={product.images[0] || "/images/placeholder.jpg"}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {product.featured && (
              <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-2 py-1 text-xs font-medium rounded">
                Featured
              </div>
            )}
            {product.kit && (
              <div className="absolute top-4 right-4 bg-secondary text-secondary-foreground px-2 py-1 text-xs font-medium rounded">
                Kit
              </div>
            )}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-medium">Out of Stock</span>
              </div>
            )}
          </div>
        </Link>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="space-y-2">
          <Link href={`/speakers/${product.slug}`}>
            <h3 className="font-display text-xl font-semibold group-hover:text-primary transition-colors">
              {product.title}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground">{product.subtitle}</p>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0 flex justify-between items-center">
        <div className="text-lg font-semibold">
          {product.currency} {product.price.toLocaleString()}
        </div>
        <Button variant="black" size="lowther" asChild>
          <Link href={`/speakers/${product.slug}`}>
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
