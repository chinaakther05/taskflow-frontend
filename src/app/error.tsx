"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-2xl font-bold">
        Something went wrong!
      </h2>

      <p className="text-muted-foreground">
        We could not load this page.
      </p>

      <button
        type="button"
        onClick={() => reset()}
        className="rounded-md border px-4 py-2 hover:bg-muted"
      >
        Try again
      </button>
    </div>
  );
}