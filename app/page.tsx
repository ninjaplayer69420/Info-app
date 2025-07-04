import { ProductGrid } from "@/components/product-grid"
import { Header } from "@/components/header"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="container mx-auto px-4 pt-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-6 glow-text">The Islamic Renaissance</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Premium courses and guides to enhance your skills and knowledge
          </p>
        </div>
        <ProductGrid />
      </main>
    </div>
  )
}
