
import Logo from "@/components/shared/Logo";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex flex-col items-center gap-1 sm:items-start">
          <Logo />
          <p className="text-xs text-muted-foreground">
            Plan better. Work smarter.
          </p>
        </div>

        {/* Navigation */}
        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap items-center justify-center gap-5 text-sm text-muted-foreground"
        >
          <a
            href="/about-us"
            className="transition-colors hover:text-foreground"
          >
            About
          </a>

          <a
            href="/contact"
            className="transition-colors hover:text-foreground"
          >
            Contact
          </a>

          <a
            href="/privacy"
            className="transition-colors hover:text-foreground"
          >
            Privacy
          </a>
        </nav>

        {/* Copyright */}
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} TaskFlow. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

