
"use client";

import {
  Bell,
  Building2,
  Lock,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";

import { getMyOrganizations } from "@/api/organization";
import { useQuery } from "@tanstack/react-query";
import { useGetMe } from "@/hooks/auth.hook";

const MemberSettingPage = () => {
  // Get logged-in user
  const { data: userData, isLoading: userLoading } = useGetMe();

  // Get user's organizations
  const {
    data: organizationsData,
    isLoading: organizationLoading,
  } = useQuery({
    queryKey: ["my-organizations"],
    queryFn: getMyOrganizations,
  });

  const user = userData?.data;
  const organizations = organizationsData?.data ?? [];
  const organization = organizations[0];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [organizationName, setOrganizationName] = useState("");

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [taskNotifications, setTaskNotifications] = useState(true);

  // Set real user data
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setRole(user.role || "MEMBER");
    }
  }, [user]);

  // Set real organization data
  useEffect(() => {
    if (organization) {
      setOrganizationName(organization.name || "");
    }
  }, [organization]);

  const handleSave = () => {
    alert("Settings saved successfully!");
  };

  if (userLoading || organizationLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Member Settings
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage your member account and notification settings.
          </p>
        </div>

        {/* Profile Skeleton */}
        <div className="rounded-xl border bg-background p-6 shadow-sm">
          <div className="h-5 w-40 animate-pulse rounded bg-muted" />

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="h-10 animate-pulse rounded-lg bg-muted" />
            <div className="h-10 animate-pulse rounded-lg bg-muted" />
            <div className="h-10 animate-pulse rounded-lg bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Member Settings
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage your member account and notification settings.
        </p>
      </div>

      {/* Profile Settings */}
      <div className="rounded-xl border bg-background p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <UserRound className="size-5 text-primary" />
          </div>

          <div>
            <h2 className="font-semibold">
              Profile Settings
            </h2>

            <p className="text-sm text-muted-foreground">
              Your account information.
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {/* Name */}
          <div className="space-y-2">
            <label
              htmlFor="member-name"
              className="text-sm font-medium"
            >
              Name
            </label>

            <input
              id="member-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label
              htmlFor="member-email"
              className="text-sm font-medium"
            >
              Email
            </label>

            <input
              id="member-email"
              type="email"
              value={email}
              readOnly
              className="h-10 w-full rounded-lg border bg-muted px-3 text-sm outline-none"
            />
          </div>

          {/* Role */}
          <div className="space-y-2">
            <label
              htmlFor="member-role"
              className="text-sm font-medium"
            >
              Role
            </label>

            <input
              id="member-role"
              value={role}
              readOnly
              className="h-10 w-full rounded-lg border bg-muted px-3 text-sm outline-none"
            />
          </div>
        </div>
      </div>

      {/* Organization Settings */}
      <div className="rounded-xl border bg-background p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
            <Building2 className="size-5 text-blue-600" />
          </div>

          <div>
            <h2 className="font-semibold">
              Organization
            </h2>

            <p className="text-sm text-muted-foreground">
              Your current organization information.
            </p>
          </div>
        </div>

        <div className="max-w-xl space-y-2">
          <label
            htmlFor="organization-name"
            className="text-sm font-medium"
          >
            Organization Name
          </label>

          <input
            id="organization-name"
            value={organizationName}
            readOnly
            className="h-10 w-full rounded-lg border bg-muted px-3 text-sm outline-none"
          />

          <p className="text-xs text-muted-foreground">
            Only organization administrators can change the
            organization name.
          </p>
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-xl border bg-background p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
            <Bell className="size-5 text-yellow-600" />
          </div>

          <div>
            <h2 className="font-semibold">
              Notifications
            </h2>

            <p className="text-sm text-muted-foreground">
              Control how you receive notifications.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Email Notifications */}
          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border p-4">
            <div>
              <p className="text-sm font-medium">
                Email Notifications
              </p>

              <p className="text-xs text-muted-foreground">
                Receive important updates through email.
              </p>
            </div>

            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) =>
                setEmailNotifications(e.target.checked)
              }
              className="size-4 accent-primary"
            />
          </label>

          {/* Task Notifications */}
          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border p-4">
            <div>
              <p className="text-sm font-medium">
                Task Notifications
              </p>

              <p className="text-xs text-muted-foreground">
                Get notified about task updates.
              </p>
            </div>

            <input
              type="checkbox"
              checked={taskNotifications}
              onChange={(e) =>
                setTaskNotifications(e.target.checked)
              }
              className="size-4 accent-primary"
            />
          </label>
        </div>
      </div>

      {/* Security */}
      <div className="rounded-xl border bg-background p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
            <ShieldCheck className="size-5 text-green-600" />
          </div>

          <div>
            <h2 className="font-semibold">
              Security
            </h2>

            <p className="text-sm text-muted-foreground">
              Manage your account security.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition hover:bg-muted"
        >
          <Lock className="size-4" />
          Change Password
        </button>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          <Save className="size-4" />
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default MemberSettingPage;

