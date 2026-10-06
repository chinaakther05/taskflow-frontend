
import React from "react";

const RequestPage = () => {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Requests</h1>
        <p className="text-sm text-muted-foreground">
          Manage workspace requests and approvals.
        </p>
      </div>

      <div className="rounded-xl border bg-background p-6">
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="text-center">
            <h2 className="text-lg font-semibold">
              No requests yet
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Workspace requests will appear here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestPage;

