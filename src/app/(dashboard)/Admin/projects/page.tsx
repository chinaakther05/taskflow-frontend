"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarDays,
  FolderKanban,
  ListTodo,
  Loader2,
  Plus,
  Users,
  X,
} from "lucide-react";

import apiClient from "@/lib/apiClient";

const ORGANIZATION_ID =
  "aa794cc7-613f-4234-b7ff-c8e4e649e0e4";

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

type CreateProjectPayload = {
  organizationId: string;
  name: string;
  description?: string;
};

type CreateProjectResponse = {
  success: boolean;
  message: string;
  data: Project;
};

async function getProjects(): Promise<ProjectsResponse> {
  return apiClient<ProjectsResponse>(
    `/projects/organization/${ORGANIZATION_ID}`,
  );
}

async function createProject(
  payload: CreateProjectPayload,
): Promise<CreateProjectResponse> {
  return apiClient<CreateProjectResponse>("/projects", {
    method: "POST",
    body: payload,
  });
}

export default function ProjectsPage() {
  const queryClient = useQueryClient();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState("");

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery<ProjectsResponse>({
    queryKey: ["projects", ORGANIZATION_ID],
    queryFn: getProjects,
    retry: false,
  });

  const createProjectMutation = useMutation({
    mutationFn: createProject,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["projects", ORGANIZATION_ID],
      });

      setName("");
      setDescription("");
      setFormError("");
      setIsCreateOpen(false);
    },

    onError: (error: unknown) => {
      if (error instanceof Error) {
        setFormError(error.message);
      } else {
        setFormError("Failed to create project.");
      }
    },
  });

  const projects = data?.data ?? [];

  const handleCreateProject = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setFormError("");

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName) {
      setFormError("Project name is required.");
      return;
    }

    createProjectMutation.mutate({
      organizationId: ORGANIZATION_ID,
      name: trimmedName,
      description: trimmedDescription || undefined,
    });
  };

  const openCreateForm = () => {
    setFormError("");
    setIsCreateOpen(true);
  };

  const closeCreateForm = () => {
    if (createProjectMutation.isPending) {
      return;
    }

    setIsCreateOpen(false);
    setName("");
    setDescription("");
    setFormError("");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
          Loading projects...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border bg-background p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
            <FolderKanban className="size-5 text-destructive" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              Failed to load projects
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {error instanceof Error
                ? error.message
                : "Something went wrong while loading projects."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Projects
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage projects in your organization.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm">
            <FolderKanban className="size-4 text-muted-foreground" />

            <span className="font-medium">
              {projects.length}
            </span>

            <span className="text-muted-foreground">
              {projects.length === 1
                ? "Project"
                : "Projects"}
            </span>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="size-4" />
            Create Project
          </button>
        </div>
      </div>

      {/* Create Project Form */}
      {isCreateOpen && (
        <div className="rounded-xl border bg-background p-5 shadow-sm">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">
                Create Project
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Add a new project to your organization.
              </p>
            </div>

            <button
              type="button"
              onClick={closeCreateForm}
              disabled={createProjectMutation.isPending}
              aria-label="Close create project form"
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X className="size-4" />
            </button>
          </div>

          <form
            onSubmit={handleCreateProject}
            className="space-y-5"
          >
            {/* Project Name */}
            <div className="space-y-2">
              <label
                htmlFor="project-name"
                className="text-sm font-medium"
              >
                Project Name
              </label>

              <input
                id="project-name"
                type="text"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);

                  if (formError) {
                    setFormError("");
                  }
                }}
                placeholder="e.g. TaskFlow Platform"
                maxLength={100}
                className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              />

              <p className="text-xs text-muted-foreground">
                Give your project a clear and meaningful name.
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label
                htmlFor="project-description"
                className="text-sm font-medium"
              >
                Description{" "}
                <span className="text-muted-foreground">
                  (Optional)
                </span>
              </label>

              <textarea
                id="project-description"
                value={description}
                onChange={(event) => {
                  setDescription(event.target.value);

                  if (formError) {
                    setFormError("");
                  }
                }}
                placeholder="What is this project about?"
                rows={4}
                maxLength={500}
                className="w-full resize-none rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              />

              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  Briefly describe the project.
                </span>

                <span>
                  {description.length}/500
                </span>
              </div>
            </div>

            {/* Organization */}
            <div className="rounded-lg bg-muted/40 p-4">
              <p className="text-xs text-muted-foreground">
                Organization
              </p>

              <p className="mt-1 text-sm font-medium">
                Creative Workspace
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                The project will be created in this organization.
              </p>
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

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={closeCreateForm}
                disabled={createProjectMutation.isPending}
                className="rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  !name.trim() ||
                  createProjectMutation.isPending
                }
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {createProjectMutation.isPending && (
                  <Loader2 className="size-4 animate-spin" />
                )}

                {createProjectMutation.isPending
                  ? "Creating..."
                  : "Create Project"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Empty State */}
      {projects.length === 0 ? (
        <div className="flex min-h-[350px] flex-col items-center justify-center rounded-xl border bg-background p-6 text-center shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <FolderKanban className="size-5 text-muted-foreground" />
          </div>

          <h2 className="mt-4 font-semibold">
            No projects found
          </h2>

          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            There are no active projects in this organization yet.
          </p>

          <button
            type="button"
            onClick={openCreateForm}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="size-4" />
            Create Your First Project
          </button>
        </div>
      ) : (
        /* Project Cards */
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="rounded-xl border bg-background p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <FolderKanban className="size-5 text-primary" />
                  </div>

                  <div className="min-w-0">
                    <h2 className="truncate font-semibold">
                      {project.name}
                    </h2>

                    <p className="text-xs text-muted-foreground">
                      Project
                    </p>
                  </div>
                </div>

                <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  {project.status}
                </span>
              </div>

              {/* Description */}
              {project.description && (
                <p className="mt-4 line-clamp-2 text-sm text-muted-foreground">
                  {project.description}
                </p>
              )}

              {/* Stats */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-muted/40 p-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <ListTodo className="size-4" />

                    <span className="text-xs">
                      Tasks
                    </span>
                  </div>

                  <p className="mt-1 text-lg font-semibold">
                    {project._count.tasks}
                  </p>
                </div>

                <div className="rounded-lg bg-muted/40 p-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="size-4" />

                    <span className="text-xs">
                      Members
                    </span>
                  </div>

                  <p className="mt-1 text-lg font-semibold">
                    {project._count.members}
                  </p>
                </div>
              </div>

              {/* Project Information */}
              <div className="mt-5 space-y-2 border-t pt-4">
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-muted-foreground">
                    Owner
                  </span>

                  <span className="truncate font-medium">
                    {project.owner.name}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CalendarDays className="size-3.5" />

                  {new Date(
                    project.createdAt,
                  ).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}