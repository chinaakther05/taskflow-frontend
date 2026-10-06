"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  User,
  X,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import Logo from "@/components/shared/Logo";
import ThemeToggle from "@/components/themeToggle";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useGetMe, useLogout } from "@/hooks";

export default function Header() {
  const routes = [
    { name: "Home", url: "/" },
    { name: "About Us", url: "/about-us" },
    { name: "Contact", url: "/contact" },
  ];

  const { data, isLoading } = useGetMe();
  const { mutate: logout } = useLogout();

  const [mounted, setMounted] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    setMounted(true);
  }, []);

  const user = data?.data;

  const firstLetter =
    user?.name?.charAt(0).toUpperCase() || "U";

  /*
   * Dashboard route
   *
   * First we check role if the API provides it.
   * Then we use demo account email as fallback.
   */
  const dashboardPath =
    user?.role === "ADMIN"
      ? "/Admin"
      : user?.role === "PROJECT_MANAGER"
        ? "/project-manager"
        : user?.role === "MEMBER"
          ? "/member"
          : user?.email === "sohag@test.com"
            ? "/Admin"
            : user?.email === "manager@taskflow.com"
              ? "/project-manager"
              : user?.email === "member@taskflow.com"
                ? "/member"
                : "/Admin";

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        localStorage.removeItem("accessToken");

        setIsLoggedOut(true);
        setIsDropdownOpen(false);

        queryClient.removeQueries({
          queryKey: ["me"],
        });

        toast.add({
          title: "Tata",
          description: "Logged out successfully",
          type: "success",
        });
      },

      onError: () => {
        toast.add({
          title: "Logout failed",
          description: "Something went wrong",
          type: "error",
        });
      },
    });
  };

  return (
    <header className="w-full border-b">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4">
        <Logo />

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {routes.map((route) => (
            <Link
              key={route.url}
              href={route.url}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {route.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            onClick={() =>
              setIsMobileMenuOpen((prev) => !prev)
            }
            aria-label="Toggle navigation"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>

          <ThemeToggle />

          {mounted && !isLoading && (
            <>
              {/* Login */}
              {(!user || isLoggedOut) && (
                <Button
                  variant="outline"
                  render={<Link href="/login" />}
                  nativeButton={false}
                >
                  Login
                </Button>
              )}

              {/* User Menu */}
              {user && !isLoggedOut && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setIsDropdownOpen((prev) => !prev)
                    }
                    className="flex items-center gap-1 rounded-full"
                    aria-label="Open user menu"
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name || "User"}
                        className="h-9 w-9 rounded-full border object-cover"
                      />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                        {firstLetter}
                      </div>
                    )}

                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        isDropdownOpen
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 top-12 z-50 w-56 rounded-lg border bg-background p-2 shadow-lg">
                      <div className="mb-1 border-b px-3 pb-3">
                        <p className="font-semibold">
                          {user.name}
                        </p>

                        <p className="truncate text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>



                      {/* Dashboard */}
                      
                      <Link
                        href={dashboardPath}
                        onClick={() =>
                          setIsDropdownOpen(false)
                        }
                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>

                      {/* Profile */}
                      <Link
                        href="/profile"
                        onClick={() =>
                          setIsDropdownOpen(false)
                        }
                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted"
                      >
                        <User className="h-4 w-4" />
                        Profile
                      </Link>

                      {/* Logout */}
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-red-500 transition-colors hover:bg-muted"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="border-t md:hidden">
          <nav className="mx-auto flex w-full max-w-7xl flex-col px-4 py-3">
            {routes.map((route) => (
              <Link
                key={route.url}
                href={route.url}
                onClick={() =>
                  setIsMobileMenuOpen(false)
                }
                className="rounded-md px-3 py-3 text-sm font-medium transition-colors hover:bg-muted"
              >
                {route.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}