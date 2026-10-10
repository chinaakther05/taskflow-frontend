"use client";

import {
  Bell,
  Check,
  CheckCheck,
  Circle,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";

import { getMyOrganizations } from "@/api/organization";
import { useGetMe } from "@/hooks/auth.hook";
import apiClient from "@/lib/apiClient";

type Notification = {
  id: string;
  type:
    | "TASK_ASSIGNED"
    | "TASK_STATUS_CHANGED"
    | "TASK_DEADLINE_NEAR"
    | "COMMENT_ADDED"
    | "MEMBER_ADDED"
    | "PROJECT_CREATED"
    | "PAYMENT_SUCCESS";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
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

type NotificationsResponse = {
  success: boolean;
  message: string;
  data: Notification[];
};

const notificationTypeLabel: Record<string, string> = {
  TASK_ASSIGNED: "Task Assigned",
  TASK_STATUS_CHANGED: "Task Status Changed",
  TASK_DEADLINE_NEAR: "Deadline Near",
  COMMENT_ADDED: "New Comment",
  MEMBER_ADDED: "Member Added",
  PROJECT_CREATED: "Project Created",
  PAYMENT_SUCCESS: "Payment Successful",
};

const MemberNotificationsPage = () => {
  const { data: userData } = useGetMe();

  const user = userData?.data;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [readingId, setReadingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        setError("");

        const organizationResponse =
          (await getMyOrganizations()) as OrganizationResponse;

        const organization = organizationResponse.data?.[0];

        if (!organization?.id) {
          throw new Error("No organization found");
        }

        const response =
          await apiClient<NotificationsResponse>(
            `/notifications/my/${organization.id}`,
          );

        setNotifications(response.data || []);
      } catch (err) {
        console.error("Notification Error:", err);
        setError("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchNotifications();
    }
  }, [user?.id]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      setReadingId(notificationId);

      await apiClient(
        `/notifications/${notificationId}/read`,
        {
          method: "PATCH",
        },
      );

      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) =>
          notification.id === notificationId
            ? {
                ...notification,
                isRead: true,
              }
            : notification,
        ),
      );
    } catch (err) {
      console.error("Mark as read error:", err);
    } finally {
      setReadingId(null);
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-52 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-4 w-72 animate-pulse rounded bg-muted" />
        </div>

        <div className="rounded-xl border bg-background p-6 shadow-sm">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="flex gap-4 rounded-lg border p-4"
              >
                <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-muted" />

                <div className="flex-1 space-y-2">
                  <div className="h-4 w-48 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-full animate-pulse rounded bg-muted" />
                  <div className="h-3 w-32 animate-pulse rounded bg-muted" />
                </div>
              </div>
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

        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">
              Notifications
            </h1>

            {unreadCount > 0 && (
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                {unreadCount} unread
              </span>
            )}
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Stay updated with your TaskFlow activities.
          </p>
        </div>
      </div>

      {/* Empty State */}
      {notifications.length === 0 ? (
        <div className="rounded-xl border bg-background p-10 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Bell className="size-6 text-muted-foreground" />
          </div>

          <h2 className="mt-4 text-lg font-semibold">
            No notifications yet
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            You are all caught up. New notifications will
            appear here.
          </p>
        </div>
      ) : (
        /* Notification List */
        <div className="rounded-xl border bg-background p-6 shadow-sm">
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-lg border p-4 transition ${
                  notification.isRead
                    ? "bg-background"
                    : "border-primary/30 bg-primary/5"
                }`}
              >
                <div className="flex gap-4">
                  {/* Icon */}
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      notification.isRead
                        ? "bg-muted"
                        : "bg-primary/10"
                    }`}
                  >
                    {notification.isRead ? (
                      <CheckCheck className="size-5 text-muted-foreground" />
                    ) : (
                      <Bell className="size-5 text-primary" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col justify-between gap-2 sm:flex-row">
                      <div>
                        <div className="flex items-center gap-2">
                          {!notification.isRead && (
                            <Circle className="size-2 fill-primary text-primary" />
                          )}

                          <h3 className="font-semibold">
                            {notification.title}
                          </h3>
                        </div>

                        <p className="mt-1 text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                      </div>

                      {/* Notification Type */}
                      <span className="h-fit w-fit rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                        {notificationTypeLabel[
                          notification.type
                        ] || notification.type}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                      <span>
                        {formatDate(notification.createdAt)}
                      </span>

                      {/* Mark as Read */}
                      {!notification.isRead && (
                        <button
                          type="button"
                          onClick={() =>
                            handleMarkAsRead(notification.id)
                          }
                          disabled={
                            readingId === notification.id
                          }
                          className="inline-flex w-fit items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {readingId === notification.id ? (
                            <>
                              <Loader2 className="size-3 animate-spin" />
                              Marking...
                            </>
                          ) : (
                            <>
                              <Check className="size-3" />
                              Mark as read
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberNotificationsPage;