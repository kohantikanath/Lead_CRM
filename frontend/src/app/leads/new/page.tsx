import Link from "next/link";
import { LeadForm } from "@/components/leads/lead-form";

export default function NewLeadPage() {
  return (
    <main className="min-h-screen bg-[#f6f7f9] text-zinc-950">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="border-b border-zinc-200 pb-6">
          <Link
            href="/leads"
            className="text-sm font-medium text-zinc-500 hover:text-zinc-950"
          >
            Back to leads
          </Link>
          <h1 className="mt-3 text-2xl font-semibold text-zinc-950">
            New lead
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
            Capture a new prospect with the minimum details needed to start the
            pipeline.
          </p>
        </header>

        <section className="mt-6">
          <LeadForm mode="create" />
        </section>
      </div>
    </main>
  );
}
