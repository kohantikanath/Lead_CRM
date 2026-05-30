import { LeadsRouteShell } from "@/app/leads/leads-route-shell";

export const dynamic = "force-dynamic";

export default async function BoardPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    status?: string | string[];
  }>;
}) {
  return <LeadsRouteShell searchParams={searchParams} view="kanban" />;
}
