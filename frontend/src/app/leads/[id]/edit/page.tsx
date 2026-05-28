import Link from "next/link";
import { notFound } from "next/navigation";
import { LeadForm } from "@/components/leads/lead-form";
import { ApiError } from "@/lib/api/client";
import { getLead } from "@/lib/api/leads";

export const dynamic = "force-dynamic";

export default async function EditLeadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let lead;

  try {
    lead = await getLead(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }

    throw error;
  }

  return (
    <main className="min-h-screen bg-[#f6f7f9] text-zinc-950">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="border-b border-zinc-200 pb-6">
          <Link
            href={`/leads/${lead.id}`}
            className="text-sm font-medium text-zinc-500 hover:text-zinc-950"
          >
            Back to lead
          </Link>
          <h1 className="mt-3 text-2xl font-semibold text-zinc-950">
            Edit lead
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
            Update contact details and source. Status changes stay in the
            pipeline controls.
          </p>
        </header>

        <section className="mt-6">
          <LeadForm mode="edit" lead={lead} />
        </section>
      </div>
    </main>
  );
}
