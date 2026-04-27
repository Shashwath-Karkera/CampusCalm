"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [form, setForm] = useState({ email: "", password: "" });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setResponse({ type: "error", message: body.error ?? "Login failed. Please try again." });
        return;
      }

      const body = (await res.json().catch(() => ({}))) as { message?: string };
      setResponse({ type: "success", message: body.message ?? "Login successful. Redirecting to dashboard..." });
      setTimeout(() => {
        router.push("/dashboard");
      }, 700);
    } catch {
      setResponse({ type: "error", message: "Could not connect to the server. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto grid min-h-screen max-w-md place-items-center px-4">
      <Card className="w-full">
        <h1 className="mb-5 text-2xl font-semibold">Welcome back</h1>
        <form className="space-y-3" onSubmit={submit}>
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium text-slate-200">Email Address</label>
            <Input id="email" placeholder="Enter your email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-medium text-slate-200">Password</label>
            <Input id="password" placeholder="Enter your password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <Button className="w-full" disabled={loading}>{loading ? "Logging in..." : "Login"}</Button>
        </form>
        {response && (
          <p className={`mt-3 text-sm ${response.type === "success" ? "text-emerald-300" : "text-rose-300"}`}>
            {response.message}
          </p>
        )}
        <p className="mt-4 text-sm text-slate-300">No account? <Link className="text-cyan-300" href="/auth/register">Create one</Link></p>
      </Card>
    </main>
  );
}
