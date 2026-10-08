
"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/apiClient";
import { getMyOrganizations } from "@/api/organization";
import { useGetMe } from "@/hooks";


type TaskStatus =
  | "PENDING_ACCEPTANCE"
  | "TODO"
  | "IN_PROGRESS"
  | "IN_REVIEW"
  | "DONE";

type TaskPriority =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "URGENT";

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
  deadline: string | null;
  assignee: {
    id: string;
    name: string;
    email: string;
  } | null;
  creator: {
    id: string;
    name: string;
    email: string;
  };
  _count: {
    comments: number;
    timeLogs: number;
    attachments: number;
  };
};

type Project = {
  id: string;
  name: string;
};

const MyTasksPage = () => {
  const { data: userResponse } = useGetMe();

  const user = userResponse?.data;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(
    null,
  );
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setIsLoading(true);
        setError("");

        // Get current organization
        const organizationResponse = await getMyOrganizations();

        const organization = organizationResponse.data?.[0];

        if (!organization?.id) {
          throw new Error("No organization found");
        }

        // Get organization projects
        const projectResponse = await apiClient<{
          success: boolean;
          message: string;
          data: Project[];
        }>(`/projects/organization/${organization.id}`);

        const organizationProjects = projectResponse.data || [];

        setProjects(organizationProjects);

        // Get tasks from every project
        const taskResponses = await Promise.all(
          organizationProjects.map((project) =>
            apiClient<{
              success: boolean;
              message: string;
              data: Task[];
            }>(`/tasks/project/${project.id}`),
          ),
        );

        // Combine all tasks
        const allTasks = taskResponses.flatMap(
          (response) => response.data || [],
        );

        // Only tasks assigned to current logged-in member
        const myTasks = allTasks.filter(
          (task) => task.assignee?.id === user?.id,
        );

        setTasks(myTasks);
      } catch (err) {
        console.error("Failed to load tasks:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load your tasks.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      loadTasks();
    }
  }, [user?.id]);

  // Update task status
  const updateTaskStatus = async (
    taskId: string,
    status: TaskStatus,
  ) => {
    try {
      setUpdatingTaskId(taskId);
      setError("");

      await apiClient(`/tasks/${taskId}`, {
        method: "PATCH",
        body: {
          status,
        },
      });

      // Update UI immediately
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                status,
              }
            : task,
        ),
      );
    } catch (err) {
      console.error("Failed to update task status:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update task status.",
      );
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const pendingTasks = tasks.filter(
    (task) => task.status !== "DONE",
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status === "DONE",
  ).length;

  const getStatusLabel = (status: TaskStatus) => {
    switch (status) {
      case "PENDING_ACCEPTANCE":
        return "Pending Acceptance";

      case "TODO":
        return "Todo";

      case "IN_PROGRESS":
        return "In Progress";

      case "IN_REVIEW":
        return "In Review";

      case "DONE":
        return "Completed";

      default:
        return status;
    }
  };

  const getPriorityClass = (priority: TaskPriority) => {
    switch (priority) {
      case "URGENT":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";

      case "HIGH":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";

      case "MEDIUM":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";

      case "LOW":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";

      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div>
          <div className="h-8 w-40 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-4 w-64 animate-pulse rounded bg-muted" />
        </div>

        {/* Stats Skeleton */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-lg bg-muted"
            />
          ))}
        </div>

        {/* Table Skeleton */}
        <div className="rounded-lg border p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-12 animate-pulse rounded bg-muted"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          My Tasks
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          View and update tasks assigned to you.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* My Tasks */}
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            My Tasks
          </p>

          <p className="mt-2 text-3xl font-bold">
            {tasks.length}
          </p>
        </div>

        {/* Pending */}
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Pending
          </p>

          <p className="mt-2 text-3xl font-bold">
            {pendingTasks}
          </p>
        </div>

        {/* Completed */}
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Completed
          </p>

          <p className="mt-2 text-3xl font-bold">
            {completedTasks}
          </p>
        </div>
      </div>

      {/* Assigned Tasks */}
      <div className="rounded-xl border bg-card">
        <div className="border-b p-5">
          <h2 className="font-semibold">
            Assigned Tasks
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Tasks assigned to you by your project manager.
          </p>
        </div>

        {tasks.length === 0 ? (
          <div className="p-10 text-center">
            <h3 className="font-semibold">
              No tasks assigned to you.
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Your assigned tasks will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead>
                <tr className="border-b text-left text-sm text-muted-foreground">
                  <th className="px-6 py-4 font-medium">
                    Task
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Priority
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Status
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Deadline
                  </th>

                  <th className="px-6 py-4 font-medium">
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
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">
                          {task.title}
                        </p>

                        {task.description && (
                          <p className="mt-1 max-w-md truncate text-sm text-muted-foreground">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Priority */}
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getPriorityClass(
                          task.priority,
                        )}`}
                      >
                        {task.priority}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <select
                        value={task.status}
                        disabled={
                          updatingTaskId === task.id
                        }
                        onChange={(event) =>
                          updateTaskStatus(
                            task.id,
                            event.target.value as TaskStatus,
                          )
                        }
                        className="rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <option value="PENDING_ACCEPTANCE">
                          Pending Acceptance
                        </option>

                        <option value="TODO">
                          Todo
                        </option>

                        <option value="IN_PROGRESS">
                          In Progress
                        </option>

                        <option value="IN_REVIEW">
                          In Review
                        </option>

                        {/* Backend value = DONE */}
                        <option value="DONE">
                          Completed
                        </option>
                      </select>

                      {updatingTaskId === task.id && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          Updating...
                        </p>
                      )}
                    </td>

                    {/* Deadline */}
                    <td className="px-6 py-4 text-sm">
                      {task.deadline
                        ? new Date(
                            task.deadline,
                          ).toLocaleDateString()
                        : "No deadline"}
                    </td>

                    {/* Created */}
                    <td className="px-6 py-4 text-sm text-muted-foreground">
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

export default MyTasksPage;

