import { ProductDetails } from "@/components/product-details"
import { Header } from "@/components/header"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <ProductDetails productId={params.id} />
    </div>
  )
}
