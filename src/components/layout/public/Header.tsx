"use client";

import { useState } from "react";
import Logo from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useGetMe, useLogout } from "@/hooks";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

export default function Header() {
  const routes = [
    { name: "Home", url: "/" },
    { name: "About Us", url: "/about-us" },
    { name: "Contact", url: "/contact" },
  ];

  const { data, isLoading } = useGetMe();
  const { mutate: logout } = useLogout();
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  
  const queryClient = useQueryClient();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        localStorage.removeItem("accessToken");
         setIsLoggedOut(true);
       
         queryClient.removeQueries({
  queryKey: ["user"],
});

         

        toast.add({
          title: "Tata",
          description: "Logged out successfully",
          type: "success",
        });
        
      },
      onError: (error) => {
        toast.add({
          title: "Logout failed",
          description: "Something went wrong",
          type: "error",
        });
      },
    });
  };

  return (
    <header className="w-full h-16 border-b flex items-center">
      <div className="flex justify-between items-center w-full max-w-7xl mx-auto px-4">
        <Logo />

        <nav className="flex gap-5">
          {routes.map((route) => (
            <Link key={route.url} href={route.url}>
              {route.name}
            </Link>
          ))}
        </nav>

        <div>
  {!isLoading && (!data || isLoggedOut) && (
    <Button
      variant="outline"
      render={<Link href="/login" />}
      nativeButton={false}
    >
      Login
    </Button>
  )}

  {!isLoading && data && !isLoggedOut && (
    <Button
      variant="outline"
      onClick={handleLogout}
    >
      Logout
    </Button>
  )}
</div>
      </div>
    </header>
  );
}