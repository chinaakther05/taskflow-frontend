
import {
  UserPlus,
  FolderPlus,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create your workspace",
    description:
      "Sign up and create your workspace in just a few moments. Invite your team and get started.",
  },
  {
    number: "02",
    icon: FolderPlus,
    title: "Organize your work",
    description:
      "Create projects, add tasks, assign responsibilities, and keep everything organized in one place.",
  },
  {
    number: "03",
    icon: CheckCircle2,
    title: "Track and complete",
    description:
      "Monitor progress, collaborate with your team, and complete your work with confidence.",
  },
];

const HowItWorks = () => {
  return (
    <section className="w-full border-b">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            How it works
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Get your team organized in three simple steps
          </h2>

          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            TaskFlow makes it simple to plan, manage, and complete your work
            without unnecessary complexity.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-16 grid gap-8 md:grid-cols-3">
          {/* Connecting line */}
          <div className="absolute left-[16.66%] right-[16.66%] top-16 hidden h-px bg-border md:block" />

          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="relative flex flex-col items-center text-center"
              >
                {/* Number + Icon */}
                <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl border bg-background shadow-sm">
                  <Icon className="size-8 text-blue-600" />

                  <span className="absolute -right-2 -top-2 flex h-7 min-w-7 items-center justify-center rounded-full bg-blue-600 px-1.5 text-xs font-bold text-white">
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <h3 className="mt-6 text-lg font-semibold">
                  {step.title}
                </h3>

                <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
                  {step.description}
                </p>

                {/* Arrow */}
                {step.number !== "03" && (
                  <ArrowRight className="mt-6 hidden size-5 text-muted-foreground/50 md:block" />
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Highlight */}
        <div className="mx-auto mt-16 max-w-3xl rounded-2xl border bg-background p-6 text-center shadow-sm sm:p-8">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-600/10 text-blue-600">
            <CheckCircle2 className="size-5" />
          </div>

          <h3 className="mt-4 text-lg font-semibold">
            Simple setup. Powerful workflow.
          </h3>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Spend less time managing your workflow and more time getting
            meaningful work done with your team.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

