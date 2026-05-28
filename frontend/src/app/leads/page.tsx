import Link from "next/link";
import { getLeads } from "@/lib/api/leads";
import { STATUS_LABELS } from "@/lib/leads/status";
import type { Lead, LeadStatus } from "@/types/lead";

export const dynamic = "force-dynamic";

const statusStyles: Record<LeadStatus, string> = {
  NEW: "border-sky-200 bg-sky-50 text-sky-700",
  CONTACTED: "border-amber-200 bg-amber-50 text-amber-700",
  QUALIFIED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  CONVERTED: "border-violet-200 bg-violet-50 text-violet-700",
  LOST: "border-rose-200 bg-rose-50 text-rose-700",
};

function formatUpdatedAt(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function getLeadInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span
      className={`inline-flex h-7 items-center rounded-full border px-2.5 text-xs font-medium ${statusStyles[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

function LeadsTable({ leads }: { leads: Lead[] }) {
  if (!leads.length) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center border-t border-zinc-200 px-6 text-center">
        <p className="text-sm font-medium text-zinc-950">No leads found</p>
        <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
          Once a lead is created, it will appear here with its status, source,
          and latest update.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-0 text-left">
        <thead>
          <tr className="text-xs font-semibold uppercase tracking-normal text-zinc-500">
            <th scope="col" className="border-y border-zinc-200 px-5 py-3">
              Name
            </th>
            <th scope="col" className="border-y border-zinc-200 px-5 py-3">
              Email
            </th>
            <th scope="col" className="border-y border-zinc-200 px-5 py-3">
              Status
            </th>
            <th scope="col" className="border-y border-zinc-200 px-5 py-3">
              Source
            </th>
            <th scope="col" className="border-y border-zinc-200 px-5 py-3">
              Last Updated
            </th>
            <th
              scope="col"
              className="border-y border-zinc-200 px-5 py-3 text-right"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="group hover:bg-zinc-50">
              <td className="border-b border-zinc-100 px-5 py-4">
                <div className="flex min-w-56 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-zinc-900 text-xs font-semibold text-white">
                    {getLeadInitials(lead.name)}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-zinc-950">
                      {lead.name}
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {lead.phone ?? "No phone"}
                    </p>
                  </div>
                </div>
              </td>
              <td className="border-b border-zinc-100 px-5 py-4 text-sm text-zinc-600">
                {lead.email}
              </td>
              <td className="border-b border-zinc-100 px-5 py-4">
                <StatusBadge status={lead.status} />
              </td>
              <td className="border-b border-zinc-100 px-5 py-4 text-sm capitalize text-zinc-600">
                {lead.source?.replace("-", " ") ?? "Unassigned"}
              </td>
              <td className="border-b border-zinc-100 px-5 py-4 text-sm text-zinc-600">
                {formatUpdatedAt(lead.updated_at)}
              </td>
              <td className="border-b border-zinc-100 px-5 py-4">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/leads/${lead.id}`}
                    className="rounded-md border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:border-zinc-300 hover:bg-white"
                  >
                    View
                  </Link>
                  <Link
                    href={`/leads/${lead.id}/edit`}
                    className="rounded-md border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:border-zinc-300 hover:bg-white"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    className="rounded-md border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function LeadsPage() {
  const leads = await getLeads();

  return (
    <main className="min-h-screen bg-[#f6f7f9] text-zinc-950">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-5 border-b border-zinc-200 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-500">Lead pipeline</p>
            <h1 className="mt-2 text-2xl font-semibold text-zinc-950">
              Leads
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="h-10 rounded-md border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 shadow-sm hover:border-zinc-300"
            >
              Filter
            </button>
            <Link
              href="/leads/new"
              className="inline-flex h-10 items-center rounded-md bg-zinc-950 px-4 text-sm font-medium text-white shadow-sm hover:bg-zinc-800"
            >
              New Lead
            </Link>
          </div>
        </header>

        <section className="mt-6 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-zinc-950">
                All leads
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                {leads.length} records synced from the local API
              </p>
            </div>
            <label className="relative block w-full md:w-80">
              <span className="sr-only">Search leads</span>
              <input
                type="search"
                disabled
                placeholder="Search will be added in Task 3"
                className="h-10 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-500 outline-none"
              />
            </label>
          </div>
          <LeadsTable leads={leads} />
        </section>
      </div>
    </main>
  );
}
