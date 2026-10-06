"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMyOrganizations } from "@/api/organization";
import apiClient from "@/lib/apiClient";

type Plan = "PRO" | "BUSINESS";

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

const Paymentpage = () => {
  const [subscription, setSubscription] =
    useState<Subscription | null>(null);

  const [loadingSubscription, setLoadingSubscription] =
    useState(true);

  const [paymentLoading, setPaymentLoading] =
    useState<Plan | null>(null);

  const [error, setError] = useState("");

  // Get logged-in user's organization
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

  // Load subscription
  useEffect(() => {
    if (organizationLoading) return;

    if (organizationError) {
      setError("Unable to load organization information.");
      setLoadingSubscription(false);
      return;
    }

    if (!organizationId) {
      setError("Organization information is missing.");
      setLoadingSubscription(false);
      return;
    }

    const loadSubscription = async () => {
      try {
        setLoadingSubscription(true);
        setError("");

        const result = await apiClient<{
          data: Subscription;
        }>(`/subscriptions/${organizationId}`);

        setSubscription(result.data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load subscription",
        );
      } finally {
        setLoadingSubscription(false);
      }
    };

    loadSubscription();
  }, [
    organizationId,
    organizationLoading,
    organizationError,
  ]);

  // Create Stripe payment
  const handlePayment = async (
    plan: Plan,
    amount: number,
  ) => {
    if (!organizationId) {
      setError("Organization information is missing.");
      return;
    }

    if (!subscription?.id) {
      setError("Subscription information is missing.");
      return;
    }

    try {
      setPaymentLoading(plan);
      setError("");

      const result = await apiClient<{
        data?: {
          checkoutUrl?: string;
        };
      }>("/payments", {
        method: "POST",

        body: {
          organizationId,
          subscriptionId: subscription.id,
          plan,
          amount,
          currency: "BDT",
        },
      });

      const checkoutUrl =
        result.data?.checkoutUrl;

      if (!checkoutUrl) {
        throw new Error(
          "Stripe checkout URL was not returned.",
        );
      }

      // Redirect to Stripe Checkout
      window.location.href = checkoutUrl;
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Payment failed",
      );

      setPaymentLoading(null);
    }
  };

  if (
    organizationLoading ||
    loadingSubscription
  ) {
    return (
      <div className="min-h-screen bg-background px-4 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10">
            <div className="h-8 w-48 animate-pulse rounded bg-muted" />

            <div className="mt-3 h-4 w-72 animate-pulse rounded bg-muted" />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="h-80 animate-pulse rounded-xl bg-muted" />
            <div className="h-80 animate-pulse rounded-xl bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Subscription & Payment
          </h1>

          <p className="mt-2 text-muted-foreground">
            Choose the best plan for your TaskFlow
            organization.
          </p>

          {organization && (
            <p className="mt-2 text-sm font-medium">
              Organization: {organization.name}
            </p>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-center text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Current Subscription */}
        {subscription && (
          <div className="mb-8 rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Current Plan
                </p>

                <h2 className="mt-1 text-2xl font-bold">
                  {subscription.plan}
                </h2>
              </div>

              <div>
                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ${
                    subscription.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {subscription.isActive
                    ? "Active"
                    : "Inactive"}
                </span>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">
                  Maximum Projects
                </p>

                <p className="mt-1 text-xl font-semibold">
                  {subscription.maxProjects}
                </p>
              </div>

              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">
                  Maximum Members
                </p>

                <p className="mt-1 text-xl font-semibold">
                  {subscription.maxMembers}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Plans */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* PRO */}
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="text-2xl font-bold">
              Pro
            </h2>

            <p className="mt-2 text-3xl font-bold">
              ৳1,000
              <span className="text-sm font-normal text-muted-foreground">
                {" "}
                / plan
              </span>
            </p>

            <p className="mt-3 text-sm text-muted-foreground">
              Perfect for growing teams.
            </p>

            <ul className="mt-6 space-y-3 text-sm">
              <li>✓ Up to 20 projects</li>
              <li>✓ Up to 50 members</li>
              <li>✓ Team collaboration</li>
              <li>✓ Time tracking</li>
            </ul>

            <button
              type="button"
              onClick={() =>
                handlePayment("PRO", 1000)
              }
              disabled={
                paymentLoading !== null
              }
              className="mt-8 w-full rounded-lg bg-primary px-4 py-3 font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {paymentLoading === "PRO"
                ? "Redirecting..."
                : "Subscribe to Pro"}
            </button>
          </div>

          {/* BUSINESS */}
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="text-2xl font-bold">
              Business
            </h2>

            <p className="mt-2 text-3xl font-bold">
              ৳2,500
              <span className="text-sm font-normal text-muted-foreground">
                {" "}
                / plan
              </span>
            </p>

            <p className="mt-3 text-sm text-muted-foreground">
              For larger teams and organizations.
            </p>

            <ul className="mt-6 space-y-3 text-sm">
              <li>✓ Up to 100 projects</li>
              <li>✓ Up to 200 members</li>
              <li>✓ Advanced analytics</li>
              <li>✓ Priority support</li>
            </ul>

            <button
              type="button"
              onClick={() =>
                handlePayment(
                  "BUSINESS",
                  2500,
                )
              }
              disabled={
                paymentLoading !== null
              }
              className="mt-8 w-full rounded-lg bg-primary px-4 py-3 font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {paymentLoading === "BUSINESS"
                ? "Redirecting..."
                : "Subscribe to Business"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Paymentpage;