import { cn } from "@/lib/utils";
import type { TextareaHTMLAttributes } from "react";

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full rounded-2xl border border-white/20 bg-slate-900/40 p-4 text-sm text-white placeholder:text-slate-300/70 focus:outline-none focus:ring-2 focus:ring-cyan-400/70",
        props.className,
      )}
    />
  );
}
