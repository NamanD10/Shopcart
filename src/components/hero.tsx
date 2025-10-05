import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Hero() {
  return (
    <section className="bg-gradient-to-b from-background to-muted/20 py-20 px-4">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6">Discover Amazing Products</h1>
        <p className="text-xl text-muted-foreground text-pretty mb-8 max-w-2xl mx-auto">
          Shop the latest collection of premium products curated just for you. Quality guaranteed, fast shipping, and
          exceptional customer service.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="#products">Shop Now</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/about">Learn More</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
