import Image from "next/image"
import Link from "next/link"
import { AdminButton } from "./admin-button"

export function Header() {
  return (
    <header className="bg-black border-b border-gray-800 static top-0 left-0 right-0 z-50">
      <AdminButton />
      <div className="container mx-auto px-4 py-3">
        <Link href="/" className="flex justify-center cursor-pointer">
          <div className="w-16 h-16 relative">
            <Image
              src="/logo.jpg"
              alt="Islamic Excellence"
              width={64}
              height={64}
              className="rounded-full object-cover"
            />
          </div>
        </Link>
      </div>
    </header>
  )
}
