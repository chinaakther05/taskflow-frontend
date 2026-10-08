"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  Mail,
  Shield,
  Users,
} from "lucide-react";

import apiClient from "@/lib/apiClient";
import { getMyOrganizations } from "@/api/organization";

type Organization = {
  id: string;
  name: string;
  description?: string | null;
};

type OrganizationResponse = {
  success: boolean;
  message: string;
  data: Organization[];
};

type Member = {
  id: string;
  role: "ADMIN" | "PROJECT_MANAGER" | "MEMBER";
  joinedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    isActive: boolean;
  };
};

type MemberResponse = {
  success: boolean;
  message: string;
  data: Member[];
};

const ProjectManagerMembersPage = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        setError("");

        const organizationResponse =
          (await getMyOrganizations()) as OrganizationResponse;

        const organization = organizationResponse.data?.[0];

        if (!organization?.id) {
          throw new Error("No organization found");
        }

        const memberResponse = await apiClient<MemberResponse>(
          `/organization-members/${organization.id}`,
        );

        setMembers(memberResponse.data || []);
      } catch (err) {
        console.error("Failed to load members:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load organization members",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const getInitial = (name: string) => {
    return name?.charAt(0)?.toUpperCase() || "U";
  };

  const formatRole = (role: Member["role"]) => {
    if (role === "PROJECT_MANAGER") {
      return "Project Manager";
    }

    if (role === "ADMIN") {
      return "Admin";
    }

    return "Member";
  };

  const formatJoinedDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Team Members</h1>
          <p className="text-muted-foreground">
            Manage and view your organization members.
          </p>
        </div>

        <div className="rounded-xl border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Loading members...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Team Members</h1>
          <p className="text-muted-foreground">
            Manage and view your organization members.
          </p>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="font-medium text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Team Members
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage and view your organization members.
        </p>
      </div>

      {/* Stats */}
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Total Members
            </p>

            <p className="text-2xl font-bold">
              {members.length}
            </p>
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="border-b px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">
                Organization Members
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {members.length}{" "}
                {members.length === 1 ? "member" : "members"}{" "}
                in your organization
              </p>
            </div>
          </div>
        </div>

        {members.length === 0 ? (
          <div className="p-10 text-center">
            <Users className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />

            <p className="font-medium">
              No organization members found.
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Members will appear here when they join your organization.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="border-b bg-muted/30 text-left">
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Member
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Email
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Role
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Status
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Joined
                  </th>
                </tr>
              </thead>

              <tbody>
                {members.map((member) => (
                  <tr
                    key={member.id}
                    className="border-b last:border-b-0 hover:bg-muted/20"
                  >
                    {/* Member */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {member.user.avatar ? (
                          <img
                            src={member.user.avatar}
                            alt={member.user.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                            {getInitial(member.user.name)}
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="truncate font-medium">
                            {member.user.name}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            Member ID: {member.id.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4 shrink-0" />

                        <span>{member.user.email}</span>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium">
                        <Shield className="h-3.5 w-3.5" />

                        {formatRole(member.role)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                          member.user.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            member.user.isActive
                              ? "bg-green-600"
                              : "bg-red-600"
                          }`}
                        />

                        {member.user.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>

                    {/* Joined */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarDays className="h-4 w-4" />

                        {formatJoinedDate(member.joinedAt)}
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
};

export default ProjectManagerMembersPage;