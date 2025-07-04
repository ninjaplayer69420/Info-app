import { Header } from "@/components/header"
import { DownloadPageSimple } from "@/components/download-page-simple"

interface DownloadPageProps {
  params: {
    id: string
  }
}

export default function Download({ params }: DownloadPageProps) {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <DownloadPageSimple productId={params.id} />
    </div>
  )
}
