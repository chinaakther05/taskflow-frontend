
"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Shield,
  Bell,
  Lock,
  Save,
} from "lucide-react";
import { useGetMe } from "@/hooks/auth.hook";
;


const ManagerSettingPage = () => {
  const { data: userResponse } = useGetMe();

  const user = userResponse?.data;

  const [emailNotifications, setEmailNotifications] =
    useState(true);

  const [taskNotifications, setTaskNotifications] =
    useState(true);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Settings
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account and notification preferences.
        </p>
      </div>

      {/* Profile Information */}
      <div className="rounded-xl border bg-card">
        <div className="border-b p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2.5">
              <User className="h-5 w-5 text-primary" />
            </div>

            <div>
              <h2 className="font-semibold">
                Profile Information
              </h2>

              <p className="text-sm text-muted-foreground">
                Your account details
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 p-5 md:grid-cols-2">
          {/* Name */}
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />

              <div>
                <p className="text-xs text-muted-foreground">
                  Full Name
                </p>

                <p className="mt-1 font-medium">
                  {user?.name || "Loading..."}
                </p>
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />

              <div>
                <p className="text-xs text-muted-foreground">
                  Email
                </p>

                <p className="mt-1 font-medium">
                  {user?.email || "Loading..."}
                </p>
              </div>
            </div>
          </div>

          {/* Role */}
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-muted-foreground" />

              <div>
                <p className="text-xs text-muted-foreground">
                  Role
                </p>

                <p className="mt-1 font-medium">
                  Project Manager
                </p>
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-green-600" />

              <div>
                <p className="text-xs text-muted-foreground">
                  Account Status
                </p>

                <p className="mt-1 font-medium text-green-600">
                  Active
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-xl border bg-card">
        <div className="border-b p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2.5">
              <Bell className="h-5 w-5 text-primary" />
            </div>

            <div>
              <h2 className="font-semibold">
                Notifications
              </h2>

              <p className="text-sm text-muted-foreground">
                Manage your notification preferences
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y">
          {/* Email Notifications */}
          <div className="flex items-center justify-between gap-4 p-5">
            <div>
              <p className="font-medium">
                Email Notifications
              </p>

              <p className="text-sm text-muted-foreground">
                Receive important updates by email.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setEmailNotifications(!emailNotifications)
              }
              className={`relative h-6 w-11 rounded-full transition ${
                emailNotifications
                  ? "bg-primary"
                  : "bg-muted"
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                  emailNotifications
                    ? "left-6"
                    : "left-1"
                }`}
              />
            </button>
          </div>

          {/* Task Notifications */}
          <div className="flex items-center justify-between gap-4 p-5">
            <div>
              <p className="font-medium">
                Task Notifications
              </p>

              <p className="text-sm text-muted-foreground">
                Receive notifications about task updates.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setTaskNotifications(!taskNotifications)
              }
              className={`relative h-6 w-11 rounded-full transition ${
                taskNotifications
                  ? "bg-primary"
                  : "bg-muted"
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                  taskNotifications
                    ? "left-6"
                    : "left-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="rounded-xl border bg-card">
        <div className="border-b p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2.5">
              <Lock className="h-5 w-5 text-primary" />
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
        </div>

        <div className="p-5">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition hover:bg-muted"
          >
            <Lock className="h-4 w-4" />
            Change Password
          </button>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
        >
          <Save className="h-4 w-4" />
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ManagerSettingPage;

