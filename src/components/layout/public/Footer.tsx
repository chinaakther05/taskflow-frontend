import Logo from "@/components/shared/Logo";

export default function Footer() {
  return (
    <footer className="w-full border-t">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
        {/* Logo / Brand */}
       <Logo/>

        {/* Copyright */}
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} TaskFlow. All rights reserved.
        </p>

        {/* Links */}
        <div className="flex items-center gap-5 text-sm text-muted-foreground">
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
        </div>
      </div>
    </footer>
  );
}