"use client";

import {
  CheckSquare,
  FolderKanban,
  ListTodo,
  Users,
} from "lucide-react";

const ProjectManagerDashboardPage = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Project Manager Dashboard
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage your projects, tasks, and team members.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Projects */}
        <div className="rounded-xl border bg-background p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <FolderKanban className="size-5 text-primary" />
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Total Projects
          </p>

          <p className="mt-1 text-2xl font-bold">
            —
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Projects you manage
          </p>
        </div>

        {/* Tasks */}
        <div className="rounded-xl border bg-background p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
            <ListTodo className="size-5 text-blue-600" />
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Total Tasks
          </p>

          <p className="mt-1 text-2xl font-bold">
            —
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Tasks across your projects
          </p>
        </div>

        {/* Pending Tasks */}
        <div className="rounded-xl border bg-background p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
            <CheckSquare className="size-5 text-orange-600" />
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Pending Tasks
          </p>

          <p className="mt-1 text-2xl font-bold">
            —
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Tasks waiting for completion
          </p>
        </div>

        {/* Team Members */}
        <div className="rounded-xl border bg-background p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
            <Users className="size-5 text-green-600" />
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Team Members
          </p>

          <p className="mt-1 text-2xl font-bold">
            —
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Members in your organization
          </p>
        </div>
      </div>

      {/* Projects Section */}
      <div className="rounded-xl border bg-background shadow-sm">
        <div className="border-b p-5">
          <h2 className="font-semibold">
            My Projects
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Projects you are managing.
          </p>
        </div>

        <div className="flex min-h-[180px] items-center justify-center p-6">
          <div className="text-center">
            <FolderKanban className="mx-auto size-8 text-muted-foreground" />

            <p className="mt-3 text-sm font-medium">
              No project data yet
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Project information will appear here.
            </p>
          </div>
        </div>
      </div>

      {/* Tasks Section */}
      <div className="rounded-xl border bg-background shadow-sm">
        <div className="border-b p-5">
          <h2 className="font-semibold">
            Recent Tasks
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Recent tasks from your projects.
          </p>
        </div>

        <div className="flex min-h-[180px] items-center justify-center p-6">
          <div className="text-center">
            <ListTodo className="mx-auto size-8 text-muted-foreground" />

            <p className="mt-3 text-sm font-medium">
              No task data yet
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Recent task information will appear here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectManagerDashboardPage;