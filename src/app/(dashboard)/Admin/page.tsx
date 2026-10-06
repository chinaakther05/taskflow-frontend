"use client";

import {
  CreditCard,
  FolderKanban,
  ListTodo,
  Loader2,
  Users,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import apiClient from "@/lib/apiClient";
import { getMyOrganizations } from "@/api/organization";

type Role = "ADMIN" | "PROJECT_MANAGER" | "MEMBER";

type Organization = {
  id: string;
  name: string;
  slug: string;
  myRole: Role;
};

type Member = {
  id: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
};

type Project = {
  id: string;
  name: string;
  description: string | null;
  status: "ACTIVE" | "ARCHIVED" | "COMPLETED";
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

type MembersResponse = {
  success: boolean;
  message: string;
  data: Member[];
};

type Payment = {
  id: string;
  amount: number | string;
  status: string;
  createdAt: string;
};

type Subscription = {
  id: string;
  plan: "FREE" | "PRO" | "BUSINESS";
  maxProjects: number;
  maxMembers: number;
  isActive: boolean;
  payments?: Payment[];
};

type SubscriptionResponse = {
  success: boolean;
  message: string;
  data: Subscription | null;
};

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

async function getSubscription(
  organizationId: string,
): Promise<SubscriptionResponse> {
  return apiClient<SubscriptionResponse>(
    `/subscriptions/${organizationId}`,
  );
}

export default function AdminDashboard() {
  // ---------------------------------------
  // Get Organizations
  // ---------------------------------------

  const {
    data: organizationData,
    isLoading: organizationLoading,
    isError: organizationError,
  } = useQuery({
    queryKey: ["organizations"],
    queryFn: getMyOrganizations,
  });

  const organizations: Organization[] =
    organizationData?.data ?? [];

  const organization = organizations[0];
  const organizationId = organization?.id;

  // ---------------------------------------
  // Get Members
  // ---------------------------------------

  const {
    data: membersData,
    isLoading: membersLoading,
  } = useQuery<MembersResponse>({
    queryKey: ["organization-members", organizationId],
    queryFn: () => getMembers(organizationId as string),
    enabled: Boolean(organizationId),
    retry: false,
  });

  const members = membersData?.data ?? [];

  // ---------------------------------------
  // Get Projects
  // ---------------------------------------

  const {
    data: projectsData,
    isLoading: projectsLoading,
  } = useQuery<ProjectsResponse>({
    queryKey: ["projects", organizationId],
    queryFn: () => getProjects(organizationId as string),
    enabled: Boolean(organizationId),
    retry: false,
  });

  const projects = projectsData?.data ?? [];

  // ---------------------------------------
  // Get Subscription
  // ---------------------------------------

  const {
    data: subscriptionData,
    isLoading: subscriptionLoading,
  } = useQuery<SubscriptionResponse>({
    queryKey: ["subscription", organizationId],
    queryFn: () => getSubscription(organizationId as string),
    enabled: Boolean(organizationId),
    retry: false,
  });

  const subscription = subscriptionData?.data;

  // ---------------------------------------
  // Calculations
  // ---------------------------------------

  const totalProjects = projects.length;

  const totalMembers = members.length;

  const totalTasks = projects.reduce(
    (total, project) => total + project._count.tasks,
    0,
  );

  const payments = subscription?.payments ?? [];

  const successfulPayments = payments.filter(
    (payment) => payment.status === "SUCCESS",
  );

  const totalPayments = successfulPayments.reduce(
    (total, payment) => total + Number(payment.amount),
    0,
  );

  const recentProjects = projects.slice(0, 3);

  // ---------------------------------------
  // Loading
  // ---------------------------------------

  if (organizationLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
          Loading dashboard...
        </div>
      </div>
    );
  }

  // ---------------------------------------
  // Organization Error
  // ---------------------------------------

  if (organizationError) {
    return (
      <div className="rounded-xl border bg-background p-6">
        <h2 className="text-lg font-semibold">
          Failed to load dashboard
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Something went wrong while loading your organization.
        </p>
      </div>
    );
  }

  // ---------------------------------------
  // No Organization
  // ---------------------------------------

  if (!organizationId) {
    return (
      <div className="flex min-h-[350px] flex-col items-center justify-center rounded-xl border bg-background p-6 text-center">
        <h2 className="font-semibold">
          No organization found
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          You are not currently a member of any organization.
        </p>
      </div>
    );
  }

  // ---------------------------------------
  // Dashboard
  // ---------------------------------------

  return (
    <div className="space-y-6">
      {/* Header */}

      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Admin Dashboard
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Overview of your organization and workspace.
        </p>
      </div>

      {/* Organization */}

      <div className="rounded-xl border bg-background p-4 shadow-sm">
        <p className="text-xs text-muted-foreground">
          Organization
        </p>

        <div className="mt-1 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold">
            {organization.name}
          </p>

          <p className="text-xs text-muted-foreground">
            Your role:{" "}
            <span className="font-medium text-foreground">
              {organization.myRole.replace("_", " ")}
            </span>
          </p>
        </div>
      </div>

      {/* Stats */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Members */}

        <div className="rounded-xl border bg-background p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <Users className="size-5 text-blue-600" />
            </div>

            {membersLoading && (
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            )}
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Total Members
          </p>

          <p className="mt-1 text-2xl font-bold">
            {membersLoading ? "—" : totalMembers}
          </p>
        </div>

        {/* Projects */}

        <div className="rounded-xl border bg-background p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
              <FolderKanban className="size-5 text-purple-600" />
            </div>

            {projectsLoading && (
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            )}
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Total Projects
          </p>

          <p className="mt-1 text-2xl font-bold">
            {projectsLoading ? "—" : totalProjects}
          </p>
        </div>

        {/* Tasks */}

        <div className="rounded-xl border bg-background p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
            <ListTodo className="size-5 text-green-600" />
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Total Tasks
          </p>

          <p className="mt-1 text-2xl font-bold">
            {projectsLoading ? "—" : totalTasks}
          </p>
        </div>

        {/* Payments */}

        <div className="rounded-xl border bg-background p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
              <CreditCard className="size-5 text-orange-600" />
            </div>

            {subscriptionLoading && (
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            )}
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Total Payments
          </p>

          <p className="mt-1 text-2xl font-bold">
            {subscriptionLoading
              ? "—"
              : `৳${totalPayments.toLocaleString()}`}
          </p>
        </div>
      </div>

      {/* Subscription */}

      <div className="rounded-xl border bg-background p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Current Plan
            </p>

            <h2 className="mt-1 text-xl font-bold">
              {subscription?.plan ?? "FREE"}
            </h2>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              subscription?.isActive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {subscription?.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        {subscription && (
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-muted/40 p-3">
              <p className="text-xs text-muted-foreground">
                Project Limit
              </p>

              <p className="mt-1 font-semibold">
                {totalProjects} / {subscription.maxProjects}
              </p>
            </div>

            <div className="rounded-lg bg-muted/40 p-3">
              <p className="text-xs text-muted-foreground">
                Member Limit
              </p>

              <p className="mt-1 font-semibold">
                {totalMembers} / {subscription.maxMembers}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Recent Projects */}

      <div className="rounded-xl border bg-background shadow-sm">
        <div className="border-b p-5">
          <h2 className="font-semibold">
            Recent Projects
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Your latest projects in this organization.
          </p>
        </div>

        {projectsLoading ? (
          <div className="flex items-center justify-center p-10">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : recentProjects.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No projects found.
          </div>
        ) : (
          <div className="divide-y">
            {recentProjects.map((project) => (
              <div
                key={project.id}
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <FolderKanban className="size-5 text-primary" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate font-medium">
                      {project.name}
                    </h3>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {project._count.tasks} tasks ·{" "}
                      {project._count.members} members
                    </p>
                  </div>
                </div>

                <span
                  className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
                    project.status === "COMPLETED"
                      ? "bg-green-100 text-green-700"
                      : project.status === "ACTIVE"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {project.status.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment Summary */}

      <div className="rounded-xl border bg-background p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
            <CreditCard className="size-5 text-orange-600" />
          </div>

          <div>
            <h2 className="font-semibold">
              Payment Summary
            </h2>

            <p className="text-sm text-muted-foreground">
              Successful payments for this organization.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-muted/40 p-4">
            <p className="text-xs text-muted-foreground">
              Successful Payments
            </p>

            <p className="mt-1 text-xl font-bold">
              {subscriptionLoading
                ? "—"
                : successfulPayments.length}
            </p>
          </div>

          <div className="rounded-lg bg-muted/40 p-4">
            <p className="text-xs text-muted-foreground">
              Total Paid
            </p>

            <p className="mt-1 text-xl font-bold">
              {subscriptionLoading
                ? "—"
                : `৳${totalPayments.toLocaleString()}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}