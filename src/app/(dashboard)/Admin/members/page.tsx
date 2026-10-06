"use client";

import { useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Users,
  Mail,
  ShieldCheck,
  CalendarDays,
  Loader2,
  UserPlus,
} from "lucide-react";

import apiClient from "@/lib/apiClient";
import { getMyOrganizations } from "@/api/organization";

type Role = "ADMIN" | "PROJECT_MANAGER" | "MEMBER";

type Organization = {
  id: string;
  name: string;
  slug: string;
  myRole: Role;
};

type User = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
};

type Member = {
  id: string;
  role: Role;
  joinedAt: string;
  user: User & {
    isActive: boolean;
  };
};

type AddMemberPayload = {
  userId: string;
  organizationId: string;
  role: "PROJECT_MANAGER" | "MEMBER";
};

type MembersResponse = {
  data: Member[];
};

type AvailableUsersResponse = {
  data: User[];
};

async function getOrganizationMembers(
  organizationId: string,
): Promise<MembersResponse> {
  return apiClient<MembersResponse>(
    `/organization-members/${organizationId}`,
  );
}

async function getAvailableUsers(
  organizationId: string,
): Promise<AvailableUsersResponse> {
  return apiClient<AvailableUsersResponse>(
    `/organization-members/${organizationId}/available-users`,
  );
}

async function addMember(
  payload: AddMemberPayload,
) {
  return apiClient("/organization-members", {
    method: "POST",
    body: payload,
  });
}

export default function MembersPage() {
  const queryClient = useQueryClient();

  const [selectedUserId, setSelectedUserId] =
    useState("");

  const [role, setRole] =
    useState<"PROJECT_MANAGER" | "MEMBER">("MEMBER");

  // Get logged-in user's organizations
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

  // Current organization
  const organization = organizations[0];

  const organizationId = organization?.id;

  // Get organization members
  const {
    data: memberData,
    isLoading: membersLoading,
    isError: membersError,
  } = useQuery({
    queryKey: [
      "organization-members",
      organizationId,
    ],
    queryFn: () =>
      getOrganizationMembers(
        organizationId as string,
      ),
    enabled: Boolean(organizationId),
  });

  const members: Member[] =
    memberData?.data ?? [];

  // Get users who are not already members
  const {
    data: availableUsersData,
    isLoading: availableUsersLoading,
    isError: availableUsersError,
  } = useQuery({
    queryKey: [
      "available-users",
      organizationId,
    ],
    queryFn: () =>
      getAvailableUsers(
        organizationId as string,
      ),
    enabled: Boolean(organizationId),
  });

  const availableUsers: User[] =
    availableUsersData?.data ?? [];

  // Add member
  const addMemberMutation = useMutation({
    mutationFn: addMember,

    onSuccess: () => {
      // Refresh members
      queryClient.invalidateQueries({
        queryKey: [
          "organization-members",
          organizationId,
        ],
      });

      // Refresh available users
      queryClient.invalidateQueries({
        queryKey: [
          "available-users",
          organizationId,
        ],
      });

      // Reset form
      setSelectedUserId("");
      setRole("MEMBER");
    },
  });

  const handleAddMember = (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    if (!selectedUserId) {
      return;
    }

    if (!organizationId) {
      return;
    }

    addMemberMutation.mutate({
      userId: selectedUserId,
      organizationId,
      role,
    });
  };

  // Organization loading
  if (organizationLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
          Loading organization...
        </div>
      </div>
    );
  }

  // Organization error
  if (organizationError) {
    return (
      <div className="rounded-xl border bg-background p-6">
        <h2 className="text-lg font-semibold">
          Failed to load organization
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Something went wrong while loading your
          organization.
        </p>
      </div>
    );
  }

  // No organization
  if (!organizationId) {
    return (
      <div className="rounded-xl border bg-background p-6">
        <h2 className="text-lg font-semibold">
          No organization found
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          You are not currently a member of any
          organization.
        </p>
      </div>
    );
  }

  // Members loading
  if (membersLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
          Loading members...
        </div>
      </div>
    );
  }

  // Members error
  if (membersError) {
    return (
      <div className="rounded-xl border bg-background p-6">
        <h2 className="text-lg font-semibold">
          Failed to load members
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Something went wrong while loading
          organization members.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Members
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage members of your organization.
        </p>
      </div>

      {/* Organization */}
      <div className="rounded-lg border bg-background px-4 py-3">
        <p className="text-xs text-muted-foreground">
          Organization
        </p>

        <p className="mt-1 font-medium">
          {organization.name}
        </p>
      </div>

      {/* Add Member */}
      <div className="rounded-xl border bg-background p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <UserPlus className="size-4 text-primary" />
          </div>

          <div>
            <h2 className="font-semibold">
              Add Member
            </h2>

            <p className="text-sm text-muted-foreground">
              Add an existing user to this organization.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleAddMember}
          className="flex flex-col gap-3 lg:flex-row lg:items-end"
        >
          {/* User Select */}
          <div className="flex-1">
            <label
              htmlFor="user"
              className="mb-2 block text-sm font-medium"
            >
              Select User
            </label>

            <select
              id="user"
              value={selectedUserId}
              onChange={(e) =>
                setSelectedUserId(e.target.value)
              }
              disabled={
                availableUsersLoading ||
                addMemberMutation.isPending
              }
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">
                {availableUsersLoading
                  ? "Loading users..."
                  : "Select a user"}
              </option>

              {availableUsers.map((user) => (
                <option
                  key={user.id}
                  value={user.id}
                >
                  {user.name} ({user.email})
                </option>
              ))}
            </select>

            {availableUsersError && (
              <p className="mt-2 text-xs text-red-600">
                Failed to load available users.
              </p>
            )}

            {!availableUsersLoading &&
              !availableUsersError &&
              availableUsers.length === 0 && (
                <p className="mt-2 text-xs text-muted-foreground">
                  No available users to add.
                </p>
              )}
          </div>

          {/* Role */}
          <div className="lg:w-52">
            <label
              htmlFor="role"
              className="mb-2 block text-sm font-medium"
            >
              Role
            </label>

            <select
              id="role"
              value={role}
              onChange={(e) =>
                setRole(
                  e.target.value as
                    | "PROJECT_MANAGER"
                    | "MEMBER",
                )
              }
              disabled={
                addMemberMutation.isPending
              }
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="MEMBER">
                Member
              </option>

              <option value="PROJECT_MANAGER">
                Project Manager
              </option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={
              !selectedUserId ||
              addMemberMutation.isPending
            }
            className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {addMemberMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <UserPlus className="size-4" />
                Add Member
              </>
            )}
          </button>
        </form>

        {/* Error */}
        {addMemberMutation.isError && (
          <p className="mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600">
            Failed to add member. Please try again.
          </p>
        )}

        {/* Success */}
        {addMemberMutation.isSuccess && (
          <p className="mt-3 rounded-lg bg-green-500/10 px-3 py-2 text-sm text-green-600">
            Member added successfully.
          </p>
        )}
      </div>

      {/* Member Count */}
      <div className="flex w-fit items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm">
        <Users className="size-4 text-muted-foreground" />

        <span className="font-medium">
          {members.length}
        </span>

        <span className="text-muted-foreground">
          {members.length === 1
            ? "Member"
            : "Members"}
        </span>
      </div>

      {/* Members Table */}
      <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
        {members.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Users className="size-5 text-muted-foreground" />
            </div>

            <h2 className="mt-4 font-semibold">
              No members found
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              There are no members in this organization
              yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="border-b bg-muted/30">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Member
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Role
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Status
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Joined
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {members.map((member) => (
                  <tr
                    key={member.id}
                    className="transition-colors hover:bg-muted/30"
                  >
                    {/* Member */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {member.user.avatar ? (
                          <img
                            src={member.user.avatar}
                            alt={member.user.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                            {member.user.name
                              ?.charAt(0)
                              .toUpperCase()}
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="font-medium">
                            {member.user.name}
                          </p>

                          <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                            <Mail className="size-3" />

                            <span className="truncate">
                              {member.user.email}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="size-4 text-muted-foreground" />

                        <span className="text-sm">
                          {member.role.replace(
                            "_",
                            " ",
                          )}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                          member.user.isActive
                            ? "bg-green-500/10 text-green-600"
                            : "bg-red-500/10 text-red-600"
                        }`}
                      >
                        {member.user.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>

                    {/* Joined */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarDays className="size-4" />

                        {new Date(
                          member.joinedAt,
                        ).toLocaleDateString()}
                      </div>
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