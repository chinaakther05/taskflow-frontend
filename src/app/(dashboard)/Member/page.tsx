
"use client";

import { useCallback, useEffect, useState } from "react";
import { getMyOrganizations } from "@/api/organization";
import apiClient from "@/lib/apiClient";

type Project = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  createdAt: string;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  _count: {
    tasks: number;
    members: number;
  };
};

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
  assignee: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
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
  project: {
    id: string;
    name: string;
  };
};

type OrganizationResponse = {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
  }[];
};

type ProjectResponse = {
  success: boolean;
  message: string;
  data: Project[];
};

type TaskResponse = {
  success: boolean;
  message: string;
  data: Omit<Task, "project">[];
};

const MemberDashboardPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const organizationResponse =
        (await getMyOrganizations()) as OrganizationResponse;

      const organization = organizationResponse.data?.[0];

      if (!organization?.id) {
        throw new Error("No organization found");
      }

      const projectResponse = await apiClient<ProjectResponse>(
        `/projects/organization/${organization.id}`,
      );

      const projectList = projectResponse.data || [];

      setProjects(projectList);

      const taskResponses = await Promise.all(
        projectList.map((project) =>
          apiClient<TaskResponse>(`/tasks/project/${project.id}`),
        ),
      );

      const allTasks: Task[] = [];

      taskResponses.forEach((response, index) => {
        const project = projectList[index];

        response.data?.forEach((task) => {
          allTasks.push({
            ...task,
            project: {
              id: project.id,
              name: project.name,
            },
          });
        });
      });

      setTasks(allTasks);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const completedTasks = tasks.filter(
    (task) => task.status === "DONE",
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status !== "DONE",
  ).length;

  const myTasks = tasks.filter(
    (task) => task.assignee?.email === "member@taskflow.com",
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-56 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-4 w-72 animate-pulse rounded bg-muted" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-xl border bg-muted/40"
            />
          ))}
        </div>

        <div className="h-64 animate-pulse rounded-xl border bg-muted/40" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Member Dashboard
        </h1>
        <p className="mt-2 text-muted-foreground">
          View your projects and assigned tasks.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Projects</p>
          <p className="mt-2 text-3xl font-bold">{projects.length}</p>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">My Tasks</p>
          <p className="mt-2 text-3xl font-bold">{myTasks.length}</p>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Pending Tasks</p>
          <p className="mt-2 text-3xl font-bold">{pendingTasks}</p>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Completed Tasks</p>
          <p className="mt-2 text-3xl font-bold">{completedTasks}</p>
        </div>
      </div>

      {/* Projects */}
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="border-b p-5">
          <h2 className="text-lg font-semibold">My Projects</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Projects available in your organization.
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No projects found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="p-4 font-medium">Project</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Tasks</th>
                  <th className="p-4 font-medium">Members</th>
                  <th className="p-4 font-medium">Created</th>
                </tr>
              </thead>

              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} className="border-b last:border-0">
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{project.name}</p>
                        <p className="mt-1 max-w-md truncate text-xs text-muted-foreground">
                          {project.description || "No description"}
                        </p>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                        {project.status}
                      </span>
                    </td>

                    <td className="p-4">{project._count.tasks}</td>

                    <td className="p-4">{project._count.members}</td>

                    <td className="p-4 text-muted-foreground">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* My Tasks */}
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="border-b p-5">
          <h2 className="text-lg font-semibold">My Assigned Tasks</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Tasks assigned to you.
          </p>
        </div>

        {myTasks.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No tasks assigned to you.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="p-4 font-medium">Task</th>
                  <th className="p-4 font-medium">Project</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Priority</th>
                  <th className="p-4 font-medium">Created</th>
                </tr>
              </thead>

              <tbody>
                {myTasks.slice(0, 5).map((task) => (
                  <tr key={task.id} className="border-b last:border-0">
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="mt-1 max-w-sm truncate text-xs text-muted-foreground">
                          {task.description || "No description"}
                        </p>
                      </div>
                    </td>

                    <td className="p-4">{task.project.name}</td>

                    <td className="p-4">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                        {task.status.replaceAll("_", " ")}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                        {task.priority}
                      </span>
                    </td>

                    <td className="p-4 text-muted-foreground">
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

export default MemberDashboardPage;
