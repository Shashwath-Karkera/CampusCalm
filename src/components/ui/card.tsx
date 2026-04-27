import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-3xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-xl", className)}>
      {children}
    </div>
  );
}
