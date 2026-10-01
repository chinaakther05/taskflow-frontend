import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function Hero() {
  return (
    <section className="w-full py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center text-center gap-6">
          {/* Badge */}
          <div className="flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm text-muted-foreground">
            <span className="flex h-2 w-2 rounded-full bg-green-500" />
            Now in public beta
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl">
            Manage your team&apos;s work,{" "}
            <span className="text-blue-600">all in one place</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg text-muted-foreground max-w-xl">
            TaskFlow helps teams organize projects, assign tasks, and track
            progress — from planning to payment, without the chaos.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <Button size="lg" render={<Link href="/register" />} nativeButton={false}>
              Get Started Free
              <ArrowRight className="ml-2 size-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              render={<Link href="/login" />}
              nativeButton={false}
            >
              Login
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-blue-600" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-blue-600" />
              Free plan available
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-blue-600" />
              Setup in 2 minutes
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}