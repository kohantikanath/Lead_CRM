"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LeadFilters } from "@/app/leads/lead-filters";
import { LeadsKanbanBoard } from "@/app/leads/leads-kanban-board";
import { LeadActions } from "@/components/leads/lead-actions";
import { LeadCreateModal } from "@/components/leads/lead-create-modal";
import { LeadEditModal } from "@/components/leads/lead-edit-modal";
import { LeadViewModal } from "@/components/leads/lead-view-modal";
import { StatusBadge } from "@/components/leads/status-badge";
import { useLeads } from "@/lib/api/lead-hooks";
import type { LeadListParams } from "@/lib/api/leads";
import { STATUS_LABELS } from "@/lib/leads/status";
import {
  LEAD_STATUSES,
  type Lead,
  type LeadStatus,
  type LeadView,
} from "@/types/lead";

type LeadsClientProps = {
  initialLeads: Lead[];
  query: string;
  statuses: LeadStatus[];
  view: LeadView;
  activeModal?: ActiveLeadModal;
};

export type ActiveLeadModal =
  | {
      mode: "new";
    }
  | {
      id: string;
      mode: "view" | "edit";
      initialLead?: Lead;
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

function getStatusCounts(leads: Lead[]) {
  return LEAD_STATUSES.map((status) => ({
    status,
    count: leads.filter((lead) => lead.status === status).length,
  }));
}

function LeadsTable({
  leads,
  hasFilters,
  onOpenModal,
}: {
  leads: Lead[];
  hasFilters: boolean;
  onOpenModal: (modal: ActiveLeadModal) => void;
}) {
  if (!leads.length) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center border-t border-zinc-200 px-6 text-center">
        <p className="text-sm font-medium text-zinc-950">
          {hasFilters ? "No matching leads found" : "No leads found"}
        </p>
        <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
          {hasFilters
            ? "Try changing the search term or clearing one of the selected statuses."
            : "Once a lead is created, it will appear here with its status, source, and latest update."}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table
        className="w-full border-separate border-spacing-0 text-left"
        style={{ minWidth: "max(100%, 960px)" }}
      >
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
            <tr
              key={lead.id}
              tabIndex={0}
              onClick={() => onOpenModal({ id: lead.id, mode: "view" })}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  onOpenModal({ id: lead.id, mode: "view" });
                }
              }}
              className="group cursor-pointer hover:bg-zinc-50 focus:bg-zinc-50 focus:outline-none"
            >
              <td className="border-b border-zinc-100 px-5 py-4">
                <div className="flex min-w-60 items-center gap-3">
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
                <LeadActions
                  lead={lead}
                  onEdit={() => onOpenModal({ id: lead.id, mode: "edit" })}
                  onView={() => onOpenModal({ id: lead.id, mode: "view" })}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function LeadsClient({
  activeModal: initialActiveModal,
  initialLeads,
  query,
  statuses,
  view,
}: LeadsClientProps) {
  const router = useRouter();
  const [activeModal, setActiveModal] = useState(initialActiveModal);
  const params: LeadListParams = { q: query, statuses };
  const { data, isError, isFetching } = useLeads(params, initialLeads);
  const leads = data ?? [];
  const hasFilters = Boolean(query || statuses.length);
  const statusCounts = getStatusCounts(leads);

  function setView(nextView: LeadView) {
    const searchParams = new URLSearchParams(window.location.search);

    searchParams.delete("view");

    const queryString = searchParams.toString();
    const pathname = nextView === "kanban" ? "/board" : "/leads";
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  }

  function getListUrl() {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.delete("view");
    const queryString = searchParams.toString();
    const pathname = view === "kanban" ? "/board" : "/leads";

    return queryString ? `${pathname}?${queryString}` : pathname;
  }

  function getModalUrl(modal: ActiveLeadModal) {
    const searchParams = new URLSearchParams(window.location.search);

    if (view === "kanban") {
      searchParams.set("view", view);
    } else {
      searchParams.delete("view");
    }

    const queryString = searchParams.toString();
    const search = queryString ? `?${queryString}` : "";

    if (modal.mode === "new") {
      return `/leads/new${search}`;
    }

    const suffix = modal.mode === "edit" ? "/edit" : "";
    return `/leads/${modal.id}${suffix}${search}`;
  }

  function openModal(modal: ActiveLeadModal, replace = false) {
    const method = replace ? "replaceState" : "pushState";
    window.history[method](null, "", getModalUrl(modal));
    setActiveModal(modal);
  }

  function closeModal() {
    window.history.replaceState(null, "", getListUrl());
    setActiveModal(undefined);
  }

  useEffect(() => {
    function handlePopState() {
      const path = window.location.pathname;

      if (path === "/leads/new") {
        setActiveModal({ mode: "new" });
        return;
      }

      const match = path.match(/^\/leads\/([^/]+)(\/edit)?$/);

      if (match) {
        setActiveModal({
          id: match[1],
          mode: match[2] ? "edit" : "view",
        });
        return;
      }

      setActiveModal(undefined);
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <>
      <main className="min-h-screen bg-[#f6f7f9] text-zinc-950">
        <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-5 border-b border-zinc-200 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-500">Lead pipeline</p>
            <h1 className="mt-2 text-2xl font-semibold text-zinc-950">
              Leads
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
              Browse prospects, update pipeline progress, and keep contact
              details current.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => openModal({ mode: "new" })}
              className="inline-flex h-10 items-center rounded-md bg-zinc-950 px-4 text-sm font-medium text-white shadow-sm hover:bg-zinc-800"
            >
              New Lead
            </button>
          </div>
        </header>

        <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {statusCounts.map(({ status, count }) => (
            <div
              key={status}
              className="rounded-lg border border-zinc-200 bg-white px-4 py-3 shadow-sm"
            >
              <p className="text-xs font-medium uppercase tracking-normal text-zinc-500">
                {STATUS_LABELS[status]}
              </p>
              <p className="mt-2 text-2xl font-semibold text-zinc-950">
                {count}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-6 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-zinc-950">
                {hasFilters ? "Filtered leads" : "All leads"}
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                {leads.length} {leads.length === 1 ? "lead" : "leads"}
                {isFetching ? "..." : ""}
              </p>
            </div>
            <div
              aria-label="Lead view"
              className="inline-flex w-fit rounded-md border border-zinc-200 bg-zinc-50 p-1"
              role="group"
            >
              {(["list", "kanban"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={view === option}
                  onClick={() => setView(option)}
                  className={`h-8 rounded px-3 text-xs font-medium capitalize transition ${
                    view === option
                      ? "bg-white text-zinc-950 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-800"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          {isError ? (
            <div className="border-t border-rose-100 bg-rose-50 px-5 py-3 text-sm text-rose-700">
              Leads could not be refreshed. Please try again.
            </div>
          ) : null}
          <LeadFilters
            query={query}
            statuses={statuses}
            view={view}
          />
          {view === "list" ? (
            <LeadsTable
              leads={leads}
              hasFilters={hasFilters}
              onOpenModal={openModal}
            />
          ) : (
            <LeadsKanbanBoard
              leads={leads}
              onEditLead={(lead) =>
                openModal({ id: lead.id, mode: "edit", initialLead: lead })
              }
              onViewLead={(lead) =>
                openModal({ id: lead.id, mode: "view", initialLead: lead })
              }
            />
          )}
        </section>
        </div>
      </main>
      {activeModal?.mode === "view" ? (
        <LeadViewModal
          initialLead={activeModal.initialLead}
          leadId={activeModal.id}
          onClose={closeModal}
          onEdit={() =>
            openModal({ id: activeModal.id, mode: "edit" }, true)
          }
        />
      ) : null}
      {activeModal?.mode === "edit" ? (
        <LeadEditModal
          initialLead={activeModal.initialLead}
          leadId={activeModal.id}
          onClose={closeModal}
          onSuccess={(lead) =>
            openModal({ id: lead.id, mode: "view", initialLead: lead }, true)
          }
        />
      ) : null}
      {activeModal?.mode === "new" ? (
        <LeadCreateModal onClose={closeModal} onSuccess={closeModal} />
      ) : null}
    </>
  );
}
