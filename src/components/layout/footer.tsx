import Link from "next/link"
import { Droplet, Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-muted/40 py-8 md:py-12 mt-auto">
      <div className="container mx-auto max-w-6xl px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <Droplet className="h-5 w-5 text-primary" fill="currentColor" />
          <span className="text-lg font-bold">
            Blood<span className="text-primary">Connect</span>
          </span>
        </div>
        
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left flex items-center gap-1">
          Built with <Heart className="h-4 w-4 text-primary fill-primary" /> for the community.
        </p>
        
        <div className="flex gap-4">
          <Link href="/terms" className="text-sm font-medium text-muted-foreground underline-offset-4 hover:underline">
            Terms
          </Link>
          <Link href="/privacy" className="text-sm font-medium text-muted-foreground underline-offset-4 hover:underline">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  )
}
