
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CheckSquare,
  FolderKanban,
  LayoutDashboard,
  Settings,
  Users,
  ChevronDown,
  Bell,
} from "lucide-react";

import Logo from "@/components/shared/Logo";

const navigation = [
  {
    name: "Dashboard",
    href: "/Admin",
    icon: LayoutDashboard,
  },
  {
    name: "Members",
    href: "/Admin/members",
    icon: Users,
  },
  {
    name: "Projects",
    href: "/Admin/projects",
    icon: FolderKanban,
  },
  {
    name: "Tasks",
    href: "/Admin/tasks",
    icon: CheckSquare,
  },
  {
    name: "Requests",
    href: "/Admin/requests",
    icon: CheckSquare,
  },
  {
    name: "Payments",
    href: "/Admin/payments",
    icon: BarChart3,
  },
  {
    name: "Subscription",
    href: "/Admin/subscription",
    icon: BarChart3,
  },
  {
    name: "Team",
    href: "/Admin/team",
    icon: Users,
  },
  {
    name: "Reports",
    href: "/Admin/reports",
    icon: BarChart3,
  },
];

const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r bg-background lg:flex">
          <div className="flex w-full flex-col">
            {/* Logo */}
            <div className="flex h-16 items-center border-b px-6">
              <Logo />
            </div>

            {/* Workspace */}
            <div className="px-4 pt-5">
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-lg border bg-background px-3 py-2.5 text-left transition-colors hover:bg-muted"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    Creative Workspace
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Workspace
                  </p>
                </div>

                <ChevronDown className="ml-2 size-4 shrink-0 text-muted-foreground" />
              </button>
            </div>

            {/* Navigation */}
            <div className="px-4 pt-6">
              <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Workspace
              </p>

              <nav className="space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;

                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <Icon className="size-[18px]" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom */}
            <div className="mt-auto border-t p-4">
              <Link
                href="/settings"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Settings className="size-[18px]" />
                Settings
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Area */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Header */}
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur sm:px-6">
            {/* Mobile / Page title */}
            <div>
              <p className="text-xs text-muted-foreground">
                Workspace
              </p>

              <h1 className="text-sm font-semibold sm:text-base">
                Dashboard
              </h1>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-3">
              {/* Notification */}
              <button
                type="button"
                className="relative flex h-9 w-9 items-center justify-center rounded-lg border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Bell className="size-4" />

                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
              </button>

              {/* User */}
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted"
              >
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-medium">
                    Sohag
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Administrator
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  S
                </div>

                <ChevronDown className="hidden size-4 text-muted-foreground sm:block" />
              </button>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

