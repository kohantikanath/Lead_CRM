import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/leads/status-badge";
import { StatusTransitionControl } from "@/components/leads/status-transition-control";
import { ApiError } from "@/lib/api/client";
import { getLead } from "@/lib/api/leads";

export const dynamic = "force-dynamic";

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-md border border-zinc-200 bg-white px-4 py-3">
      <dt className="text-xs font-medium uppercase tracking-normal text-zinc-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-zinc-950">{value}</dd>
    </div>
  );
}

export default async function LeadDetailPage({
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
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="border-b border-zinc-200 pb-6">
          <Link
            href="/leads"
            className="text-sm font-medium text-zinc-500 hover:text-zinc-950"
          >
            Back to leads
          </Link>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-zinc-950">
                {lead.name}
              </h1>
              <p className="mt-2 text-sm text-zinc-500">{lead.email}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={lead.status} />
              <StatusTransitionControl leadId={lead.id} status={lead.status} />
              <Link
                href={`/leads/${lead.id}/edit`}
                className="inline-flex h-10 items-center rounded-md bg-zinc-950 px-4 text-sm font-medium text-white shadow-sm hover:bg-zinc-800"
              >
                Edit Lead
              </Link>
            </div>
          </div>
        </header>

        <section className="mt-6">
          <dl className="grid gap-4 sm:grid-cols-2">
            <DetailItem label="Phone" value={lead.phone ?? "No phone"} />
            <DetailItem
              label="Source"
              value={lead.source?.replace("-", " ") ?? "Unassigned"}
            />
            <DetailItem label="Created" value={formatDateTime(lead.created_at)} />
            <DetailItem label="Updated" value={formatDateTime(lead.updated_at)} />
          </dl>
        </section>
      </div>
    </main>
  );
}
