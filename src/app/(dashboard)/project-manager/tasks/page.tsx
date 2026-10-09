"use client";

import { useEffect, useState } from "react";

import apiClient from "@/lib/apiClient";
import { getMyOrganizations } from "@/api/organization";


type OrganizationResponse = {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
  }[];
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

type Member = {
  id: string;
  role: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    isActive: boolean;
  };
};

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  deadline: string | null;
  createdAt: string;
  projectId: string;
  projectName: string;
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
};

type ProjectResponse = {
  success: boolean;
  message: string;
  data: Project[];
};

type MemberResponse = {
  success: boolean;
  message: string;
  data: Member[];
};

type TaskResponse = {
  success: boolean;
  message: string;
  data: Task[];
};

const priorityOptions = ["LOW", "MEDIUM", "HIGH", "URGENT"];

const priorityLabels: Record<string, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
};

export default function ProjectManagerTasksPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  // Create task form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [deadline, setDeadline] = useState("");

  const [loading, setLoading] = useState(true);
  const [creatingTask, setCreatingTask] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(
    null,
  );

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    loadPageData();
  }, []);

  const loadPageData = async () => {
    try {
      setLoading(true);
      setError("");

      const organizationResponse =
        (await getMyOrganizations()) as OrganizationResponse;

      const organization = organizationResponse.data?.[0];

      if (!organization) {
        setError("No organization found.");
        return;
      }

      const [projectResponse, memberResponse] = await Promise.all([
        apiClient<ProjectResponse>(
          `/projects/organization/${organization.id}`,
        ),

        apiClient<MemberResponse>(
          `/organization-members/${organization.id}`,
        ),
      ]);

      const projectList = projectResponse.data || [];
      const memberList = memberResponse.data || [];

      setProjects(projectList);
      setMembers(memberList);

      const taskResults = await Promise.all(
        projectList.map(async (project) => {
          const response = await apiClient<TaskResponse>(
            `/tasks/project/${project.id}`,
          );

          return (response.data || []).map((task) => ({
            ...task,
            projectId: project.id,
            projectName: project.name,
          }));
        }),
      );

      setTasks(taskResults.flat());
    } catch (err) {
      console.error("Failed to load task page:", err);
      setError("Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    try {
      setCreatingTask(true);
      setError("");
      setSuccessMessage("");

      if (!title.trim()) {
        setError("Task title is required.");
        return;
      }

      if (!projectId) {
        setError("Please select a project.");
        return;
      }

      
      const formattedDeadline = deadline
        ? new Date(
            `${deadline}T00:00:00.000Z`,
          ).toISOString()
        : undefined;

      await apiClient("/tasks", {
        method: "POST",

        body: {
          title: title.trim(),

          description:
            description.trim() || undefined,

          projectId,

          priority,

          deadline: formattedDeadline,
        },
      });

      // Reset form
      setTitle("");
      setDescription("");
      setProjectId("");
      setPriority("MEDIUM");
      setDeadline("");

      setSuccessMessage(
        "Task created successfully.",
      );

      await loadPageData();
    } catch (err) {
      console.error(
        "Failed to create task:",
        err,
      );

      setError(
        "Failed to create task. Please check the information.",
      );
    } finally {
      setCreatingTask(false);
    }
  };

  const updateTaskStatus = async (
    taskId: string,
    newStatus: string,
  ) => {
    try {
      setUpdatingTaskId(taskId);
      setError("");
      setSuccessMessage("");

      await apiClient(`/tasks/${taskId}`, {
        method: "PATCH",

        body: {
          status: newStatus,
        },
      });

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                status: newStatus,
              }
            : task,
        ),
      );

      setSuccessMessage(
        "Task status updated.",
      );
    } catch (err) {
      console.error(
        "Failed to update status:",
        err,
      );

      setError(
        "Failed to update task status.",
      );
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const updateTaskAssignee = async (
    taskId: string,
    newAssigneeId: string,
  ) => {
    try {
      setUpdatingTaskId(taskId);
      setError("");
      setSuccessMessage("");

      await apiClient(`/tasks/${taskId}`, {
        method: "PATCH",

        body: {
          assigneeId:
            newAssigneeId || null,
        },
      });

      const selectedMember =
        members.find(
          (member) =>
            member.user.id ===
            newAssigneeId,
        );

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === taskId
            ? {
                ...task,

                assignee: selectedMember
                  ? {
                      id: selectedMember.user.id,
                      name: selectedMember.user.name,
                      email: selectedMember.user.email,
                    }
                  : null,
              }
            : task,
        ),
      );

      setSuccessMessage(
        "Task assignee updated.",
      );
    } catch (err) {
      console.error(
        "Failed to update assignee:",
        err,
      );

      setError(
        "Failed to update task assignee.",
      );
    } finally {
      setUpdatingTaskId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold">
            Tasks
          </h1>

          <p className="text-sm text-muted-foreground">
            Manage and assign tasks to your team
            members.
          </p>
        </div>

        <div className="h-40 animate-pulse rounded-lg bg-muted" />

        <div className="h-64 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          Tasks
        </h1>

        <p className="text-sm text-muted-foreground">
          Create, manage, and assign tasks to
          your team members.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Success */}
      {successMessage && (
        <div className="rounded-md border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700">
          {successMessage}
        </div>
      )}

      {/* ========================= */}
      {/* CREATE NEW TASK */}
      {/* ========================= */}

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            Create New Task
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Create a task and assign it from the
            task table.
          </p>
        </div>

        <form
          onSubmit={handleCreateTask}
          className="space-y-5"
        >
          {/* Task Title */}
          <div className="space-y-2">
           <label
  htmlFor="task-title"
  className="text-sm font-medium"
>
  Task Title
</label>

<input
  id="task-title"
  type="text"
  value={title}
  onChange={(event) => setTitle(event.target.value)}
  placeholder="Enter task title"
  className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
/>
          </div>

          {/* Description */}
         <div className="space-y-2">
  <label
    htmlFor="task-description"
    className="text-sm font-medium"
  >
    Description
  </label>

  <textarea
    id="task-description"
    value={description}
    onChange={(event) =>
      setDescription(event.target.value)
    }
    placeholder="Enter task description"
    rows={4}
    className="w-full resize-none rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
  />
</div>

          {/* Project */}
          <div className="space-y-2">
            <label
              htmlFor="task-project"
              className="text-sm font-medium"
            >
              Project
            </label>

            <select
              id="task-project"
              value={projectId}
              onChange={(event) =>
                setProjectId(
                  event.target.value,
                )
              }
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">
                Select Project
              </option>

              {projects.map((project) => (
                <option
                  key={project.id}
                  value={project.id}
                >
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <label
              htmlFor="task-priority"
              className="text-sm font-medium"
            >
              Priority
            </label>

            <select
              id="task-priority"
              value={priority}
              onChange={(event) =>
                setPriority(
                  event.target.value,
                )
              }
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            >
              {priorityOptions.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {priorityLabels[item]}
                  </option>
                ),
              )}
            </select>
          </div>

          {/* Deadline */}
          <div className="space-y-2">
            <label
              htmlFor="task-deadline"
              className="text-sm font-medium"
            >
              Deadline
            </label>

            <input
              id="task-deadline"
              type="date"
              value={deadline}
              onChange={(event) =>
                setDeadline(
                  event.target.value,
                )
              }
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Create Button */}
          <button
            type="submit"
            disabled={creatingTask}
            className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {creatingTask
              ? "Creating..."
              : "Create Task"}
          </button>
        </form>
      </div>

      {/* ALL TASKS */}

      <div className="rounded-xl border bg-card shadow-sm">
        <div className="border-b p-6">
          <h2 className="text-xl font-semibold">
            All Tasks
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage task status and assign tasks
            to members.
          </p>
        </div>

        {tasks.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm text-muted-foreground">
              No tasks found.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="px-4 py-3 text-left font-medium">
                    Task
                  </th>

                  <th className="px-4 py-3 text-left font-medium">
                    Project
                  </th>

                  <th className="px-4 py-3 text-left font-medium">
                    Status
                  </th>

                  <th className="px-4 py-3 text-left font-medium">
                    Priority
                  </th>

                  <th className="px-4 py-3 text-left font-medium">
                    Assignee
                  </th>

                  <th className="px-4 py-3 text-left font-medium">
                    Deadline
                  </th>

                  <th className="px-4 py-3 text-left font-medium">
                    Created
                  </th>
                </tr>
              </thead>

              <tbody>
                {tasks.map((task) => (
                  <tr
                    key={task.id}
                    className="border-b last:border-b-0"
                  >
                    {/* Task */}
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium">
                          {task.title}
                        </p>

                        {task.description && (
                          <p className="mt-1 max-w-[250px] truncate text-xs text-muted-foreground">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Project */}
                    <td className="px-4 py-4">
                      {task.projectName}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      <select
                        value={task.status}
                        disabled={
                          updatingTaskId ===
                          task.id
                        }
                        onChange={(event) =>
                          updateTaskStatus(
                            task.id,
                            event.target.value,
                          )
                        }
                        className="rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <option value="PENDING_ACCEPTANCE">
                          Pending Acceptance
                        </option>

                        <option value="TODO">
                          TODO
                        </option>

                        <option value="IN_PROGRESS">
                          In Progress
                        </option>

                        <option value="IN_REVIEW">
                          In Review
                        </option>

                        <option value="DONE">
                          Completed
                        </option>
                      </select>
                    </td>

                    {/* Priority */}
                    <td className="px-4 py-4">
                      <span className="font-medium">
                        {priorityLabels[
                          task.priority
                        ] ||
                          task.priority}
                      </span>
                    </td>

                    {/* Assignee */}
                    <td className="px-4 py-4">
                      <select
                        value={
                          task.assignee?.id ||
                          ""
                        }
                        disabled={
                          updatingTaskId ===
                          task.id
                        }
                        onChange={(event) =>
                          updateTaskAssignee(
                            task.id,
                            event.target.value,
                          )
                        }
                        className="rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <option value="">
                          Select Member
                        </option>

                        {members
                          .filter(
                            (member) =>
                              member.role ===
                              "MEMBER",
                          )
                          .map((member) => (
                            <option
                              key={
                                member.user.id
                              }
                              value={
                                member.user.id
                              }
                            >
                              {
                                member.user
                                  .name
                              }
                            </option>
                          ))}
                      </select>
                    </td>

                    {/* Deadline */}
                    <td className="px-4 py-4">
                      {task.deadline
                        ? new Date(
                            task.deadline,
                          ).toLocaleDateString()
                        : "—"}
                    </td>

                    {/* Created */}
                    <td className="px-4 py-4 text-muted-foreground">
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
}