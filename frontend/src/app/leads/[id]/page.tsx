import { LeadsRouteShell } from "@/app/leads/leads-route-shell";

export const dynamic = "force-dynamic";

export default async function LeadDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    q?: string;
    status?: string | string[];
  }>;
}) {
  const { id } = await params;
  return (
    <LeadsRouteShell
      modal={{ id, mode: "view" }}
      searchParams={searchParams}
    />
  );
}
