
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CalendarDays,
  FolderKanban,
  Plus,
  Users,
  X,
} from "lucide-react";

import apiClient from "@/lib/apiClient";
import { getMyOrganizations } from "@/api/organization";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

const ProjectManagerProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const organizationResponse =
        (await getMyOrganizations()) as OrganizationResponse;

      const organization = organizationResponse.data?.[0];

      if (!organization?.id) {
        throw new Error("No organization found");
      }

      const response = await apiClient<ProjectsResponse>(
        `/projects/organization/${organization.id}`,
      );

      setProjects(response.data || []);
    } catch (err) {
      console.error("Failed to load projects:", err);

      setError(
        err instanceof Error ? err.message : "Failed to load projects",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreateProject = async () => {
    if (!projectName.trim()) {
      return;
    }

    try {
      setCreating(true);
      setError("");

      const organizationResponse =
        (await getMyOrganizations()) as OrganizationResponse;

      const organization = organizationResponse.data?.[0];

      if (!organization?.id) {
        throw new Error("No organization found");
      }

      await apiClient("/projects", {
        method: "POST",
        body: {
          organizationId: organization.id,
          name: projectName.trim(),
          description: description.trim() || undefined,
        },
      });

      setProjectName("");
      setDescription("");
      setShowCreateForm(false);

      await fetchProjects();
    } catch (err) {
      console.error("Failed to create project:", err);

      setError(
        err instanceof Error ? err.message : "Failed to create project",
      );
    } finally {
      setCreating(false);
    }
  };

  const totalTasks = projects.reduce(
    (total, project) => total + project._count.tasks,
    0,
  );

  const totalMembers = projects.reduce(
    (total, project) => total + project._count.members,
    0,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            My Projects
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage and monitor your organization projects.
          </p>
        </div>

        <Button
          onClick={() => setShowCreateForm((previous) => !previous)}
        >
          {showCreateForm ? (
            <>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Create Project
            </>
          )}
        </Button>
      </div>

      {/* Create Project Form */}
      {showCreateForm && (
        <div className="rounded-xl border bg-card p-5">
          <h2 className="font-semibold">Create New Project</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Add a new project to your organization.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="project-name"
                className="text-sm font-medium"
              >
                Project Name
              </label>

              <Input
                id="project-name"
                placeholder="Enter project name"
                value={projectName}
                onChange={(event) => setProjectName(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="project-description"
                className="text-sm font-medium"
              >
                Description
              </label>

              <Input
                id="project-description"
                placeholder="Enter project description"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
              />
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <Button
              onClick={handleCreateProject}
              disabled={creating || !projectName.trim()}
            >
              {creating ? "Creating..." : "Create Project"}
            </Button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Total Projects */}
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Total Projects
              </p>

              <p className="mt-2 text-2xl font-bold">
                {loading ? "—" : projects.length}
              </p>
            </div>

            <div className="rounded-lg bg-primary/10 p-3">
              <FolderKanban className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>

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
              <CalendarDays className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>

        {/* Members */}
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Project Members
              </p>

              <p className="mt-2 text-2xl font-bold">
                {loading ? "—" : totalMembers}
              </p>
            </div>

            <div className="rounded-lg bg-primary/10 p-3">
              <Users className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Projects */}
      <div className="rounded-xl border bg-card">
        <div className="border-b p-5">
          <h2 className="font-semibold">Projects</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            All projects in your organization.
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
        ) : projects.length === 0 ? (
          /* Empty */
          <div className="p-10 text-center">
            <FolderKanban className="mx-auto h-10 w-10 text-muted-foreground" />

            <h3 className="mt-4 font-semibold">
              No projects found
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Create your first project to get started.
            </p>
          </div>
        ) : (
          /* Table */
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
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
                    Owner
                  </th>

                  <th className="px-5 py-4 font-medium">
                    Created
                  </th>
                </tr>
              </thead>

              <tbody>
                {projects.map((project) => (
                  <tr
                    key={project.id}
                    className="border-b last:border-0 hover:bg-muted/40"
                  >
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium">
                          {project.name}
                        </p>

                        {project.description && (
                          <p className="mt-1 max-w-xs truncate text-sm text-muted-foreground">
                            {project.description}
                          </p>
                        )}
                      </div>
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

                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium">
                          {project.owner.name}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {project.owner.email}
                        </p>
                      </div>
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
    </div>
  );
};

export default ProjectManagerProjectsPage;

