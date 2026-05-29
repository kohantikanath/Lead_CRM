"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type DropdownMenuProps = {
  buttonLabel: string;
  buttonContent: ReactNode;
  children: ReactNode;
};

export function DropdownMenu({
  buttonLabel,
  buttonContent,
  children,
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (
        menuRef.current &&
        event.target instanceof Node &&
        !menuRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={menuRef} className="relative inline-flex">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={buttonLabel}
        onClick={() => setIsOpen((current) => !current)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 bg-white text-sm font-semibold text-zinc-700 shadow-sm hover:border-zinc-300 hover:bg-zinc-50"
      >
        {buttonContent}
      </button>
      {isOpen ? (
        <div
          role="menu"
          className="absolute right-0 top-9 z-20 w-40 overflow-hidden rounded-md border border-zinc-200 bg-white py-1 shadow-lg"
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

type DropdownMenuItemProps = {
  children: ReactNode;
  onClick: () => void;
  tone?: "default" | "danger";
  disabled?: boolean;
};

export function DropdownMenuItem({
  children,
  onClick,
  tone = "default",
  disabled = false,
}: DropdownMenuItemProps) {
  const toneClassName =
    tone === "danger"
      ? "text-rose-700 hover:bg-rose-50"
      : "text-zinc-700 hover:bg-zinc-50";

  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={onClick}
      className={`block w-full px-3 py-2 text-left text-sm disabled:cursor-not-allowed disabled:text-zinc-300 ${toneClassName}`}
    >
      {children}
    </button>
  );
}
