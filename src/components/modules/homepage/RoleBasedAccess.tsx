
import {
  ShieldCheck,
  UserCog,
  Users,
  CheckCircle2,
} from "lucide-react";

const roles = [
  {
    icon: ShieldCheck,
    role: "Admin",
    description:
      "Manage the entire workspace, users, roles, and organization settings.",
    permissions: [
      "Manage organization",
      "Manage users & roles",
      "Control workspace settings",
      "Monitor overall activity",
    ],
  },
  {
    icon: UserCog,
    role: "Project Manager",
    description:
      "Plan projects, assign tasks, and keep the team moving toward its goals.",
    permissions: [
      "Create & manage projects",
      "Assign tasks to members",
      "Track project progress",
      "Manage team workflow",
    ],
  },
  {
    icon: Users,
    role: "Member",
    description:
      "Focus on assigned work, collaborate with teammates, and keep tasks updated.",
    permissions: [
      "View assigned projects",
      "Update task status",
      "Collaborate with team",
      "Track personal progress",
    ],
  },
];

const RoleBasedAccess = () => {
  return (
    <section className="w-full border-b">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Role-based access
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Everyone gets the right level of access
          </h2>

          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Keep your workspace secure and organized with permissions designed
            for every member of your team.
          </p>
        </div>

        {/* Roles */}
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {roles.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.role}
                className="group relative overflow-hidden rounded-2xl border bg-background p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Top Accent */}
                <div className="absolute inset-x-0 top-0 h-1 bg-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Icon */}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white">
                  <Icon className="size-6" />
                </div>

                {/* Role */}
                <h3 className="mt-6 text-xl font-semibold">
                  {item.role}
                </h3>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>

                {/* Permissions */}
                <div className="mt-6 space-y-3">
                  {item.permissions.map((permission) => (
                    <div
                      key={permission}
                      className="flex items-start gap-3 text-sm"
                    >
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-blue-600" />
                      <span>{permission}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Security Highlight */}
        <div className="mt-10 flex flex-col items-center justify-between gap-5 rounded-2xl border bg-blue-600/[0.04] p-6 sm:flex-row sm:p-7">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600/10 text-blue-600">
              <ShieldCheck className="size-5" />
            </div>

            <div>
              <h3 className="font-semibold">
                Secure access for every team member
              </h3>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Role-based permissions help ensure that users only access the
                features and information they need.
              </p>
            </div>
          </div>

          <div className="shrink-0 rounded-full border bg-background px-4 py-2 text-sm font-medium">
            Secure by design
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoleBasedAccess;

