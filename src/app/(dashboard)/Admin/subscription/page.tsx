
"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import apiClient from "@/lib/apiClient";
import { getMyOrganizations } from "@/api/organization";

interface Organization {
  id: string;
  name: string;
  slug: string;
  myRole: "ADMIN" | "PROJECT_MANAGER" | "MEMBER";
}

interface Subscription {
  id: string;
  organizationId: string;
  plan: "FREE" | "PRO" | "BUSINESS";
  maxProjects: number;
  maxMembers: number;
  isActive: boolean;
  startDate: string | null;
  endDate: string | null;
}

const SubscriptionPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

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

  // Get first organization
  const organization = organizations[0];
  const organizationId = organization?.id;

  // Get subscription
  const {
    data: subscriptionData,
    isLoading: subscriptionLoading,
    isError: subscriptionError,
    error: subscriptionQueryError,
  } = useQuery({
    queryKey: ["subscription", organizationId],

    queryFn: async () => {
      if (!organizationId) {
        throw new Error("Organization not found");
      }

      try {
        const response = await apiClient(
          `/subscriptions/${organizationId}`,
        );

        return response?.data as Subscription;
      } catch (error: any) {
        // Subscription doesn't exist yet
        if (
          error?.status === 404 ||
          error?.response?.status === 404
        ) {
          return null;
        }

        throw error;
      }
    },

    enabled: !!organizationId,
    retry: false,
  });

  const currentSubscription = subscriptionData ?? null;

  // Create FREE subscription
  const createSubscriptionMutation = useMutation({
    mutationFn: async () => {
      if (!organizationId) {
        throw new Error("Organization not found");
      }

      const response = await apiClient(
        "/subscriptions",
        {
          method: "POST",
          body: {
            organizationId,
            plan: "FREE",
          },
        },
      );

      return response.data as Subscription;
    },

    onSuccess: async () => {
      // Refresh subscription data
      await queryClient.invalidateQueries({
        queryKey: ["subscription", organizationId],
      });
    },
  });

  const handleCreateSubscription = () => {
    if (!organizationId) {
      return;
    }

    createSubscriptionMutation.mutate();
  };

  // Organization loading
  if (organizationLoading) {
    return (
      <div className="min-h-screen p-6">
        <div className="mx-auto max-w-4xl">
          <div className="h-8 w-56 animate-pulse rounded bg-muted" />

          <div className="mt-6 h-64 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    );
  }

  // Organization error
  if (organizationError) {
    return (
      <div className="min-h-screen px-4 py-10">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            Unable to load your organization.
          </div>
        </div>
      </div>
    );
  }

  // No organization
  if (!organizationId) {
    return (
      <div className="min-h-screen px-4 py-10">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-xl border bg-card p-8 text-center shadow-sm">
            <h2 className="text-xl font-semibold">
              No organization found
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              You are not a member of any organization yet.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Subscription loading
  if (subscriptionLoading) {
    return (
      <div className="min-h-screen p-6">
        <div className="mx-auto max-w-4xl">
          <div className="h-8 w-56 animate-pulse rounded bg-muted" />

          <div className="mt-6 h-64 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    );
  }

  // Subscription error
  if (subscriptionError) {
    return (
      <div className="min-h-screen px-4 py-10">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            Unable to load subscription.

            <p className="mt-1 text-xs">
              {subscriptionQueryError instanceof Error
                ? subscriptionQueryError.message
                : "Something went wrong."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Subscription
          </h1>

          <p className="mt-2 text-muted-foreground">
            Manage your TaskFlow organization subscription.
          </p>

          <p className="mt-2 text-sm text-muted-foreground">
            Organization:{" "}
            <span className="font-medium text-foreground">
              {organization.name}
            </span>
          </p>
        </div>

        {/* Create subscription error */}
        {createSubscriptionMutation.isError && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {(
              createSubscriptionMutation.error as any
            )?.data?.message ||
              (
                createSubscriptionMutation.error as any
              )?.message ||
              "Unable to create subscription."}
          </div>
        )}

        {/* No subscription */}
        {!currentSubscription && (
          <div className="rounded-xl border bg-card p-8 text-center shadow-sm">
            <h2 className="text-xl font-semibold">
              No subscription found
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Your organization does not have a subscription yet.
            </p>

            <button
              type="button"
              onClick={handleCreateSubscription}
              disabled={createSubscriptionMutation.isPending}
              className="mt-6 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {createSubscriptionMutation.isPending
                ? "Creating..."
                : "Start Free Plan"}
            </button>
          </div>
        )}

        {/* Current subscription */}
        {currentSubscription && (
          <div className="rounded-xl border bg-card p-8 shadow-sm">

            {/* Plan header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Current Plan
                </p>

                <h2 className="mt-1 text-3xl font-bold">
                  {currentSubscription.plan}
                </h2>
              </div>

              <span
                className={`w-fit rounded-full px-3 py-1 text-sm font-medium ${
                  currentSubscription.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {currentSubscription.isActive
                  ? "Active"
                  : "Inactive"}
              </span>
            </div>

            {/* Limits */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">

              <div className="rounded-lg bg-muted/50 p-5">
                <p className="text-sm text-muted-foreground">
                  Maximum Projects
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {currentSubscription.maxProjects}
                </p>
              </div>

              <div className="rounded-lg bg-muted/50 p-5">
                <p className="text-sm text-muted-foreground">
                  Maximum Members
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {currentSubscription.maxMembers}
                </p>
              </div>

            </div>

            {/* Upgrade */}
            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-semibold">
                Want more features?
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Upgrade your organization plan.
              </p>

              <button
                type="button"
                onClick={() =>
                  router.push(
                    `/Admin/payments?organizationId=${organizationId}&subscriptionId=${currentSubscription.id}`,
                  )
                }
                className="mt-4 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:opacity-90"
              >
                View Upgrade Plans
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPage;

