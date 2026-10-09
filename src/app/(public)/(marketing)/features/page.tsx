
"use client";

import { useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  CreditCard,
  FolderKanban,
  LockKeyhole,
  ListTodo,
  Users,
} from "lucide-react";

const featureSections = [
  {
    icon: ListTodo,
    title: "Task Management",
    description:
      "Manage every task from creation to completion with a simple and organized workflow.",
    items: [
      {
        title: "Create Tasks",
        description:
          "Create tasks with a title, description, priority, project, and deadline.",
      },
      {
        title: "Assign Tasks",
        description:
          "Project Managers can assign tasks to organization members and keep work organized.",
      },
      {
        title: "Task Priority",
        description:
          "Set Low, Medium, High, or Urgent priority so your team knows what needs attention first.",
      },
      {
        title: "Task Status",
        description:
          "Track tasks through Pending Acceptance, Todo, In Progress, In Review, and Completed.",
      },
    ],
  },
  {
    icon: FolderKanban,
    title: "Project Management",
    description:
      "Keep projects, tasks, members, and progress organized in one workspace.",
    items: [
      {
        title: "Create Projects",
        description:
          "Create and manage projects with important project information in one place.",
      },
      {
        title: "Project Members",
        description:
          "Keep track of the members working on each project.",
      },
      {
        title: "Project Progress",
        description:
          "See project task counts and understand how much work has been completed.",
      },
    ],
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Bring your team together and make collaboration easier.",
    items: [
      {
        title: "Team Members",
        description:
          "View the members of your organization from a central team workspace.",
      },
      {
        title: "Task Assignment",
        description:
          "Project Managers can assign tasks to the appropriate team members.",
      },
      {
        title: "Shared Workspace",
        description:
          "Keep projects and team activities organized inside your workspace.",
      },
    ],
  },
  {
    icon: LockKeyhole,
    title: "Role-Based Access",
    description:
      "Different roles get different permissions based on their responsibilities.",
    items: [
      {
        title: "Admin",
        description:
          "Manage the organization, members, projects, subscriptions, and other administrative features.",
      },
      {
        title: "Project Manager",
        description:
          "Create and manage projects, create tasks, and assign tasks to team members.",
      },
      {
        title: "Member",
        description:
          "View assigned tasks, update task status, and work on assigned projects.",
      },
    ],
  },
  {
    icon: CreditCard,
    title: "Subscription & Payment",
    description:
      "Choose a plan that matches your team's needs and manage your subscription.",
    items: [
      {
        title: "Free Plan",
        description:
          "Start with the basic TaskFlow workspace and essential project management features.",
      },
      {
        title: "Pro Plan",
        description:
          "Get higher limits and additional capacity for growing teams.",
      },
      {
        title: "Business Plan",
        description:
          "Designed for larger teams that need more projects and members.",
      },
      {
        title: "Secure Payment",
        description:
          "TaskFlow supports secure Stripe test-mode payments for subscriptions.",
      },
    ],
  },
  {
    icon: CheckCircle2,
    title: "Progress Tracking",
    description:
      "Stay aware of what is completed, what is in progress, and what needs attention.",
    items: [
      {
        title: "Dashboard Overview",
        description:
          "See important project, task, member, and subscription information from your dashboard.",
      },
      {
        title: "Task Progress",
        description:
          "Follow task progress from pending to completed.",
      },
      {
        title: "Team Visibility",
        description:
          "Keep important work information visible to the people who need it.",
      },
    ],
  },
];

export default function FeaturesPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFeature = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Powerful Features
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Everything you need to manage your work
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
            TaskFlow brings projects, tasks, teams, permissions, and
            subscriptions together in one simple workspace.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-4xl space-y-4">
          {featureSections.map((feature, index) => {
            const Icon = feature.icon;
            const isOpen = openIndex === index;

            return (
              <div
                key={feature.title}
                className="overflow-hidden rounded-2xl border bg-card shadow-sm"
              >
                {/* Main Feature */}
                <button
                  type="button"
                  onClick={() => toggleFeature(index)}
                  className="flex w-full items-center justify-between gap-4 p-6 text-left transition-colors hover:bg-muted/50"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold">
                        {feature.title}
                      </h2>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>

                  <ChevronDown
                    className={`h-5 w-5 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Content */}
                {isOpen && (
                  <div className="border-t px-6 pb-6 pt-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                      {feature.items.map((item) => (
                        <div
                          key={item.title}
                          className="rounded-xl border bg-background p-5"
                        >
                          <div className="mb-2 flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-primary" />

                            <h3 className="font-semibold">
                              {item.title}
                            </h3>
                          </div>

                          <p className="text-sm leading-6 text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t px-6 py-16 text-center">
        <h2 className="text-3xl font-bold">
          Ready to manage your work better?
        </h2>

        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Bring your projects, tasks, and team together with TaskFlow.
        </p>
      </section>
    </main>
  );
}

