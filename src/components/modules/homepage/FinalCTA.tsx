
import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

const FinalCTA = () => {
  return (
    <section className="w-full">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="relative overflow-hidden rounded-3xl bg-blue-600 px-6 py-16 text-center shadow-2xl sm:px-10 lg:px-16">
          {/* Background Effects */}
          <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-32 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          {/* Content */}
          <div className="relative mx-auto max-w-3xl">
            {/* Badge */}
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur">
              <Sparkles className="size-4" />
              Start working smarter today
            </div>

            {/* Heading */}
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Ready to bring your team together?
            </h2>

            {/* Description */}
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg">
              Organize your projects, manage your tasks, and collaborate with
              your team — all from one simple workspace.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                className="h-12 bg-white px-7 text-blue-600 hover:bg-blue-50"
                render={
                  <Link href="/register">
                    Get Started Free
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                }
                nativeButton={false}
              />

              <Button
                size="lg"
                variant="outline"
                className="h-12 border-white/30 bg-white/10 px-7 text-white hover:bg-white/20 hover:text-white"
                render={<Link href="/login">Login</Link>}
                nativeButton={false}
              />
            </div>

            {/* Benefits */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-blue-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-white" />
                Free to get started
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-white" />
                No credit card required
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-white" />
                Easy setup
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;

