"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Brain, Home, LineChart, Table2 } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/dashboard/predict", label: "Predict", icon: Brain },
  { href: "/dashboard/analytics", label: "Analytics", icon: LineChart },
  { href: "/dashboard/history", label: "History", icon: Table2 },
  { href: "/dashboard/models", label: "Models", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-full rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-xl">
      <p className="mb-4 px-2 text-xs uppercase tracking-widest text-cyan-200">CampusCalm</p>
      <div className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-3 py-2 text-sm transition",
                active ? "bg-cyan-400/20 text-cyan-100" : "text-slate-200 hover:bg-white/10",
              )}
            >
              <Icon size={16} />
              {link.label}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
