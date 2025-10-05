import { Hero } from "@/components/hero";
import { ProductGrid } from "@/components/product-grid";

export default function Home() {
  return (
   <div className="min-h-screen">
      <Hero />
      <ProductGrid />
    </div>
  );
}
