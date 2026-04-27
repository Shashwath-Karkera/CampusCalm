import { cn } from "@/lib/utils";
import type { SelectHTMLAttributes } from "react";

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "h-11 w-full rounded-2xl border border-white/20 bg-slate-900/40 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/70",
        props.className,
      )}
    />
  );
}
