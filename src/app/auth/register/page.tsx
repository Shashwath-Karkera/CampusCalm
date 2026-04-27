"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    age: 20,
    gender: "Male",
    yearOfStudy: 2,
    department: "Computer Science",
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, age: Number(form.age), yearOfStudy: Number(form.yearOfStudy) }),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string; detail?: string };
        setResponse({ type: "error", message: body.error ?? body.detail ?? "Registration failed. Please check your inputs." });
        return;
      }

      const body = (await res.json().catch(() => ({}))) as { message?: string };
      setResponse({ type: "success", message: body.message ?? "Registration successful. Redirecting to dashboard..." });
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
    <main className="mx-auto grid min-h-screen max-w-lg place-items-center px-4 py-8">
      <Card className="w-full">
        <h1 className="mb-5 text-2xl font-semibold">Create student account</h1>
        <form className="grid gap-3" onSubmit={submit}>
          <div className="space-y-1">
            <label htmlFor="name" className="text-sm font-medium text-slate-200">Full Name</label>
            <Input id="name" placeholder="Enter full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium text-slate-200">Email Address</label>
            <Input id="email" placeholder="Enter email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-medium text-slate-200">Password</label>
            <Input id="password" placeholder="Create password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <div className="space-y-1">
            <label htmlFor="age" className="text-sm font-medium text-slate-200">Age</label>
            <Input id="age" type="number" placeholder="Enter age" value={form.age} onChange={(e) => setForm({ ...form, age: Number(e.target.value) })} />
          </div>
          <div className="space-y-1">
            <label htmlFor="gender" className="text-sm font-medium text-slate-200">Gender</label>
            <Select id="gender" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </Select>
          </div>
          <div className="space-y-1">
            <label htmlFor="yearOfStudy" className="text-sm font-medium text-slate-200">Year of Study</label>
            <Input id="yearOfStudy" type="number" placeholder="Enter current year" value={form.yearOfStudy} onChange={(e) => setForm({ ...form, yearOfStudy: Number(e.target.value) })} />
          </div>
          <div className="space-y-1">
            <label htmlFor="department" className="text-sm font-medium text-slate-200">Department</label>
            <Input id="department" placeholder="Enter department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
          </div>
          <Button disabled={loading}>{loading ? "Creating account..." : "Create account"}</Button>
        </form>
        {response && (
          <p className={`mt-3 text-sm ${response.type === "success" ? "text-emerald-300" : "text-rose-300"}`}>
            {response.message}
          </p>
        )}
        <p className="mt-4 text-sm text-slate-300">Already registered? <Link className="text-cyan-300" href="/auth/login">Login</Link></p>
      </Card>
    </main>
  );
}
