"use client";

import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";

/**
 * Accessible dialog: Escape and backdrop click close it, focus moves inside on
 * open, Tab stays inside, and focus returns to the opener on close.
 */
export default function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });

  // Runs once per open; reading onClose through a ref keeps focus from jumping on re-render.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    const focusables = () =>
      Array.from(
        panel?.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') ?? []
      ).filter((el) => !el.hasAttribute("disabled"));

    // Land on the primary action (last button) rather than the close icon.
    const items = focusables();
    (items[items.length - 1] ?? panel)?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeRef.current();
        return;
      }
      if (e.key !== "Tab") return;
      const list = focusables();
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      opener?.focus();
    };
  }, []);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        ref={panelRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between gap-4">
          <h2 id={titleId} className="pt-2 text-lg font-extrabold">
            {title}
          </h2>
          <button type="button" onClick={onClose} aria-label="Tutup" className="icon-btn -mr-2 -mt-1 shrink-0 !border-transparent !bg-transparent">
            <X className="size-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
