'use client';

import { useState } from "react";
import { Menu } from "lucide-react";
import { Sidebar } from "./Sidebar";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-9 w-9 items-center justify-center rounded-control border border-border text-text-muted hover:bg-surface md:hidden"
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative z-10 w-60 bg-surface" onClick={() => setOpen(false)}>
            <Sidebar />
          </div>
        </div>
      )}
    </>
  );
}