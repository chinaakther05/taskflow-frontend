
import {
  BarChart3,
  CheckCircle2,
  Clock3,
  FolderKanban,
  Users,
} from "lucide-react";

const DashboardPreview = () => {
  return (
    <section className="w-full border-b">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Your workspace
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            See everything at a glance
          </h2>

          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            A clean and intuitive dashboard helps your team stay focused,
            track progress, and manage work without the clutter.
          </p>
        </div>

        {/* Dashboard Window */}
        <div className="relative mx-auto mt-14 max-w-6xl">
          {/* Glow */}
          <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-blue-600/10 blur-3xl" />

          <div className="overflow-hidden rounded-2xl border bg-background shadow-2xl">
            {/* Browser Header */}
            <div className="flex h-12 items-center gap-2 border-b bg-muted/30 px-4">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />

              <div className="ml-4 hidden h-7 flex-1 items-center rounded-md border bg-background px-3 text-xs text-muted-foreground sm:flex">
                taskflow.app/dashboard
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="grid min-h-[420px] grid-cols-1 md:grid-cols-[190px_1fr]">
              {/* Sidebar */}
              <aside className="hidden border-r bg-muted/20 p-4 md:block">
                <div className="mb-8 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                    T
                  </div>

                  <span className="font-semibold">TaskFlow</span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="rounded-lg bg-blue-600/10 px-3 py-2 font-medium text-blue-600">
                    Dashboard
                  </div>

                  <div className="px-3 py-2 text-muted-foreground">
                    Projects
                  </div>

                  <div className="px-3 py-2 text-muted-foreground">
                    Tasks
                  </div>

                  <div className="px-3 py-2 text-muted-foreground">
                    Team
                  </div>
                </div>
              </aside>

              {/* Main Dashboard */}
              <main className="p-5 sm:p-7">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Welcome back
                    </p>

                    <h3 className="mt-1 text-xl font-bold">
                      Project Overview
                    </h3>
                  </div>

                  <div className="rounded-lg border px-3 py-2 text-xs text-muted-foreground">
                    This Month
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                  <div className="rounded-xl border p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Projects
                      </span>

                      <FolderKanban className="size-4 text-blue-600" />
                    </div>

                    <p className="mt-3 text-2xl font-bold">12</p>
                    <p className="mt-1 text-xs text-green-600">
                      +12% this month
                    </p>
                  </div>

                  <div className="rounded-xl border p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Tasks
                      </span>

                      <CheckCircle2 className="size-4 text-blue-600" />
                    </div>

                    <p className="mt-3 text-2xl font-bold">48</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      36 completed
                    </p>
                  </div>

                  <div className="rounded-xl border p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Team
                      </span>

                      <Users className="size-4 text-blue-600" />
                    </div>

                    <p className="mt-3 text-2xl font-bold">18</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Active members
                    </p>
                  </div>

                  <div className="rounded-xl border p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Hours
                      </span>

                      <Clock3 className="size-4 text-blue-600" />
                    </div>

                    <p className="mt-3 text-2xl font-bold">126h</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Logged this month
                    </p>
                  </div>
                </div>

                {/* Bottom Area */}
                <div className="mt-5 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
                  {/* Progress */}
                  <div className="rounded-xl border p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">
                          Project Progress
                        </h4>

                        <p className="mt-1 text-xs text-muted-foreground">
                          Overall team progress
                        </p>
                      </div>

                      <BarChart3 className="size-5 text-blue-600" />
                    </div>

                    <div className="mt-6 space-y-5">
                      <div>
                        <div className="mb-2 flex justify-between text-xs">
                          <span>Website Redesign</span>
                          <span>82%</span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                          <div className="h-full w-[82%] rounded-full bg-blue-600" />
                        </div>
                      </div>

                      <div>
                        <div className="mb-2 flex justify-between text-xs">
                          <span>Mobile Application</span>
                          <span>64%</span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                          <div className="h-full w-[64%] rounded-full bg-blue-600" />
                        </div>
                      </div>

                      <div>
                        <div className="mb-2 flex justify-between text-xs">
                          <span>Marketing Campaign</span>
                          <span>45%</span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                          <div className="h-full w-[45%] rounded-full bg-blue-600" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="rounded-xl border p-5">
                    <h4 className="font-semibold">
                      Recent Activity
                    </h4>

                    <div className="mt-5 space-y-4">
                      <div className="flex gap-3">
                        <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-green-500" />

                        <div>
                          <p className="text-sm">
                            Task completed
                          </p>

                          <p className="text-xs text-muted-foreground">
                            5 minutes ago
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-600" />

                        <div>
                          <p className="text-sm">
                            New project created
                          </p>

                          <p className="text-xs text-muted-foreground">
                            32 minutes ago
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-purple-500" />

                        <div>
                          <p className="text-sm">
                            Team member joined
                          </p>

                          <p className="text-xs text-muted-foreground">
                            1 hour ago
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="mx-auto mt-10 flex max-w-3xl flex-col items-center text-center">
          <p className="text-sm text-muted-foreground">
            Projects, tasks, team activity, and progress — everything your
            team needs is just a glance away.
          </p>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;