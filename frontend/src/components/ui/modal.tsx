"use client";

import type { ReactNode } from "react";

type ModalProps = {
  title: string;
  children: ReactNode;
  onClose: () => void;
  description?: string;
  footer?: ReactNode;
  maxWidthClassName?: string;
  showCloseButton?: boolean;
};

export function Modal({
  title,
  children,
  onClose,
  description,
  footer,
  maxWidthClassName = "max-w-lg",
  showCloseButton = true,
}: ModalProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby={description ? "modal-description" : undefined}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-zinc-950/30 px-4 py-6"
    >
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />
      <div
        className={`relative w-full ${maxWidthClassName} overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-xl`}
      >
        <div className="border-b border-zinc-200 px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id="modal-title" className="text-base font-semibold text-zinc-950">
                {title}
              </h2>
              {description ? (
                <p
                  id="modal-description"
                  className="mt-1 text-sm leading-6 text-zinc-500"
                >
                  {description}
                </p>
              ) : null}
            </div>
            {showCloseButton ? (
              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-zinc-200 text-lg leading-none text-zinc-500 hover:border-zinc-300 hover:text-zinc-950"
                aria-label="Close"
              >
                x
              </button>
            ) : null}
          </div>
        </div>
        <div className="px-5 py-5">{children}</div>
        {footer ? (
          <div className="border-t border-zinc-200 bg-zinc-50 px-5 py-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
