import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-11 w-full rounded-2xl border border-white/20 bg-slate-900/40 px-4 text-sm text-white placeholder:text-slate-300/70 focus:outline-none focus:ring-2 focus:ring-cyan-400/70",
        props.className,
      )}
    />
  );
}
