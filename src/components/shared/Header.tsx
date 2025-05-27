// src/components/shared/Header.tsx
import Link from "next/link";
import { Package2 } from "lucide-react"; // Ένα παράδειγμα εικονιδίου για logo

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Package2 className="h-6 w-6" /> {/* Placeholder Logo */}
          <span className="font-bold sm:inline-block">AuraGenius</span>
        </Link>
        <nav className="flex flex-1 items-center space-x-4 sm:justify-end">
          <Link
            href="/analyze"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Analyze
          </Link>
          <Link
            href="/chat"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Chat
          </Link>
          <Link
            href="/profile"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Profile
          </Link>
          <Link
            href="/login" // Ή /signup αν δεν είναι συνδεδεμένος
            className="px-4 py-2 text-sm font-medium border rounded-md hover:bg-accent hover:text-accent-foreground"
          >
            Login / Signup
          </Link>
        </nav>
      </div>
    </header>
  );
}