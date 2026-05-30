import { LeadsRouteShell } from "@/app/leads/leads-route-shell";

export const dynamic = "force-dynamic";

export default function NewLeadPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    status?: string | string[];
    view?: string;
  }>;
}) {
  return (
    <LeadsRouteShell modal={{ mode: "new" }} searchParams={searchParams} />
  );
}
