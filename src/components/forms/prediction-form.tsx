"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type FormData = {
  age: number;
  gender: string;
  yearOfStudy: number;
  attendance: number;
  studyHours: number;
  sleepHours: number;
  screenTime: number;
  assignmentsPerWeek: number;
  examPressure: number;
  financialPressure: number;
  socialSupport: number;
  physicalActivity: number;
  backlogCount: number;
};

const defaults: FormData = {
  age: 20,
  gender: "Male",
  yearOfStudy: 2,
  attendance: 82,
  studyHours: 4,
  sleepHours: 6.8,
  screenTime: 5,
  assignmentsPerWeek: 5,
  examPressure: 7,
  financialPressure: 5,
  socialSupport: 6,
  physicalActivity: 2,
  backlogCount: 1,
};

export function PredictionForm() {
  const [data, setData] = useState<FormData>(defaults);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setResponse({ type: "error", message: body.error ?? "Prediction failed. Please review your inputs." });
        return;
      }

      const json = await res.json();
      setResponse({ type: "success", message: "Prediction completed. Redirecting to results..." });
      const search = new URLSearchParams({
        level: json.predictedStress,
        score: String(json.probabilityScore),
      });
      setTimeout(() => {
        router.push(`/dashboard/predict?${search.toString()}`);
      }, 450);
    } catch {
      setResponse({ type: "error", message: "Could not connect to the server. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
      <div className="space-y-1">
        <label htmlFor="age" className="text-sm font-medium text-slate-200">Age</label>
        <Input id="age" type="number" value={data.age} onChange={(e) => setData({ ...data, age: Number(e.target.value) })} placeholder="Enter age" />
      </div>
      <div className="space-y-1">
        <label htmlFor="gender" className="text-sm font-medium text-slate-200">Gender</label>
        <Select id="gender" value={data.gender} onChange={(e) => setData({ ...data, gender: e.target.value })}>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </Select>
      </div>
      <div className="space-y-1">
        <label htmlFor="yearOfStudy" className="text-sm font-medium text-slate-200">Year of Study</label>
        <Input id="yearOfStudy" type="number" value={data.yearOfStudy} onChange={(e) => setData({ ...data, yearOfStudy: Number(e.target.value) })} placeholder="1 to 6" />
      </div>
      <div className="space-y-1">
        <label htmlFor="attendance" className="text-sm font-medium text-slate-200">Attendance Percentage</label>
        <Input id="attendance" type="number" value={data.attendance} onChange={(e) => setData({ ...data, attendance: Number(e.target.value) })} placeholder="0 to 100" />
      </div>
      <div className="space-y-1">
        <label htmlFor="studyHours" className="text-sm font-medium text-slate-200">Study Hours per Day</label>
        <Input id="studyHours" type="number" step="0.1" value={data.studyHours} onChange={(e) => setData({ ...data, studyHours: Number(e.target.value) })} placeholder="0 to 16" />
      </div>
      <div className="space-y-1">
        <label htmlFor="sleepHours" className="text-sm font-medium text-slate-200">Sleep Hours per Day</label>
        <Input id="sleepHours" type="number" step="0.1" value={data.sleepHours} onChange={(e) => setData({ ...data, sleepHours: Number(e.target.value) })} placeholder="0 to 14" />
      </div>
      <div className="space-y-1">
        <label htmlFor="screenTime" className="text-sm font-medium text-slate-200">Screen Time per Day</label>
        <Input id="screenTime" type="number" step="0.1" value={data.screenTime} onChange={(e) => setData({ ...data, screenTime: Number(e.target.value) })} placeholder="0 to 18" />
      </div>
      <div className="space-y-1">
        <label htmlFor="assignmentsPerWeek" className="text-sm font-medium text-slate-200">Assignment Count per Week</label>
        <Input id="assignmentsPerWeek" type="number" value={data.assignmentsPerWeek} onChange={(e) => setData({ ...data, assignmentsPerWeek: Number(e.target.value) })} placeholder="0 to 20" />
      </div>
      <div className="space-y-1">
        <label htmlFor="examPressure" className="text-sm font-medium text-slate-200">Exam Pressure (1-10)</label>
        <Input id="examPressure" type="number" value={data.examPressure} onChange={(e) => setData({ ...data, examPressure: Number(e.target.value) })} placeholder="1 to 10" />
      </div>
      <div className="space-y-1">
        <label htmlFor="financialPressure" className="text-sm font-medium text-slate-200">Financial Pressure (1-10)</label>
        <Input id="financialPressure" type="number" value={data.financialPressure} onChange={(e) => setData({ ...data, financialPressure: Number(e.target.value) })} placeholder="1 to 10" />
      </div>
      <div className="space-y-1">
        <label htmlFor="socialSupport" className="text-sm font-medium text-slate-200">Social Support (1-10)</label>
        <Input id="socialSupport" type="number" value={data.socialSupport} onChange={(e) => setData({ ...data, socialSupport: Number(e.target.value) })} placeholder="1 to 10" />
      </div>
      <div className="space-y-1">
        <label htmlFor="physicalActivity" className="text-sm font-medium text-slate-200">Physical Activity Hours</label>
        <Input id="physicalActivity" type="number" step="0.1" value={data.physicalActivity} onChange={(e) => setData({ ...data, physicalActivity: Number(e.target.value) })} placeholder="0 to 20" />
      </div>
      <div className="space-y-1">
        <label htmlFor="backlogCount" className="text-sm font-medium text-slate-200">Number of Backlogs</label>
        <Input id="backlogCount" type="number" value={data.backlogCount} onChange={(e) => setData({ ...data, backlogCount: Number(e.target.value) })} placeholder="0 to 15" />
      </div>
      <div className="md:col-span-2">
        <Button className="w-full" disabled={loading}>{loading ? "Predicting..." : "Predict Stress Level"}</Button>
      </div>
      {response && (
        <p className={`md:col-span-2 text-sm ${response.type === "success" ? "text-emerald-300" : "text-rose-300"}`}>
          {response.message}
        </p>
      )}
    </form>
  );
}
