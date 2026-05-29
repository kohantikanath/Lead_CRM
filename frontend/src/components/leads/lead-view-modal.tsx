"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { StatusBadge } from "@/components/leads/status-badge";
import { useLead } from "@/lib/api/lead-hooks";
import type { ReactNode } from "react";
import type { Lead } from "@/types/lead";

type LeadViewModalProps = {
  leadId: string;
  initialLead?: Lead;
};

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="rounded-md border border-zinc-200 bg-white px-4 py-3">
      <dt className="text-xs font-medium uppercase tracking-normal text-zinc-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-zinc-950">{value}</dd>
    </div>
  );
}

export function LeadViewModal({ leadId, initialLead }: LeadViewModalProps) {
  const router = useRouter();
  const { data: lead, isError, isLoading } = useLead(leadId, initialLead);

  function closeModal() {
    router.push("/leads");
  }

  return (
    <Modal
      title={lead?.name ?? "Lead details"}
      description={lead?.email}
      onClose={closeModal}
      maxWidthClassName="max-w-2xl"
      footer={
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={closeModal}
            className="h-10 rounded-md border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 shadow-sm hover:border-zinc-300"
          >
            Close
          </button>
          {lead ? (
            <Link
              href={`/leads/${lead.id}/edit`}
              className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-medium text-white shadow-sm hover:bg-zinc-800"
            >
              Edit Lead
            </Link>
          ) : null}
        </div>
      }
    >
      {isLoading ? (
        <p className="text-sm text-zinc-500">Loading lead...</p>
      ) : null}
      {isError ? (
        <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
          Lead details could not be loaded.
        </p>
      ) : null}
      {lead ? (
        <dl className="grid gap-4 sm:grid-cols-2">
          <DetailItem label="Status" value={<StatusBadge status={lead.status} />} />
          <DetailItem label="Phone" value={lead.phone ?? "No phone"} />
          <DetailItem
            label="Source"
            value={lead.source?.replace("-", " ") ?? "Unassigned"}
          />
          <DetailItem label="Created" value={formatDateTime(lead.created_at)} />
          <DetailItem label="Updated" value={formatDateTime(lead.updated_at)} />
        </dl>
      ) : null}
    </Modal>
  );
}
