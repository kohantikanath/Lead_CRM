"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { LEAD_STATUSES, type LeadStatus } from "@/types/lead";
import { STATUS_LABELS } from "@/lib/leads/status";

type LeadFiltersProps = {
  query: string;
  statuses: LeadStatus[];
};

function getNextParams(query: string, statuses: LeadStatus[]) {
  const params = new URLSearchParams();
  const trimmedQuery = query.trim();

  if (trimmedQuery) {
    params.set("q", trimmedQuery);
  }

  if (statuses.length) {
    params.set("status", statuses.join(","));
  }

  return params.toString();
}

export function LeadFilters({ query, statuses }: LeadFiltersProps) {
  const router = useRouter();
  const [draftQuery, setDraftQuery] = useState(query);
  const [draftStatuses, setDraftStatuses] = useState(statuses);

  function applyFilters(nextQuery = draftQuery, nextStatuses = draftStatuses) {
    const queryString = getNextParams(nextQuery, nextStatuses);
    router.push(queryString ? `/leads?${queryString}` : "/leads");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    applyFilters();
  }

  function handleStatusChange(status: LeadStatus, checked: boolean) {
    setDraftStatuses((current) =>
      checked
        ? [...current, status]
        : current.filter((currentStatus) => currentStatus !== status),
    );
  }

  function clearFilters() {
    setDraftQuery("");
    setDraftStatuses([]);
    router.push("/leads");
  }

  return (
    <form
      onSubmit={handleSubmit}
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
            value={draftQuery}
            onChange={(event) => setDraftQuery(event.target.value)}
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
                  checked={draftStatuses.includes(status)}
                  onChange={(event) =>
                    handleStatusChange(status, event.target.checked)
                  }
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
            onClick={clearFilters}
            className="h-10 rounded-md border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 shadow-sm hover:border-zinc-300"
          >
            Clear
          </button>
        </div>
      </div>
    </form>
  );
}
