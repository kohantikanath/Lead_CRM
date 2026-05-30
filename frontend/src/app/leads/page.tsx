import { LeadsRouteShell } from "@/app/leads/leads-route-shell";

export const dynamic = "force-dynamic";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    status?: string | string[];
    view?: string;
  }>;
}) {
  return <LeadsRouteShell searchParams={searchParams} />;
}
