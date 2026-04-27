import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { getSessionUser } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getSessionUser();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <main className="mx-auto grid min-h-screen max-w-7xl gap-4 p-4 md:grid-cols-[260px_1fr] md:p-6">
      <Sidebar />
      <section className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl md:p-6">{children}</section>
    </main>
  );
}
