import Link from "next/link";

export default function LeadNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f7f9] px-4 text-zinc-950">
      <section className="w-full max-w-lg rounded-lg border border-zinc-200 bg-white p-6 text-center shadow-sm">
        <p className="text-sm font-medium text-zinc-500">Lead not found</p>
        <h1 className="mt-2 text-xl font-semibold text-zinc-950">
          This lead does not exist.
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          It may have been deleted or the link may be incorrect.
        </p>
        <Link
          href="/leads"
          className="mt-5 inline-flex h-10 items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Back to Leads
        </Link>
      </section>
    </main>
  );
}
