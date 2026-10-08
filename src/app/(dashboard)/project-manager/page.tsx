
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CheckSquare,
  FolderKanban,
  ListTodo,
  Users,
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

type ProjectsResponse = {
  success: boolean;
  message: string;
  data: Project[];
};

type Member = {
  id: string;
  role: string;
  joinedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    isActive: boolean;
  };
};

type MembersResponse = {
  success: boolean;
  message: string;
  data: Member[];
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
};

type TasksResponse = {
  success: boolean;
  message: string;
  data: Task[];
};

type DashboardTask = Task & {
  project: {
    id: string;
    name: string;
  };
};

const ProjectManagerDashboardPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [tasks, setTasks] = useState<DashboardTask[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = useCallback(async () => {
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

      // Get projects and members
      const [projectsResponse, membersResponse] =
        await Promise.all([
          apiClient<ProjectsResponse>(
            `/projects/organization/${organization.id}`,
          ),

          apiClient<MembersResponse>(
            `/organization-members/${organization.id}`,
          ),
        ]);

      const projectList = projectsResponse.data || [];
      const memberList = membersResponse.data || [];

      setProjects(projectList);
      setMembers(memberList);

      // Get tasks from every project
      const taskResponses = await Promise.all(
        projectList.map((project) =>
          apiClient<TasksResponse>(
            `/tasks/project/${project.id}`,
          ),
        ),
      );

      const allTasks: DashboardTask[] =
        taskResponses.flatMap((response, index) =>
          (response.data || []).map((task) => ({
            ...task,
            project: {
              id: projectList[index].id,
              name: projectList[index].name,
            },
          })),
        );

      setTasks(allTasks);
    } catch (err) {
      console.error("Failed to load dashboard:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load dashboard data",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Statistics
  const totalProjects = projects.length;

  const totalTasks = tasks.length;

  const pendingTasks = tasks.filter(
    (task) => task.status !== "DONE",
  ).length;

  const teamMembers = members.length;

  // Show only latest 5 projects
  const recentProjects = [...projects]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  // Show only latest 5 tasks
  const recentTasks = [...tasks]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  const getStatusClass = (status: Task["status"]) => {
    switch (status) {
      case "DONE":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";

      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";

      case "IN_REVIEW":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";

      case "TODO":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";

      case "PENDING_ACCEPTANCE":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";

      default:
        return "bg-muted text-muted-foreground";
    }
  };

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

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

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
            {loading ? "—" : totalProjects}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Projects in your organization
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
            {loading ? "—" : totalTasks}
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
            {loading ? "—" : pendingTasks}
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
            {loading ? "—" : teamMembers}
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

        {loading ? (
          <div className="space-y-3 p-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-14 animate-pulse rounded-lg bg-muted"
              />
            ))}
          </div>
        ) : recentProjects.length === 0 ? (
          <div className="flex min-h-[180px] items-center justify-center p-6">
            <div className="text-center">
              <FolderKanban className="mx-auto size-8 text-muted-foreground" />

              <p className="mt-3 text-sm font-medium">
                No projects found
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Create a project to get started.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b text-left text-sm text-muted-foreground">
                  <th className="px-5 py-4 font-medium">
                    Project
                  </th>

                  <th className="px-5 py-4 font-medium">
                    Status
                  </th>

                  <th className="px-5 py-4 font-medium">
                    Tasks
                  </th>

                  <th className="px-5 py-4 font-medium">
                    Members
                  </th>

                  <th className="px-5 py-4 font-medium">
                    Created
                  </th>
                </tr>
              </thead>

              <tbody>
                {recentProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="border-b last:border-0 hover:bg-muted/40"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium">
                        {project.name}
                      </p>

                      {project.description && (
                        <p className="mt-1 max-w-sm truncate text-xs text-muted-foreground">
                          {project.description}
                        </p>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        {project.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      {project._count.tasks}
                    </td>

                    <td className="px-5 py-4">
                      {project._count.members}
                    </td>

                    <td className="px-5 py-4 text-sm text-muted-foreground">
                      {new Date(
                        project.createdAt,
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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

        {loading ? (
          <div className="space-y-3 p-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-14 animate-pulse rounded-lg bg-muted"
              />
            ))}
          </div>
        ) : recentTasks.length === 0 ? (
          <div className="flex min-h-[180px] items-center justify-center p-6">
            <div className="text-center">
              <ListTodo className="mx-auto size-8 text-muted-foreground" />

              <p className="mt-3 text-sm font-medium">
                No tasks found
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Tasks from your projects will appear here.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
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
                </tr>
              </thead>

              <tbody>
                {recentTasks.map((task) => (
                  <tr
                    key={task.id}
                    className="border-b last:border-0 hover:bg-muted/40"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium">
                        {task.title}
                      </p>

                      {task.description && (
                        <p className="mt-1 max-w-xs truncate text-xs text-muted-foreground">
                          {task.description}
                        </p>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      {task.project.name}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                          task.status,
                        )}`}
                      >
                        {task.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
                        {task.priority}
                      </span>
                    </td>

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

export default ProjectManagerDashboardPage;

