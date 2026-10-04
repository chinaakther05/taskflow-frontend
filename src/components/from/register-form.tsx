"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeClosed } from "lucide-react";

import GoogleInComponent from "@/google-login/GoogleLogin";
import { useRegister } from "@/hooks";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FieldSeparator } from "../ui/field";
import { toast } from "../ui/toast";

export default function RegisterForm() {
  const router = useRouter();

  const { mutate: registerUser, isPending } = useRegister();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.add({
        title: "Registration Failed",
        description: "Please fill in all fields",
        type: "error",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.add({
        title: "Registration Failed",
        description: "Passwords do not match",
        type: "error",
      });
      return;
    }

    registerUser(
      {
        name,
        email,
        password,
      },
      {
        onSuccess: () => {
          toast.add({
            title: "Registration Successful",
            description: "Your account has been created",
            type: "success",
          });

          router.push("/login");
        },

        onError: (error) => {
          toast.add({
            title: "Registration Failed",
            description:
              error.message || "Something went wrong",
            type: "error",
          });
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-4 p-6 md:p-10">

      {/* Title */}
     <div className="flex flex-col gap-1">
  <h1 className="text-2xl font-bold">Create an account</h1>
  <p className="text-sm text-muted-foreground">
    Enter your details to create your TaskFlow account
  </p>
</div>

      {/* Register Form */}
      <form
        onSubmit={handleRegister}
        className="flex flex-col gap-4"
      >
        {/* Name */}
        <div className="flex flex-col gap-2">
          <label htmlFor="name">Name</label>

          <Input
            id="name"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label htmlFor="email">Email</label>

          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2">
          <label htmlFor="password">Password</label>

          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPassword ? (
                <EyeClosed size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-2">
          <label htmlFor="confirmPassword">
            Confirm Password
          </label>

          <div className="relative">
            <Input
              id="confirmPassword"
              type={
                showConfirmPassword ? "text" : "password"
              }
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              className="pr-10"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showConfirmPassword ? (
                <EyeClosed size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        </div>

        {/* Register Button */}
        <Button
          type="submit"
          disabled={isPending}
        >
          {isPending
            ? "Creating Account..."
            : "Register"}
        </Button>
      </form>

      {/* Google Login */}
      <FieldSeparator>
        OR continue with
      </FieldSeparator>

      <GoogleInComponent />

      {/* Login Link */}
      <div className="text-center text-muted-foreground text-sm">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium underline underline-offset-4 hover:text-primary"
        >
          Login
        </Link>
      </div>

    </div>
  );
}