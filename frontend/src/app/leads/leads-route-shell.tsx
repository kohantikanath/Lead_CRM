import { notFound } from "next/navigation";
import { LeadsClient, type ActiveLeadModal } from "@/app/leads/leads-client";
import { ApiError } from "@/lib/api/client";
import { getLead, getLeads } from "@/lib/api/leads";
import { LEAD_STATUSES, type LeadStatus } from "@/types/lead";

type LeadsSearchParams = {
  q?: string;
  status?: string | string[];
};

type LeadsRouteShellProps = {
  searchParams: Promise<LeadsSearchParams>;
  modal?: ActiveLeadModal;
};

function parseStatuses(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value.join(",") : value;

  if (!raw) {
    return [];
  }

  return raw
    .split(",")
    .filter((status): status is LeadStatus =>
      LEAD_STATUSES.includes(status as LeadStatus),
    );
}

export async function LeadsRouteShell({
  searchParams,
  modal,
}: LeadsRouteShellProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const statuses = parseStatuses(params.status);
  const leads = await getLeads({ q: query, statuses });
  let activeModal: ActiveLeadModal | undefined;

  if (modal?.mode === "new") {
    activeModal = modal;
  } else if (modal) {
    try {
      const lead = await getLead(modal.id);
      activeModal = {
        mode: modal.mode,
        id: modal.id,
        initialLead: lead,
      };
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        notFound();
      }

      throw error;
    }
  }

  return (
    <LeadsClient
      activeModal={activeModal}
      initialLeads={leads}
      query={query}
      statuses={statuses}
    />
  );
}
