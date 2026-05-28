"use client";

import { useRouter } from "next/navigation";
import { LEAD_STATUSES, type LeadStatus } from "@/types/lead";
import { STATUS_LABELS } from "@/lib/leads/status";

type LeadFiltersProps = {
  query: string;
  statuses: LeadStatus[];
};

function getNextParams(formData: FormData) {
  const params = new URLSearchParams();
  const query = String(formData.get("q") ?? "").trim();
  const statuses = formData
    .getAll("status")
    .map(String)
    .filter(Boolean);

  if (query) {
    params.set("q", query);
  }

  if (statuses.length) {
    params.set("status", statuses.join(","));
  }

  return params.toString();
}

export function LeadFilters({ query, statuses }: LeadFiltersProps) {
  const router = useRouter();

  function handleSubmit(formData: FormData) {
    const queryString = getNextParams(formData);
    router.push(queryString ? `/leads?${queryString}` : "/leads");
  }

  return (
    <form
      action={handleSubmit}
      className="flex flex-col gap-4 border-t border-zinc-100 px-5 py-4"
    >
      <div className="grid gap-3 lg:grid-cols-[minmax(220px,360px)_1fr_auto] lg:items-end">
        <label className="block">
          <span className="text-xs font-medium text-zinc-500">
            Search leads
          </span>
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search by name or email"
            className="mt-1 h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100"
          />
        </label>

        <fieldset>
          <legend className="text-xs font-medium text-zinc-500">
            Status
          </legend>
          <div className="mt-1 flex flex-wrap gap-2">
            {LEAD_STATUSES.map((status) => (
              <label
                key={status}
                className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-700 transition hover:border-zinc-300"
              >
                <input
                  type="checkbox"
                  name="status"
                  value={status}
                  defaultChecked={statuses.includes(status)}
                  className="h-4 w-4 rounded border-zinc-300 accent-zinc-950"
                />
                {STATUS_LABELS[status]}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex gap-2">
          <button
            type="submit"
            className="h-10 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white shadow-sm hover:bg-zinc-800"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={() => router.push("/leads")}
            className="h-10 rounded-md border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 shadow-sm hover:border-zinc-300"
          >
            Clear
          </button>
        </div>
      </div>
    </form>
  );
}
