
import {
  ArrowRight,
  CheckCircle2,
  FolderKanban,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function AboutUsPage() {
  const features = [
    {
      icon: FolderKanban,
      title: "Everything in one place",
      description:
        "Keep your projects, tasks, deadlines, and team activities organized in one simple workspace.",
    },
    {
      icon: Users,
      title: "Built for teams",
      description:
        "Create clear roles and responsibilities so every team member knows what they need to do.",
    },
    {
      icon: ShieldCheck,
      title: "Clear permissions",
      description:
        "Admins, managers, and members get the right level of access based on their role.",
    },
    {
      icon: Zap,
      title: "Work faster",
      description:
        "Spend less time switching between tools and more time getting important work done.",
    },
  ];

  return (
    <div className="w-full bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[450px] w-[700px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute right-0 top-32 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/80 px-4 py-2 text-sm font-medium shadow-sm">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              About TaskFlow
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              A simpler way to{" "}
              <span className="text-blue-600">work together.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              TaskFlow is a modern workspace designed to help teams
              organize projects, manage tasks, collaborate better, and
              stay focused on what matters most.
            </p>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 overflow-hidden rounded-2xl border bg-background/80 shadow-sm backdrop-blur sm:grid-cols-3">
            <div className="p-6 text-center sm:border-r">
              <p className="text-3xl font-bold text-blue-600">3</p>
              <p className="mt-2 text-sm text-muted-foreground">
                User roles
              </p>
            </div>

            <div className="border-t p-6 text-center sm:border-r sm:border-t-0">
              <p className="text-3xl font-bold text-blue-600">1</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Unified workspace
              </p>
            </div>

            <div className="border-t p-6 text-center sm:border-t-0">
              <p className="text-3xl font-bold text-blue-600">∞</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Possibilities to grow
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-24 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Our story
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Less chaos.
              <br />
              More progress.
            </h2>
          </div>

          <div className="space-y-5 text-base leading-7 text-muted-foreground">
            <p>
              Managing projects across spreadsheets, chat messages, and
              different tools can quickly become confusing. Important
              tasks get missed, responsibilities become unclear, and
              teams lose valuable time.
            </p>

            <p>
              TaskFlow was created to solve that problem with a simple
              idea: bring projects, tasks, people, and progress together
              in one organized workspace.
            </p>

            <p>
              Whether you are managing a growing team or working on a
              small project, TaskFlow gives everyone a clear view of
              what needs to happen next.
            </p>
          </div>
        </div>
      </section>

      {/* Why TaskFlow */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-24 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Why TaskFlow
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything your team needs to stay organized
            </h2>

            <p className="mt-4 text-muted-foreground">
              Simple tools, clear workflows, and a workspace designed
              around the way modern teams work.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border bg-background p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600">
                    <Icon className="size-5" />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Principles */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-24 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              What we believe
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Work should feel organized, not overwhelming.
            </h2>

            <p className="mt-5 max-w-xl leading-7 text-muted-foreground">
              We believe great productivity tools should make work
              easier, not add another layer of complexity.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <CheckCircle2 className="mt-1 size-5 shrink-0 text-blue-600" />

              <div>
                <h3 className="font-semibold">
                  Simple by design
                </h3>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Keep the interface clean and focus on the tools teams
                  actually need.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <CheckCircle2 className="mt-1 size-5 shrink-0 text-blue-600" />

              <div>
                <h3 className="font-semibold">
                  Clear ownership
                </h3>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Every task should have a clear owner and every project
                  should have a clear direction.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <CheckCircle2 className="mt-1 size-5 shrink-0 text-blue-600" />

              <div>
                <h3 className="font-semibold">
                  Built to grow
                </h3>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  TaskFlow is designed to support teams as their projects
                  and workflows become more complex.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 md:pb-24 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-blue-600 px-6 py-14 text-center text-white sm:px-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to bring your team together?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-blue-100">
            Start organizing your projects and tasks with TaskFlow
            today.
          </p>

         <Button
  size="lg"
  variant="secondary"
  className="mt-8"
  render={
    <a href="/register">Get Started</a>
  }
  nativeButton={false}
>
  Get Started
</Button>
        </div>
      </section>
    </div>
  );
}

