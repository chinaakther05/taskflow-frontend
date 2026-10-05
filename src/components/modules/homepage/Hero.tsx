
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";

const heroImages = [
  {
    src: "/hero/teamwork-meeting-with-business-people.jpg",
    alt: "Team working together",
  },
  {
    src: "/hero/team%20collaboration.jfif",
    alt: "Team collaboration",
  },
  {
    src: "/hero/remote%20team.jpg",
    alt: "Remote team working together",
  },
];

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full overflow-hidden border-b">
      {/* Soft background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
        {/* Left Side */}
        <div className="flex flex-col items-start">
          {/* Badge */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1.5 text-sm text-muted-foreground shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Simple project management for modern teams
          </div>

          {/* Heading */}
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Manage your team&apos;s work{" "}
            <span className="text-blue-600">
              all in one place.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            TaskFlow helps teams organize projects, assign tasks,
            collaborate with ease, and track progress from planning
            to completion — all in one powerful workspace.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button
              size="lg"
              className="h-12 px-6"
              render={
                <Link href="/register">
                  Get Started Free
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              }
              nativeButton={false}
            />

            <Button
              size="lg"
              variant="outline"
              className="h-12 px-6"
              render={
                <Link href="/login">
                  Login
                </Link>
              }
              nativeButton={false}
            />
          </div>

          {/* Features */}
          <div className="mt-10 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 shrink-0 text-blue-600" />
              No credit card required
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 shrink-0 text-blue-600" />
              Free plan available
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 shrink-0 text-blue-600" />
              Easy team collaboration
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 shrink-0 text-blue-600" />
              Setup in minutes
            </div>
          </div>
        </div>

        {/* Right Side - Image Slider */}
        <div className="relative">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border bg-muted shadow-2xl">
            {heroImages.map((image, index) => (
              <div
                key={image.src}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === activeIndex
                    ? "opacity-100"
                    : "opacity-0"
                }`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />

                {/* Image overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>
            ))}

            {/* Slider dots */}
            <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/30 px-3 py-2 backdrop-blur-sm">
              {heroImages.map((image, index) => (
                <button
                  key={image.src}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? "w-7 bg-white"
                      : "w-2 bg-white/60"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Small decorative card */}
          <div className="absolute -bottom-5 -left-5 hidden rounded-xl border bg-background p-4 shadow-lg sm:block">
            <p className="text-xs text-muted-foreground">
              Team productivity
            </p>
            <p className="mt-1 text-lg font-semibold">
              Everything organized
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

