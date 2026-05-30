"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  const isInitialSearchRender = useRef(true);

  const updateFilters = useCallback(
    (nextQuery: string, nextStatuses: LeadStatus[]) => {
      const trimmedQuery = nextQuery.trim();
      const effectiveQuery =
        trimmedQuery.length === 0 || trimmedQuery.length >= 3 ? nextQuery : "";
      const queryString = getNextParams(effectiveQuery, nextStatuses);
      router.push(queryString ? `/leads?${queryString}` : "/leads");
    },
    [router],
  );

  useEffect(() => {
    if (isInitialSearchRender.current) {
      isInitialSearchRender.current = false;
      return;
    }

    const trimmedQuery = draftQuery.trim();

    if (trimmedQuery.length > 0 && trimmedQuery.length < 3) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      updateFilters(draftQuery, draftStatuses);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [draftQuery, draftStatuses, updateFilters]);

  function handleStatusChange(status: LeadStatus, checked: boolean) {
    const nextStatuses = checked
      ? [...draftStatuses, status]
      : draftStatuses.filter((currentStatus) => currentStatus !== status);

    setDraftStatuses(nextStatuses);
    updateFilters(draftQuery, nextStatuses);
  }

  function clearFilters() {
    setDraftQuery("");
    setDraftStatuses([]);
    updateFilters("", []);
  }

  return (
    <div className="flex flex-col gap-4 border-t border-zinc-100 px-5 py-5">
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
            placeholder="Type 3+ chars to search"
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
                className={`inline-flex h-10 cursor-pointer items-center gap-2 rounded-md border px-3 text-sm transition ${
                  draftStatuses.includes(status)
                    ? "border-zinc-950 bg-zinc-950 text-white"
                    : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"
                }`}
              >
                <input
                  type="checkbox"
                  name="status"
                  value={status}
                  checked={draftStatuses.includes(status)}
                  onChange={(event) =>
                    handleStatusChange(status, event.target.checked)
                  }
                  className="sr-only"
                />
                {STATUS_LABELS[status]}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={clearFilters}
            className="h-10 rounded-md border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 shadow-sm hover:border-zinc-300"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
