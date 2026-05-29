import { LeadsClient } from "@/app/leads/leads-client";
import { getLeads } from "@/lib/api/leads";
import { LEAD_STATUSES, type LeadStatus } from "@/types/lead";

export const dynamic = "force-dynamic";

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

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    status?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const statuses = parseStatuses(params.status);
  const leads = await getLeads({ q: query, statuses });

  return <LeadsClient initialLeads={leads} query={query} statuses={statuses} />;
}
