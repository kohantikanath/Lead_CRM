"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { useCreateLead, useUpdateLead } from "@/lib/api/lead-hooks";
import type { Lead, LeadCreateInput } from "@/types/lead";

type LeadFormMode = "create" | "edit";

type LeadFormValues = {
  name: string;
  email: string;
  phone: string;
  source: string;
};

type LeadFormProps = {
  mode: LeadFormMode;
  lead?: Lead;
  embedded?: boolean;
  onSuccess?: (lead: Lead) => void;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9][0-9\s-]{6,19}$/;
const MAX_NAME_LENGTH = 80;
const MAX_EMAIL_LENGTH = 254;
const MAX_PHONE_LENGTH = 20;

function hasAtLeastTwoWords(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length >= 2;
}

function getInitialValues(lead?: Lead): LeadFormValues {
  return {
    name: lead?.name ?? "",
    email: lead?.email ?? "",
    phone: lead?.phone ?? "",
    source: lead?.source ?? "",
  };
}

function toPayload(values: LeadFormValues): LeadCreateInput {
  return {
    name: values.name.trim(),
    email: values.email.trim(),
    phone: values.phone.trim() || null,
    source: values.source.trim() || null,
  };
}

export function LeadForm({
  mode,
  lead,
  embedded = false,
  onSuccess,
}: LeadFormProps) {
  const router = useRouter();
  const createLead = useCreateLead();
  const updateLead = useUpdateLead();
  const [values, setValues] = useState(() => getInitialValues(lead));
  const [serverError, setServerError] = useState("");
  const isSubmitting = createLead.isPending || updateLead.isPending;

  const errors = useMemo(() => {
    const nextErrors: Partial<Record<keyof LeadFormValues, string>> = {};

    if (!values.name.trim()) {
      nextErrors.name = "Name is required.";
    } else if (!hasAtLeastTwoWords(values.name)) {
      nextErrors.name = "Enter at least first and last name.";
    } else if (values.name.trim().length > MAX_NAME_LENGTH) {
      nextErrors.name = `Name must be ${MAX_NAME_LENGTH} characters or fewer.`;
    }

    if (!values.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!EMAIL_RE.test(values.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    } else if (values.email.trim().length > MAX_EMAIL_LENGTH) {
      nextErrors.email = `Email must be ${MAX_EMAIL_LENGTH} characters or fewer.`;
    }

    if (values.phone.trim() && !PHONE_RE.test(values.phone.trim())) {
      nextErrors.phone =
        "Phone must be 7-20 characters and can include digits, spaces, hyphens, or a leading plus.";
    }

    return nextErrors;
  }, [values]);

  const isInvalid = Object.keys(errors).length > 0;
  const title = mode === "create" ? "Create lead" : "Edit lead";
  const submitLabel = mode === "create" ? "Create Lead" : "Save Changes";

  function updateField(field: keyof LeadFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setServerError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isInvalid || isSubmitting) {
      return;
    }

    setServerError("");

    try {
      const payload = toPayload(values);
      let savedLead: Lead | undefined;

      if (mode === "create") {
        savedLead = await createLead.mutateAsync(payload);
      } else if (lead) {
        savedLead = await updateLead.mutateAsync({
          id: lead.id,
          input: payload,
        });
      }

      if (savedLead && onSuccess) {
        onSuccess(savedLead);
      } else {
        router.push(
          mode === "edit" && savedLead ? `/leads/${savedLead.id}` : "/leads",
        );
      }
    } catch (error) {
      setServerError(
        error instanceof ApiError
          ? error.message
          : "The lead could not be saved. Please try again.",
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={
        embedded
          ? "overflow-hidden"
          : "overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm"
      }
      noValidate
    >
      {embedded ? null : (
        <div className="border-b border-zinc-200 px-5 py-4">
          <h2 className="text-sm font-semibold text-zinc-950">{title}</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Leads start as New. Contact details can be edited here; status
            changes stay in the pipeline controls.
          </p>
        </div>
      )}

      {serverError ? (
        <div className="border-b border-rose-100 bg-rose-50 px-5 py-3 text-sm text-rose-700">
          {serverError}
        </div>
      ) : null}

      <div
        className={
          embedded
            ? "grid gap-5 md:grid-cols-2"
            : "grid gap-5 px-5 py-5 md:grid-cols-2"
        }
      >
        <label className="block">
          <span className="text-sm font-medium text-zinc-700">Name</span>
          <input
            value={values.name}
            maxLength={MAX_NAME_LENGTH}
            onChange={(event) => updateField("name", event.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className="mt-1 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100"
            placeholder="Aman Gupta"
          />
          {errors.name ? (
            <p id="name-error" className="mt-1 text-xs text-rose-600">
              {errors.name}
            </p>
          ) : null}
        </label>

        <label className="block">
          <span className="text-sm font-medium text-zinc-700">Email</span>
          <input
            type="email"
            value={values.email}
            maxLength={MAX_EMAIL_LENGTH}
            onChange={(event) => updateField("email", event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className="mt-1 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100"
            placeholder="aman@example.com"
          />
          {errors.email ? (
            <p id="email-error" className="mt-1 text-xs text-rose-600">
              {errors.email}
            </p>
          ) : null}
        </label>

        <label className="block">
          <span className="text-sm font-medium text-zinc-700">Phone</span>
          <input
            value={values.phone}
            maxLength={MAX_PHONE_LENGTH}
            onChange={(event) => updateField("phone", event.target.value)}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            className="mt-1 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100"
            placeholder="+91-9876543210"
          />
          {errors.phone ? (
            <p id="phone-error" className="mt-1 text-xs text-rose-600">
              {errors.phone}
            </p>
          ) : null}
        </label>

        <label className="block">
          <span className="text-sm font-medium text-zinc-700">Source</span>
          <select
            value={values.source}
            onChange={(event) => updateField("source", event.target.value)}
            className="mt-1 h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100"
          >
            <option value="">Unassigned</option>
            <option value="website">Website</option>
            <option value="referral">Referral</option>
            <option value="campaign">Campaign</option>
            <option value="cold-outreach">Cold outreach</option>
            <option value="event">Event</option>
          </select>
        </label>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-zinc-200 bg-zinc-50 px-5 py-4 sm:flex-row sm:justify-end">
        <button
          type="submit"
          disabled={isInvalid || isSubmitting}
          className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-medium text-white shadow-sm hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
