"use client";

export default function LeadsError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f7f9] px-4 text-zinc-950">
      <section className="w-full max-w-lg rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-rose-700">Could not load leads</p>
        <h1 className="mt-2 text-xl font-semibold text-zinc-950">
          We could not load your leads.
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          {error.message || "Please try again in a moment."}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-5 h-10 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Try Again
        </button>
      </section>
    </main>
  );
}
