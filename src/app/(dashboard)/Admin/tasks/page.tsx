"use client";

import { useEffect, useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  FolderKanban,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

import apiClient from "@/lib/apiClient";
import { getMyOrganizations } from "@/api/organization";

const PRIORITIES = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT",
] as const;

const STATUSES = [
  "PENDING_ACCEPTANCE",
  "TODO",
  "IN_PROGRESS",
  "IN_REVIEW",
  "DONE",
] as const;

type Priority = (typeof PRIORITIES)[number];
type Status = (typeof STATUSES)[number];

type Organization = {
  id: string;
  name: string;
};

type OrganizationsResponse = {
  success: boolean;
  message: string;
  data: Organization[];
};

type Project = {
  id: string;
  name: string;
};

type Member = {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
    isActive?: boolean;
  };
  role: string;
};

type Task = {
  id: string;
  title: string;
  description?: string | null;
  projectId: string;
  assigneeId?: string | null;
  creatorId: string;
  priority: Priority;
  status: Status;
  deadline?: string | null;
  createdAt: string;
  updatedAt?: string;
  assignee?: {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
  } | null;
  creator?: {
    id: string;
    name: string;
    email: string;
  };
  _count?: {
    comments: number;
    timeLogs: number;
    attachments: number;
  };
};

type ProjectsResponse = {
  success: boolean;
  message: string;
  data: Project[];
};

type MembersResponse = {
  success: boolean;
  message: string;
  data: Member[];
};

type TasksResponse = {
  success: boolean;
  message: string;
  data: Task[];
};

type TaskResponse = {
  success: boolean;
  message: string;
  data: Task;
};

type CreateTaskPayload = {
  title: string;
  description?: string;
  projectId: string;
  assigneeId?: string;
  priority?: Priority;
  deadline?: string;
};

type UpdateTaskPayload = {
  title?: string;
  description?: string;
  status?: Status;
  priority?: Priority;
  assigneeId?: string | null;
  deadline?: string | null;
};

/* --------------------------------------------------
   API Functions
-------------------------------------------------- */

async function getProjects(
  organizationId: string,
): Promise<ProjectsResponse> {
  return apiClient<ProjectsResponse>(
    `/projects/organization/${organizationId}`,
  );
}

async function getMembers(
  organizationId: string,
): Promise<MembersResponse> {
  return apiClient<MembersResponse>(
    `/organization-members/${organizationId}`,
  );
}

async function getTasks(
  projectId: string,
): Promise<TasksResponse> {
  return apiClient<TasksResponse>(
    `/tasks/project/${projectId}`,
  );
}

async function createTask(
  payload: CreateTaskPayload,
): Promise<TaskResponse> {
  return apiClient<TaskResponse>("/tasks", {
    method: "POST",
    body: payload,
  });
}

async function updateTask(
  taskId: string,
  payload: UpdateTaskPayload,
): Promise<TaskResponse> {
  return apiClient<TaskResponse>(`/tasks/${taskId}`, {
    method: "PATCH",
    body: payload,
  });
}

async function deleteTask(taskId: string) {
  return apiClient<{
    success: boolean;
    message: string;
  }>(`/tasks/${taskId}`, {
    method: "DELETE",
  });
}

/* --------------------------------------------------
   Helpers
-------------------------------------------------- */

const formatStatus = (status: string) => {
  const labels: Record<string, string> = {
    PENDING_ACCEPTANCE: "Pending Acceptance",
    TODO: "To Do",
    IN_PROGRESS: "In Progress",
    IN_REVIEW: "In Review",
    DONE: "Completed",
  };

  return labels[status] ?? status;
};

const formatDeadlineForApi = (
  value: string,
): string | undefined => {
  if (!value) {
    return undefined;
  }

  const pattern =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

  if (!pattern.test(value)) {
    return undefined;
  }

  const [datePart, timePart] = value.split("T");

  const [year, month, day] =
    datePart.split("-").map(Number);

  const [hours, minutes] =
    timePart.split(":").map(Number);

  const date = new Date(
    year,
    month - 1,
    day,
    hours,
    minutes,
  );

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day ||
    date.getHours() !== hours ||
    date.getMinutes() !== minutes
  ) {
    return undefined;
  }

  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date.toISOString();
};

const formatDeadlineForInput = (
  value?: string | null,
): string => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0");

  const day = String(
    date.getDate(),
  ).padStart(2, "0");

  const hours = String(
    date.getHours(),
  ).padStart(2, "0");

  const minutes = String(
    date.getMinutes(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const getPriorityClass = (
  priority: Priority,
) => {
  if (priority === "URGENT") {
    return "bg-destructive/10 text-destructive";
  }

  if (priority === "HIGH") {
    return "bg-orange-500/10 text-orange-600";
  }

  if (priority === "MEDIUM") {
    return "bg-yellow-500/10 text-yellow-600";
  }

  return "bg-green-500/10 text-green-600";
};

const getStatusClass = (
  status: Status,
) => {
  if (status === "DONE") {
    return "bg-green-500/10 text-green-600";
  }

  if (status === "IN_PROGRESS") {
    return "bg-blue-500/10 text-blue-600";
  }

  if (status === "IN_REVIEW") {
    return "bg-purple-500/10 text-purple-600";
  }

  if (status === "PENDING_ACCEPTANCE") {
    return "bg-orange-500/10 text-orange-600";
  }

  return "bg-muted text-muted-foreground";
};

/* --------------------------------------------------
   Page
-------------------------------------------------- */

export default function TasksPage() {
  const queryClient = useQueryClient();

  const [selectedProjectId, setSelectedProjectId] =
    useState("");

  const [isCreateOpen, setIsCreateOpen] =
    useState(false);

  const [editingTaskId, setEditingTaskId] =
    useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  const [assigneeId, setAssigneeId] =
    useState("");

  const [priority, setPriority] =
    useState<Priority>("MEDIUM");

  const [deadline, setDeadline] =
    useState("");

  const [status, setStatus] =
    useState<Status>("TODO");

  const [formError, setFormError] =
    useState("");

  /* --------------------------------------------------
     Organizations
  -------------------------------------------------- */

  const {
    data: organizationsData,
    isLoading: organizationsLoading,
    isError: organizationsError,
  } = useQuery<OrganizationsResponse>({
    queryKey: ["my-organizations"],
    queryFn: getMyOrganizations,
    retry: false,
  });

  const organizations =
    organizationsData?.data ?? [];

  const organizationId =
    organizations[0]?.id;

  /* --------------------------------------------------
     Projects
  -------------------------------------------------- */

  const {
    data: projectsData,
    isLoading: projectsLoading,
    isError: projectsError,
  } = useQuery<ProjectsResponse>({
    queryKey: [
      "projects",
      organizationId,
    ],
    queryFn: () =>
      getProjects(organizationId!),
    enabled: Boolean(organizationId),
    retry: false,
  });

  /* --------------------------------------------------
     Members
  -------------------------------------------------- */

  const {
    data: membersData,
    isLoading: membersLoading,
  } = useQuery<MembersResponse>({
    queryKey: [
      "organization-members",
      organizationId,
    ],
    queryFn: () =>
      getMembers(organizationId!),
    enabled: Boolean(organizationId),
    retry: false,
  });

  const projects =
    projectsData?.data ?? [];

  const members =
    membersData?.data ?? [];

  /* --------------------------------------------------
     Automatically select first project
  -------------------------------------------------- */

  useEffect(() => {
    if (
      !selectedProjectId &&
      projects.length > 0
    ) {
      setSelectedProjectId(
        projects[0].id,
      );
    }
  }, [
    projects,
    selectedProjectId,
  ]);

  /* --------------------------------------------------
     Tasks
  -------------------------------------------------- */

  const {
    data: tasksData,
    isLoading: tasksLoading,
    isError: tasksError,
    error: tasksQueryError,
  } = useQuery<TasksResponse>({
    queryKey: [
      "tasks",
      selectedProjectId,
    ],
    queryFn: () =>
      getTasks(selectedProjectId),
    enabled: Boolean(selectedProjectId),
    retry: false,
  });

  const tasks =
    tasksData?.data ?? [];

  /* --------------------------------------------------
     Reset Form
  -------------------------------------------------- */

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setAssigneeId("");
    setPriority("MEDIUM");
    setDeadline("");
    setStatus("TODO");
    setFormError("");
  };

  /* --------------------------------------------------
     Create Task
  -------------------------------------------------- */

  const createTaskMutation =
    useMutation({
      mutationFn: createTask,

      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: [
            "tasks",
            selectedProjectId,
          ],
        });

        resetForm();
        setIsCreateOpen(false);
      },

      onError: (error: unknown) => {
        setFormError(
          error instanceof Error
            ? error.message
            : "Failed to create task.",
        );
      },
    });

  /* --------------------------------------------------
     Update Task
  -------------------------------------------------- */

  const updateTaskMutation =
    useMutation({
      mutationFn: ({
        taskId,
        payload,
      }: {
        taskId: string;
        payload: UpdateTaskPayload;
      }) =>
        updateTask(
          taskId,
          payload,
        ),

      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: [
            "tasks",
            selectedProjectId,
          ],
        });

        resetForm();
        setEditingTaskId(null);
        setIsCreateOpen(false);
      },

      onError: (error: unknown) => {
        setFormError(
          error instanceof Error
            ? error.message
            : "Failed to update task.",
        );
      },
    });

  /* --------------------------------------------------
     Delete Task
  -------------------------------------------------- */

  const deleteTaskMutation =
    useMutation({
      mutationFn: deleteTask,

      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: [
            "tasks",
            selectedProjectId,
          ],
        });
      },
    });

  /* --------------------------------------------------
     Quick Status Change
  -------------------------------------------------- */

  const handleStatusChange = (
    taskId: string,
    newStatus: Status,
  ) => {
    updateTaskMutation.mutate({
      taskId,
      payload: {
        status: newStatus,
      },
    });
  };

  /* --------------------------------------------------
     Open Create Form
  -------------------------------------------------- */

  const openCreateForm = () => {
    resetForm();

    setEditingTaskId(null);
    setIsCreateOpen(true);
  };

  /* --------------------------------------------------
     Close Form
  -------------------------------------------------- */

  const closeForm = () => {
    if (
      createTaskMutation.isPending ||
      updateTaskMutation.isPending
    ) {
      return;
    }

    resetForm();

    setEditingTaskId(null);
    setIsCreateOpen(false);
  };

  /* --------------------------------------------------
     Create Task Handler
  -------------------------------------------------- */

  const handleCreateTask = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setFormError("");

    const trimmedTitle =
      title.trim();

    const trimmedDescription =
      description.trim();

    if (!selectedProjectId) {
      setFormError(
        "Please select a project.",
      );
      return;
    }

    if (!trimmedTitle) {
      setFormError(
        "Task title is required.",
      );
      return;
    }

    const formattedDeadline =
      formatDeadlineForApi(
        deadline,
      );

    if (
      deadline &&
      !formattedDeadline
    ) {
      setFormError(
        "Please select a valid deadline.",
      );
      return;
    }

    createTaskMutation.mutate({
      title: trimmedTitle,

      description:
        trimmedDescription ||
        undefined,

      projectId:
        selectedProjectId,

      assigneeId:
        assigneeId || undefined,

      priority,

      deadline:
        formattedDeadline,
    });
  };

  /* --------------------------------------------------
     Update Task Handler
  -------------------------------------------------- */

  const handleUpdateTask = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!editingTaskId) {
      return;
    }

    setFormError("");

    const trimmedTitle =
      title.trim();

    const trimmedDescription =
      description.trim();

    if (!trimmedTitle) {
      setFormError(
        "Task title is required.",
      );
      return;
    }

    const formattedDeadline =
      formatDeadlineForApi(
        deadline,
      );

    if (
      deadline &&
      !formattedDeadline
    ) {
      setFormError(
        "Please select a valid deadline.",
      );
      return;
    }

    updateTaskMutation.mutate({
      taskId: editingTaskId,

      payload: {
        title: trimmedTitle,

        description:
          trimmedDescription,

        status,

        priority,

        assigneeId:
          assigneeId || null,

        deadline:
          formattedDeadline ?? null,
      },
    });
  };

  /* --------------------------------------------------
     Open Edit Form
  -------------------------------------------------- */

  const openEditForm = (
    task: Task,
  ) => {
    setEditingTaskId(task.id);

    setIsCreateOpen(true);

    setFormError("");

    setTitle(task.title);

    setDescription(
      task.description ?? "",
    );

    setAssigneeId(
      task.assigneeId ?? "",
    );

    setPriority(
      task.priority,
    );

    setStatus(
      task.status,
    );

    setDeadline(
      formatDeadlineForInput(
        task.deadline,
      ),
    );
  };

  /* --------------------------------------------------
     Delete Task Handler
  -------------------------------------------------- */

  const handleDeleteTask = (
    taskId: string,
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this task?",
      );

    if (!confirmed) {
      return;
    }

    deleteTaskMutation.mutate(
      taskId,
    );
  };

  /* --------------------------------------------------
     Project Change
  -------------------------------------------------- */

  const handleProjectChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedProjectId(
      event.target.value,
    );

    resetForm();

    setEditingTaskId(null);

    setIsCreateOpen(false);
  };

  /* --------------------------------------------------
     Organizations Loading
  -------------------------------------------------- */

  if (organizationsLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
          Loading organization...
        </div>
      </div>
    );
  }

  /* --------------------------------------------------
     Organization Error
  -------------------------------------------------- */

  if (organizationsError) {
    return (
      <div className="rounded-xl border bg-background p-6">
        <h2 className="text-lg font-semibold">
          Failed to load organization
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Something went wrong while loading your organization.
        </p>
      </div>
    );
  }

  /* --------------------------------------------------
     No Organization
  -------------------------------------------------- */

  if (!organizationId) {
    return (
      <div className="rounded-xl border bg-background p-6">
        <h2 className="text-lg font-semibold">
          No organization found
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          You are not a member of any organization yet.
        </p>
      </div>
    );
  }

  /* --------------------------------------------------
     Projects Loading
  -------------------------------------------------- */

  if (projectsLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
          Loading projects...
        </div>
      </div>
    );
  }

  /* --------------------------------------------------
     Projects Error
  -------------------------------------------------- */

  if (projectsError) {
    return (
      <div className="rounded-xl border bg-background p-6">
        <h2 className="text-lg font-semibold">
          Failed to load projects
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Something went wrong while loading projects.
        </p>
      </div>
    );
  }

  /* --------------------------------------------------
     UI
  -------------------------------------------------- */

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Tasks
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage tasks across your organization projects.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          {/* Project Select */}

          <div className="min-w-[230px]">
            <label
              htmlFor="project-select"
              className="mb-1.5 block text-xs font-medium text-muted-foreground"
            >
              Select Project
            </label>

            <select
              id="project-select"
              value={selectedProjectId}
              onChange={
                handleProjectChange
              }
              className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="">
                Select a project
              </option>

              {projects.map(
                (project) => (
                  <option
                    key={project.id}
                    value={project.id}
                  >
                    {project.name}
                  </option>
                ),
              )}
            </select>
          </div>

          {/* Create Button */}

          <button
            type="button"
            onClick={
              openCreateForm
            }
            disabled={
              !selectedProjectId ||
              membersLoading
            }
            className="inline-flex h-10 items-center justify-center gap-2 self-end rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="size-4" />
            Create Task
          </button>
        </div>
      </div>

      {/* No Project */}

      {!selectedProjectId && (
        <div className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border bg-background p-6 text-center shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <FolderKanban className="size-5 text-muted-foreground" />
          </div>

          <h2 className="mt-4 font-semibold">
            Select a project
          </h2>

          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            Select a project above to view and manage its tasks.
          </p>
        </div>
      )}

      {/* Selected Project */}

      {selectedProjectId && (
        <>
          {/* Summary */}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border bg-background p-4">
              <p className="text-sm text-muted-foreground">
                Total Tasks
              </p>

              <p className="mt-2 text-2xl font-bold">
                {tasks.length}
              </p>
            </div>

            <div className="rounded-xl border bg-background p-4">
              <p className="text-sm text-muted-foreground">
                Todo
              </p>

              <p className="mt-2 text-2xl font-bold">
                {
                  tasks.filter(
                    (task) =>
                      task.status ===
                      "TODO",
                  ).length
                }
              </p>
            </div>

            <div className="rounded-xl border bg-background p-4">
              <p className="text-sm text-muted-foreground">
                In Progress
              </p>

              <p className="mt-2 text-2xl font-bold">
                {
                  tasks.filter(
                    (task) =>
                      task.status ===
                      "IN_PROGRESS",
                  ).length
                }
              </p>
            </div>

            <div className="rounded-xl border bg-background p-4">
              <p className="text-sm text-muted-foreground">
                Completed
              </p>

              <p className="mt-2 text-2xl font-bold">
                {
                  tasks.filter(
                    (task) =>
                      task.status ===
                      "DONE",
                  ).length
                }
              </p>
            </div>
          </div>

          {/* Create / Edit Form */}

          {isCreateOpen && (
            <div className="rounded-xl border bg-background p-5 shadow-sm">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">
                    {editingTaskId
                      ? "Edit Task"
                      : "Create Task"}
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {editingTaskId
                      ? "Update the task information."
                      : "Create a new task for this project."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={
                    closeForm
                  }
                  className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label="Close task form"
                >
                  <X className="size-4" />
                </button>
              </div>

              <form
                noValidate
                onSubmit={
                  editingTaskId
                    ? handleUpdateTask
                    : handleCreateTask
                }
                className="space-y-5"
              >
                {/* Title */}

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
                    onChange={(
                      event,
                    ) => {
                      setTitle(
                        event.target
                          .value,
                      );

                      setFormError("");
                    }}
                    maxLength={200}
                    placeholder="e.g. Fix authentication bug"
                    className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
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
                    value={
                      description
                    }
                    onChange={(
                      event,
                    ) => {
                      setDescription(
                        event.target
                          .value,
                      );

                      setFormError("");
                    }}
                    rows={4}
                    placeholder="Describe what needs to be done..."
                    className="w-full resize-none rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Assignee + Priority */}

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="task-assignee"
                      className="text-sm font-medium"
                    >
                      Assignee
                    </label>

                    <select
                      id="task-assignee"
                      value={
                        assigneeId
                      }
                      onChange={(
                        event,
                      ) =>
                        setAssigneeId(
                          event.target
                            .value,
                        )
                      }
                      className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">
                        Unassigned
                      </option>

                      {members.map(
                        (member) => (
                          <option
                            key={
                              member
                                .user
                                .id
                            }
                            value={
                              member
                                .user
                                .id
                            }
                          >
                            {
                              member
                                .user
                                .name
                            }
                          </option>
                        ),
                      )}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="task-priority"
                      className="text-sm font-medium"
                    >
                      Priority
                    </label>

                    <select
                      id="task-priority"
                      value={
                        priority
                      }
                      onChange={(
                        event,
                      ) =>
                        setPriority(
                          event.target
                            .value as Priority,
                        )
                      }
                      className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                      {PRIORITIES.map(
                        (item) => (
                          <option
                            key={item}
                            value={item}
                          >
                            {item}
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                </div>

                {/* Status + Deadline */}

                <div className="grid gap-5 md:grid-cols-2">
                  {editingTaskId && (
                    <div className="space-y-2">
                      <label
                        htmlFor="task-status"
                        className="text-sm font-medium"
                      >
                        Status
                      </label>

                      <select
                        id="task-status"
                        value={status}
                        onChange={(
                          event,
                        ) =>
                          setStatus(
                            event.target
                              .value as Status,
                          )
                        }
                        className={`h-10 w-full rounded-lg border px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 ${getStatusClass(
                          status,
                        )}`}
                      >
                        {STATUSES.map(
                          (item) => (
                            <option
                              key={item}
                              value={item}
                            >
                              {formatStatus(
                                item,
                              )}
                            </option>
                          ),
                        )}
                      </select>
                    </div>
                  )}

                  <div
                    className={`space-y-2 ${
                      editingTaskId
                        ? ""
                        : "md:col-span-2"
                    }`}
                  >
                    <label
                      htmlFor="task-deadline"
                      className="text-sm font-medium"
                    >
                      Deadline
                    </label>

                    <input
                      id="task-deadline"
                      type="datetime-local"
                      value={deadline}
                      onChange={(
                        event,
                      ) => {
                        setDeadline(
                          event.target
                            .value,
                        );

                        setFormError("");
                      }}
                      step={60}
                      className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />

                    <p className="text-xs text-muted-foreground">
                      Select date and time for the task deadline.
                    </p>
                  </div>
                </div>

                {/* Error */}

                {formError && (
                  <div
                    role="alert"
                    className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
                  >
                    {formError}
                  </div>
                )}

                {/* Actions */}

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={
                      closeForm
                    }
                    disabled={
                      createTaskMutation.isPending ||
                      updateTaskMutation.isPending
                    }
                    className="rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      !title.trim() ||
                      createTaskMutation.isPending ||
                      updateTaskMutation.isPending
                    }
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {(
                      createTaskMutation.isPending ||
                      updateTaskMutation.isPending
                    ) && (
                      <Loader2 className="size-4 animate-spin" />
                    )}

                    {editingTaskId
                      ? updateTaskMutation.isPending
                        ? "Updating..."
                        : "Update Task"
                      : createTaskMutation.isPending
                        ? "Creating..."
                        : "Create Task"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tasks Loading */}

          {tasksLoading && (
            <div className="flex min-h-[250px] items-center justify-center rounded-xl border bg-background">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="size-5 animate-spin" />
                Loading tasks...
              </div>
            </div>
          )}

          {/* Tasks Error */}

          {tasksError &&
            !tasksLoading && (
              <div className="rounded-xl border bg-background p-6">
                <h2 className="font-semibold">
                  Failed to load tasks
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {tasksQueryError instanceof
                  Error
                    ? tasksQueryError.message
                    : "Something went wrong while loading tasks."}
                </p>
              </div>
            )}

          {/* Empty */}

          {!tasksLoading &&
            !tasksError &&
            tasks.length === 0 && (
              <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border bg-background p-6 text-center shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <CheckCircle2 className="size-5 text-muted-foreground" />
                </div>

                <h2 className="mt-4 font-semibold">
                  No tasks found
                </h2>

                <p className="mt-1 max-w-md text-sm text-muted-foreground">
                  This project does not have any tasks yet.
                </p>

                <button
                  type="button"
                  onClick={
                    openCreateForm
                  }
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
                >
                  <Plus className="size-4" />
                  Create First Task
                </button>
              </div>
            )}

          {/* Task Cards */}

          {!tasksLoading &&
            !tasksError &&
            tasks.length > 0 && (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="rounded-xl border bg-background p-5 shadow-sm"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="font-semibold">
                            {task.title}
                          </h2>

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${getPriorityClass(
                              task.priority,
                            )}`}
                          >
                            {task.priority}
                          </span>

                          {/* Quick Status */}

                          <select
                            value={
                              task.status
                            }
                            onChange={(
                              event,
                            ) =>
                              handleStatusChange(
                                task.id,
                                event
                                  .target
                                  .value as Status,
                              )
                            }
                            disabled={
                              updateTaskMutation.isPending
                            }
                            className={`rounded-full border-0 px-3 py-1.5 text-xs font-medium outline-none focus:ring-2 focus:ring-primary/20 ${getStatusClass(
                              task.status,
                            )}`}
                            aria-label={`Change status for ${task.title}`}
                          >
                            {STATUSES.map(
                              (item) => (
                                <option
                                  key={item}
                                  value={item}
                                >
                                  {formatStatus(
                                    item,
                                  )}
                                </option>
                              ),
                            )}
                          </select>
                        </div>

                        {task.description && (
                          <p className="mt-2 text-sm text-muted-foreground">
                            {
                              task.description
                            }
                          </p>
                        )}

                        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <UserRound className="size-3.5" />

                            {task.assignee
                              ?.name ??
                              "Unassigned"}
                          </div>

                          {task.deadline && (
                            <div className="flex items-center gap-1.5">
                              <CalendarDays className="size-3.5" />

                              {new Date(
                                task.deadline,
                              ).toLocaleString()}
                            </div>
                          )}

                          <div className="flex items-center gap-1.5">
                            <Clock3 className="size-3.5" />

                            {new Date(
                              task.createdAt,
                            ).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}

                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            openEditForm(
                              task,
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted"
                        >
                          <Pencil className="size-4" />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteTask(
                              task.id,
                            )
                          }
                          disabled={
                            deleteTaskMutation.isPending
                          }
                          className="inline-flex items-center gap-2 rounded-lg border border-destructive/30 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/5 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deleteTaskMutation.isPending ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <Trash2 className="size-4" />
                          )}

                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </>
      )}
    </div>
  );
}