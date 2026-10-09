
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useGetMe } from "@/hooks";
import {
  UserRound,
  Mail,
  ShieldCheck,
  CalendarDays,
  CheckCircle2,
  LoaderCircle,
  ArrowLeft,
  Home,
} from "lucide-react";

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);
  const { data, isLoading, isError } = useGetMe();

  useEffect(() => {
    setMounted(true);
  }, []);

  const user = data?.data;

  // Keep server and initial client render identical.
  if (!mounted) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-background px-4">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Loading your profile...
          </p>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-background px-4">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Loading your profile...
          </p>
        </div>
      </main>
    );
  }

  if (isError || !user) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-background px-4">
        <div className="max-w-md rounded-2xl border bg-card p-8 text-center shadow-sm">
          <UserRound className="mx-auto h-12 w-12 text-muted-foreground" />

          <h1 className="mt-4 text-xl font-bold">
            Profile unavailable
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            We couldn't load your profile. Please log in again and try once more.
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  const firstLetter =
    user.name?.trim()?.charAt(0)?.toUpperCase() || "U";

  const normalizedRole = String(user.role ?? "")
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");

  const role =
    normalizedRole === "ADMIN"
      ? "Admin"
      : normalizedRole === "PROJECT_MANAGER"
        ? "Project Manager"
        : normalizedRole === "MEMBER"
          ? "Member"
          : "Role not available";

  const roleDescription =
    normalizedRole === "ADMIN"
      ? "Manage the platform and its users."
      : normalizedRole === "PROJECT_MANAGER"
        ? "Manage projects, tasks, and team activities."
        : normalizedRole === "MEMBER"
          ? "View and manage your assigned tasks."
          : "Your account role could not be loaded.";

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Top Navigation */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border bg-card px-4 py-2.5 text-sm font-medium transition hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Account Details
          </span>
        </div>

        {/* Page Heading */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            My Account
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            My Profile
          </h1>

          <p className="mt-3 text-muted-foreground">
            View your personal information and TaskFlow account role.
          </p>
        </div>

        {/* Profile Overview */}
        <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
          <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 sm:h-40" />

          <div className="px-5 pb-7 sm:px-8">
            <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end">
              {/* Avatar */}
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name || "User avatar"}
                  className="h-24 w-24 rounded-2xl border-4 border-card bg-card object-cover shadow-md sm:h-28 sm:w-28"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-card bg-primary text-3xl font-bold text-primary-foreground shadow-md sm:h-28 sm:w-28">
                  {firstLetter}
                </div>
              )}

              {/* User Information */}
              <div className="min-w-0 flex-1 pb-1">
                <h2 className="break-words text-2xl font-bold">
                  {user.name || "TaskFlow User"}
                </h2>

                <p className="mt-1 break-all text-sm text-muted-foreground">
                  {user.email || "Email not provided"}
                </p>
              </div>

              {/* Role Badge */}
              <div className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary">
                <ShieldCheck className="h-4 w-4" />
                {role}
              </div>
            </div>

            {/* Account Status */}
            <div className="mt-8 flex flex-wrap items-center gap-2 border-t pt-5">
              <CheckCircle2 className="h-4 w-4 text-green-600" />

              <span className="text-sm font-medium">
                Account Information
              </span>

              <span className="rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-600">
                Available
              </span>
            </div>
          </div>
        </section>

        {/* Personal Information */}
        <section className="mt-8">
          <h2 className="mb-4 text-xl font-bold">
            Personal Information
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Full Name */}
            <div className="rounded-2xl border bg-card p-5 transition-shadow hover:shadow-md sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <UserRound className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">
                    Full Name
                  </p>

                  <p className="mt-1 break-words font-semibold">
                    {user.name || "Not provided"}
                  </p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="rounded-2xl border bg-card p-5 transition-shadow hover:shadow-md sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
                  <Mail className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm text-muted-foreground">
                    Email Address
                  </p>

                  <p className="mt-1 break-all font-semibold">
                    {user.email || "Not provided"}
                  </p>
                </div>
              </div>
            </div>

            {/* Account Role */}
            <div className="rounded-2xl border bg-card p-5 transition-shadow hover:shadow-md sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600">
                  <ShieldCheck className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">
                    Account Role
                  </p>

                  <p className="mt-1 font-semibold">{role}</p>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {roleDescription}
                  </p>
                </div>
              </div>
            </div>

            {/* Workspace */}
            <div className="rounded-2xl border bg-card p-5 transition-shadow hover:shadow-md sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                  <CalendarDays className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">
                    Workspace
                  </p>

                  <p className="mt-1 font-semibold">
                    TaskFlow
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Navigation */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            <Home className="h-4 w-4" />
            Return to Home Page
          </Link>
        </div>
      </div>
    </main>
  );
}

