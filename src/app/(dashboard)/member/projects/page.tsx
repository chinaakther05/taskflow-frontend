
"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/apiClient";
import { getMyOrganizations } from "@/api/organization";

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

type Organization = {
  id: string;
  name: string;
};

type OrganizationResponse = {
  success: boolean;
  message: string;
  data: Organization[];
};

const MemberProjectPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError("");

        // Get member's organization
        const organizationResponse =
          (await getMyOrganizations()) as OrganizationResponse;

        const organization = organizationResponse.data?.[0];

        if (!organization?.id) {
          throw new Error("No organization found");
        }

        // Get organization projects
        const projectResponse = await apiClient<ProjectsResponse>(
          `/projects/organization/${organization.id}`,
        );

        setProjects(projectResponse.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-48 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-4 w-72 animate-pulse rounded bg-muted" />
        </div>

        <div className="rounded-xl border">
          <div className="space-y-4 p-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-14 animate-pulse rounded bg-muted"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-700">
          Something went wrong
        </h2>
        <p className="mt-1 text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">My Projects</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View projects from your organization
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Total Projects
          </p>
          <p className="mt-2 text-2xl font-bold">
            {projects.length}
          </p>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Total Tasks
          </p>
          <p className="mt-2 text-2xl font-bold">
            {projects.reduce(
              (total, project) => total + project._count.tasks,
              0,
            )}
          </p>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Project Members
          </p>
          <p className="mt-2 text-2xl font-bold">
            {projects.reduce(
              (total, project) => total + project._count.members,
              0,
            )}
          </p>
        </div>
      </div>

      {/* Projects */}
      {projects.length === 0 ? (
        <div className="rounded-xl border p-10 text-center">
          <h2 className="text-lg font-semibold">
            No projects found
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            There are no projects available in your organization.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/40">
                <tr className="text-left text-sm">
                  <th className="px-6 py-4 font-medium">
                    Project
                  </th>
                  <th className="px-6 py-4 font-medium">
                    Status
                  </th>
                  <th className="px-6 py-4 font-medium">
                    Tasks
                  </th>
                  <th className="px-6 py-4 font-medium">
                    Members
                  </th>
                  <th className="px-6 py-4 font-medium">
                    Owner
                  </th>
                  <th className="px-6 py-4 font-medium">
                    Created
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {projects.map((project) => (
                  <tr
                    key={project.id}
                    className="text-sm transition hover:bg-muted/30"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">
                          {project.name}
                        </p>

                        {project.description && (
                          <p className="mt-1 max-w-xs truncate text-xs text-muted-foreground">
                            {project.description}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          project.status === "ACTIVE"
                            ? "bg-green-100 text-green-700"
                            : project.status === "ARCHIVED"
                              ? "bg-gray-100 text-gray-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {project.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {project._count.tasks}
                    </td>

                    <td className="px-6 py-4">
                      {project._count.members}
                    </td>

                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">
                          {project.owner.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {project.owner.email}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(
                        project.createdAt,
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberProjectPage;

