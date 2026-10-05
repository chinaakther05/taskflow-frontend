
import {
  CheckSquare,
  FolderKanban,
  CreditCard,
  Users,
  ArrowUpRight,
  Clock3,
  CircleCheck,
  AlertCircle,
} from "lucide-react";

const stats = [
  {
    title: "Total Members",
    value: "24",
    description: "+4 this month",
    icon: Users,
  },
  {
    title: "Total Projects",
    value: "12",
    description: "+2 this month",
    icon: FolderKanban,
  },
  {
    title: "Total Tasks",
    value: "86",
    description: "18 pending",
    icon: CheckSquare,
  },
  {
    title: "Total Payments",
    value: "$2,450",
    description: "+12.5% this month",
    icon: CreditCard,
  },
];

const recentProjects = [
  {
    name: "Website Redesign",
    status: "In Progress",
    progress: 72,
  },
  {
    name: "Mobile App",
    status: "Completed",
    progress: 100,
  },
  {
    name: "Marketing Campaign",
    status: "Pending",
    progress: 35,
  },
];

const activities = [
  "New member joined the workspace",
  "Project Website Redesign was updated",
  "Payment received successfully",
  "New task was assigned",
];

export default function AdminPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of your workspace and recent activities.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border bg-background p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>

                <ArrowUpRight className="size-4 text-muted-foreground" />
              </div>

              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  {stat.title}
                </p>

                <h2 className="mt-1 text-2xl font-bold">
                  {stat.value}
                </h2>

                <p className="mt-1 text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Recent Projects */}
        <div className="rounded-xl border bg-background shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between border-b p-5">
            <div>
              <h2 className="font-semibold">Recent Projects</h2>
              <p className="text-sm text-muted-foreground">
                Latest workspace projects
              </p>
            </div>

            <button className="text-sm font-medium text-primary hover:underline">
              View all
            </button>
          </div>

          <div className="divide-y">
            {recentProjects.map((project) => (
              <div
                key={project.name}
                className="p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-medium">
                      {project.name}
                    </h3>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {project.status}
                    </p>
                  </div>

                  <span className="text-sm font-semibold">
                    {project.progress}%
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl border bg-background shadow-sm">
          <div className="border-b p-5">
            <h2 className="font-semibold">Recent Activity</h2>
            <p className="text-sm text-muted-foreground">
              Latest workspace activity
            </p>
          </div>

          <div className="divide-y">
            {activities.map((activity, index) => (
              <div
                key={activity}
                className="flex gap-3 p-4"
              >
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {index === 0 ? (
                    <Users className="size-4" />
                  ) : index === 1 ? (
                    <FolderKanban className="size-4" />
                  ) : index === 2 ? (
                    <CircleCheck className="size-4" />
                  ) : (
                    <CheckSquare className="size-4" />
                  )}
                </div>

                <div>
                  <p className="text-sm">{activity}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Recently
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Overview */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-4 rounded-xl border bg-background p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Clock3 className="size-5" />
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Pending Tasks
            </p>
            <p className="text-xl font-bold">18</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border bg-background p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CircleCheck className="size-5" />
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Completed Tasks
            </p>
            <p className="text-xl font-bold">68</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border bg-background p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <AlertCircle className="size-5" />
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Pending Requests
            </p>
            <p className="text-xl font-bold">5</p>
          </div>
        </div>
      </div>
    </div>
  );
}

