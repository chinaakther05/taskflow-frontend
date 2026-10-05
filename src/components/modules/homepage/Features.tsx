
import {
  CheckCircle2,
  FolderKanban,
  ListTodo,
  Users,
  BarChart3,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: FolderKanban,
    title: "Project Management",
    description:
      "Organize your projects, set priorities, and keep every important detail in one structured workspace.",
  },
  {
    icon: ListTodo,
    title: "Smart Task Management",
    description:
      "Create, assign, prioritize, and track tasks so everyone knows what needs to be done next.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Bring your team together with shared projects, task assignments, comments, and real-time updates.",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description:
      "Get a clear overview of project progress and understand what is completed and what needs attention.",
  },
  {
    icon: ShieldCheck,
    title: "Role-Based Access",
    description:
      "Keep your workspace organized with permissions designed for admins, managers, and team members.",
  },
  {
    icon: CheckCircle2,
    title: "Stay Organized",
    description:
      "Reduce scattered work and keep projects, tasks, and team activities together in one simple place.",
  },
];

const Features = () => {
  return (
    <section className="w-full border-b">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Powerful features
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to manage your work
          </h2>

          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            From planning projects to tracking progress, TaskFlow gives your
            team the tools to stay organized and work better together.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-2xl border bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Icon */}
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white">
                  <Icon className="size-5" />
                </div>

                {/* Content */}
                <h3 className="mt-5 text-lg font-semibold">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </p>

                {/* Small bottom indicator */}
                <div className="mt-5 flex items-center gap-2 text-sm font-medium text-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span>Learn more</span>
                  <span>→</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;

