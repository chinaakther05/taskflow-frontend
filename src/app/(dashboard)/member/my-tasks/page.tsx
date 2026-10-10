
"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/apiClient";
import { getMyOrganizations } from "@/api/organization";
import { useGetMe } from "@/hooks";


type Task = {
  id: string;
  title: string;
  description: string | null;
  status:
    | "PENDING_ACCEPTANCE"
    | "TODO"
    | "IN_PROGRESS"
    | "IN_REVIEW"
    | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
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
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setIsLoading(true);
        setError("");

        const organizationResponse = await getMyOrganizations();
        const organization = organizationResponse.data?.[0];

        if (!organization?.id) {
          throw new Error("No organization found");
        }

        const projectResponse = await apiClient<{
          success: boolean;
          data: Project[];
        }>(`/projects/organization/${organization.id}`);

        const organizationProjects = projectResponse.data || [];
        setProjects(organizationProjects);

        const taskResponses = await Promise.all(
          organizationProjects.map((project) =>
            apiClient<{
              success: boolean;
              data: Task[];
            }>(`/tasks/project/${project.id}`)
          )
        );

        const allTasks = taskResponses.flatMap(
          (response) => response.data || []
        );

        const myTasks = allTasks.filter(
          (task) => task.assignee?.id === user?.id
        );

        setTasks(myTasks);
      } catch (err) {
        console.error(err);
        setError("Failed to load your tasks.");
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      loadTasks();
    }
  }, [user?.id]);

  const updateTaskStatus = async (
    taskId: string,
    status: Task["status"]
  ) => {
    try {
      await apiClient(`/tasks/${taskId}`, {
        method: "PATCH",
        body: {
          status,
        },
      });

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === taskId ? { ...task, status } : task
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update task status.");
    }
  };

  const getProjectName = (task: Task) => {
    const project = projects.find((project) =>
      tasks.some((item) => item.id === task.id)
    );

    return project?.name || "Project";
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-40 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-4 w-64 animate-pulse rounded bg-muted" />
        </div>

        <div className="rounded-lg border p-6">
          <div className="space-y-4">
            <div className="h-6 w-1/3 animate-pulse rounded bg-muted" />
            <div className="h-12 w-full animate-pulse rounded bg-muted" />
            <div className="h-12 w-full animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-6">
        <h2 className="font-semibold text-destructive">Something went wrong</h2>
        <p className="mt-1 text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">My Tasks</h1>
        <p className="text-sm text-muted-foreground">
          View and update tasks assigned to you.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border bg-card p-5">
          <p className="text-sm text-muted-foreground">My Tasks</p>
          <p className="mt-2 text-3xl font-bold">{tasks.length}</p>
        </div>

        <div className="rounded-lg border bg-card p-5">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="mt-2 text-3xl font-bold">
            {tasks.filter((task) => task.status !== "DONE").length}
          </p>
        </div>

        <div className="rounded-lg border bg-card p-5">
          <p className="text-sm text-muted-foreground">Completed</p>
          <p className="mt-2 text-3xl font-bold">
            {tasks.filter((task) => task.status === "DONE").length}
          </p>
        </div>
      </div>

      {/* Tasks */}
      <div className="rounded-lg border bg-card">
        <div className="border-b p-6">
          <h2 className="text-lg font-semibold">Assigned Tasks</h2>
          <p className="text-sm text-muted-foreground">
            Tasks assigned to you by your project manager.
          </p>
        </div>

        {tasks.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-medium">No tasks assigned to you.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Your assigned tasks will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-muted-foreground">
                  <th className="px-6 py-4">Task</th>
                  <th className="px-6 py-4">Priority</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Deadline</th>
                  <th className="px-6 py-4">Created</th>
                </tr>
              </thead>

              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id} className="border-b last:border-0">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{task.title}</p>

                        {task.description && (
                          <p className="mt-1 max-w-md truncate text-sm text-muted-foreground">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm font-medium">
                        {task.priority}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <select
                        value={task.status}
                        onChange={(event) =>
                          updateTaskStatus(
                            task.id,
                            event.target.value as Task["status"]
                          )
                        }
                        className="rounded-md border bg-background px-3 py-2 text-sm"
                      >
                        <option value="PENDING_ACCEPTANCE">
                          Pending Acceptance
                        </option>
                        <option value="TODO">Todo</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="IN_REVIEW">In Review</option>
                        <option value="DONE">Done</option>
                      </select>
                    </td>

                    <td className="px-6 py-4 text-sm">
                      {task.deadline
                        ? new Date(task.deadline).toLocaleDateString()
                        : "No deadline"}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      {new Date(task.createdAt).toLocaleDateString()}
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

