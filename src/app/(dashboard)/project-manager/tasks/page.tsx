
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CheckCircle2,
  CircleAlert,
  Clock3,
  ListTodo,
} from "lucide-react";

import apiClient from "@/lib/apiClient";
import { getMyOrganizations } from "@/api/organization";

type Organization = {
  id: string;
  name: string;
};

type OrganizationResponse = {
  success: boolean;
  message: string;
  data: Organization[];
};

type Project = {
  id: string;
  name: string;
};

type ProjectsResponse = {
  success: boolean;
  message: string;
  data: Project[];
};

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  createdAt: string;
  project?: {
    id: string;
    name: string;
  };
  assignee?: {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
  } | null;
};

type TasksResponse = {
  success: boolean;
  message: string;
  data: Task[];
};

const ManagerTasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // Get current organization
      const organizationResponse =
        (await getMyOrganizations()) as OrganizationResponse;

      const organization = organizationResponse.data?.[0];

      if (!organization?.id) {
        throw new Error("No organization found");
      }

      // Get organization's projects
      const projectsResponse =
        await apiClient<ProjectsResponse>(
          `/projects/organization/${organization.id}`,
        );

      const projects = projectsResponse.data || [];

      // Get tasks from every project
      const taskResponses = await Promise.all(
        projects.map((project) =>
          apiClient<TasksResponse>(
            `/tasks/project/${project.id}`,
          ),
        ),
      );

      // Combine all project tasks
      const allTasks = taskResponses.flatMap(
        (response, index) =>
          (response.data || []).map((task) => ({
            ...task,
            project: {
              id: projects[index].id,
              name: projects[index].name,
            },
          })),
      );

      setTasks(allTasks);
    } catch (err) {
      console.error("Failed to load tasks:", err);

      setError(
        err instanceof Error ? err.message : "Failed to load tasks",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "COMPLETED",
  ).length;

  const pendingTasks = tasks.filter(
    (task) =>
      task.status !== "COMPLETED" &&
      task.status !== "CANCELLED",
  ).length;

  const highPriorityTasks = tasks.filter(
    (task) => task.priority === "HIGH",
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Task Management
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage and monitor tasks across your projects.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Tasks */}
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Total Tasks
              </p>

              <p className="mt-2 text-2xl font-bold">
                {loading ? "—" : totalTasks}
              </p>
            </div>

            <div className="rounded-lg bg-primary/10 p-3">
              <ListTodo className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>

        {/* Completed */}
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Completed
              </p>

              <p className="mt-2 text-2xl font-bold">
                {loading ? "—" : completedTasks}
              </p>
            </div>

            <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900/30">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Pending
              </p>

              <p className="mt-2 text-2xl font-bold">
                {loading ? "—" : pendingTasks}
              </p>
            </div>

            <div className="rounded-lg bg-yellow-100 p-3 dark:bg-yellow-900/30">
              <Clock3 className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* High Priority */}
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                High Priority
              </p>

              <p className="mt-2 text-2xl font-bold">
                {loading ? "—" : highPriorityTasks}
              </p>
            </div>

            <div className="rounded-lg bg-red-100 p-3 dark:bg-red-900/30">
              <CircleAlert className="h-5 w-5 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="rounded-xl border bg-card">
        <div className="border-b p-5">
          <h2 className="font-semibold">All Tasks</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Tasks from your organization projects.
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="space-y-4 p-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-12 animate-pulse rounded-md bg-muted"
              />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          /* Empty */
          <div className="p-10 text-center">
            <ListTodo className="mx-auto h-10 w-10 text-muted-foreground" />

            <h3 className="mt-4 font-semibold">
              No tasks found
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              There are no tasks in your organization yet.
            </p>
          </div>
        ) : (
          /* Table */
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b text-left text-sm text-muted-foreground">
                  <th className="px-5 py-4 font-medium">
                    Task
                  </th>

                  <th className="px-5 py-4 font-medium">
                    Project
                  </th>

                  <th className="px-5 py-4 font-medium">
                    Status
                  </th>

                  <th className="px-5 py-4 font-medium">
                    Priority
                  </th>

                  <th className="px-5 py-4 font-medium">
                    Assignee
                  </th>

                  <th className="px-5 py-4 font-medium">
                    Created
                  </th>
                </tr>
              </thead>

              <tbody>
                {tasks.map((task) => (
                  <tr
                    key={task.id}
                    className="border-b last:border-0 hover:bg-muted/40"
                  >
                    {/* Task */}
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium">
                          {task.title}
                        </p>

                        {task.description && (
                          <p className="mt-1 max-w-xs truncate text-sm text-muted-foreground">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Project */}
                    <td className="px-5 py-4">
                      {task.project?.name || "—"}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        {task.status}
                      </span>
                    </td>

                    {/* Priority */}
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          task.priority === "HIGH"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            : task.priority === "MEDIUM"
                              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                              : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        }`}
                      >
                        {task.priority}
                      </span>
                    </td>

                    {/* Assignee */}
                    <td className="px-5 py-4">
                      {task.assignee ? (
                        <div>
                          <p className="font-medium">
                            {task.assignee.name}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            {task.assignee.email}
                          </p>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          Unassigned
                        </span>
                      )}
                    </td>

                    {/* Created */}
                    <td className="px-5 py-4 text-sm text-muted-foreground">
                      {new Date(
                        task.createdAt,
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerTasksPage;
