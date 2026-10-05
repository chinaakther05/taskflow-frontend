
import React from "react";

const Trusted = () => {
  return (
    <section className="w-full border-b">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-blue-600">
            Built for modern teams
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Everything your team needs in one place
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            TaskFlow brings projects, tasks, team members, and progress
            tracking together in one simple workspace.
          </p>
        </div>

        {/* Stats */}
        <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 overflow-hidden rounded-2xl border bg-background/60 backdrop-blur-sm md:grid-cols-4">
          <div className="border-b p-6 text-center md:border-b-0 md:border-r">
            <p className="text-3xl font-bold text-blue-600">3</p>
            <p className="mt-1 text-sm text-muted-foreground">
              User Roles
            </p>
          </div>

          <div className="border-b p-6 text-center md:border-b-0 md:border-r">
            <p className="text-3xl font-bold text-blue-600">100%</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Team Focused
            </p>
          </div>

          <div className="border-b p-6 text-center md:border-b-0 md:border-r">
            <p className="text-3xl font-bold text-blue-600">24/7</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Workspace Access
            </p>
          </div>

          <div className="p-6 text-center">
            <p className="text-3xl font-bold text-blue-600">1</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Unified Workspace
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Trusted;

