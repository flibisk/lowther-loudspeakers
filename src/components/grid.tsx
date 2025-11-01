import { ProductCard } from "@/components/product-card";

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

interface GridProps {
  products: Product[];
  title?: string;
  description?: string;
  columns?: 2 | 3 | 4;
}

export function Grid({ products, title, description, columns = 3 }: GridProps) {
  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-6 sm:px-6 lg:px-8 xl:px-12">
        {(title || description) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>
        )}
        
        <div className={`grid ${gridCols[columns]} gap-8`}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
