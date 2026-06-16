import Link from "next/link"
import { Droplet } from "lucide-react"
import { cookies } from "next/headers"
import { logoutAction, adminLogoutAction } from "@/app/actions/auth"

export async function Header() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has("mock_session");
  const isAdminLoggedIn = cookieStore.has("admin_session");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <Droplet className="h-6 w-6 text-primary" fill="currentColor" />
          <span className="text-xl font-bold tracking-tight text-foreground">
            Blood<span className="text-primary">Connect</span>
          </span>
        </Link>
        
        <nav className="hidden md:flex gap-6">
          <Link href="/search" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Find Donors
          </Link>
          <Link href="/about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Guidelines
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {isAdminLoggedIn ? (
            <>
              <Link href="/admin" className="hidden sm:block text-sm font-medium text-amber-600 hover:text-amber-700">
                Admin Panel
              </Link>
              <form action={adminLogoutAction}>
                <button type="submit" className="inline-flex h-10 items-center justify-center rounded-full bg-slate-100 px-6 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  Admin Log out
                </button>
              </form>
            </>
          ) : isLoggedIn ? (
            <>
              <Link href="/dashboard" className="hidden sm:block text-sm font-medium text-muted-foreground hover:text-foreground">
                Dashboard
              </Link>
              <form action={logoutAction}>
                <button type="submit" className="inline-flex h-10 items-center justify-center rounded-full bg-slate-100 px-6 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden sm:block text-sm font-medium text-muted-foreground hover:text-foreground">
                Log in
              </Link>
              <Link href="/register" className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm shadow-primary/20 transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                Register as Donor
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}


