"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Radar,
  RadarChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type NamedValue = { name: string; value: number; count?: number };
type PressurePoint = { exam: number; finance: number; stress: number; level: string };
type AnalyticsChartsProps = {
  sleepByStress: NamedValue[];
  studyByStress: NamedValue[];
  attendanceBands: NamedValue[];
  screenByStress: NamedValue[];
  pressurePoints: PressurePoint[];
  featureImpact: NamedValue[];
};

const stressColors: Record<string, string> = {
  Low: "#22d3ee",
  Medium: "#f59e0b",
  High: "#f43f5e",
};

export function AnalyticsCharts({
  sleepByStress,
  studyByStress,
  attendanceBands,
  screenByStress,
  pressurePoints,
  featureImpact,
}: AnalyticsChartsProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <ChartFrame title="Average Sleep by Stress Level" mounted={mounted}>
        <BarChart data={sleepByStress}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.12)" />
          <XAxis dataKey="name" stroke="#cbd5e1" />
          <YAxis stroke="#cbd5e1" />
          <Tooltip />
          <Bar dataKey="value" name="Sleep hours">
            {sleepByStress.map((entry) => <Cell key={entry.name} fill={stressColors[entry.name] ?? "#38bdf8"} />)}
          </Bar>
        </BarChart>
      </ChartFrame>

      <ChartFrame title="Study Load by Stress Level" mounted={mounted}>
        <BarChart data={studyByStress}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.12)" />
          <XAxis dataKey="name" stroke="#cbd5e1" />
          <YAxis stroke="#cbd5e1" />
          <Tooltip />
          <Bar dataKey="value" name="Study hours" fill="#60a5fa" />
        </BarChart>
      </ChartFrame>

      <ChartFrame title="Attendance Band vs Risk Score" mounted={mounted}>
        <LineChart data={attendanceBands}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.12)" />
          <XAxis dataKey="name" stroke="#cbd5e1" />
          <YAxis stroke="#cbd5e1" />
          <Tooltip />
          <Line type="monotone" dataKey="value" name="Risk score" stroke="#34d399" strokeWidth={2.5} />
        </LineChart>
      </ChartFrame>

      <ChartFrame title="Screen Time by Stress Level" mounted={mounted}>
        <BarChart data={screenByStress}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.12)" />
          <XAxis dataKey="name" stroke="#cbd5e1" />
          <YAxis stroke="#cbd5e1" />
          <Tooltip />
          <Bar dataKey="value" name="Screen hours" fill="#a78bfa" />
        </BarChart>
      </ChartFrame>

      <ChartFrame title="Exam Pressure vs Financial Pressure" mounted={mounted}>
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.12)" />
          <XAxis dataKey="exam" name="Exam" stroke="#cbd5e1" />
          <YAxis dataKey="finance" name="Finance" stroke="#cbd5e1" />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Scatter data={pressurePoints} name="Students">
            {pressurePoints.map((entry, index) => (
              <Cell key={`${entry.exam}-${entry.finance}-${index}`} fill={stressColors[entry.level] ?? "#38bdf8"} />
            ))}
          </Scatter>
        </ScatterChart>
      </ChartFrame>

      <ChartFrame title="Top Stress Drivers" mounted={mounted}>
        <RadarChart data={featureImpact}>
          <PolarGrid stroke="rgba(255,255,255,0.2)" />
          <PolarAngleAxis dataKey="name" stroke="#cbd5e1" />
          <PolarRadiusAxis stroke="#cbd5e1" />
          <Radar dataKey="value" name="Impact" fill="#22d3ee" fillOpacity={0.35} stroke="#22d3ee" />
          <Legend />
          <Tooltip />
        </RadarChart>
      </ChartFrame>
    </div>
  );
}

function ChartFrame({ title, mounted, children }: { title: string; mounted: boolean; children: React.ReactElement }) {
  return (
    <div className="rounded-3xl border border-white/20 bg-white/10 p-5 shadow-xl backdrop-blur-xl">
      <p className="mb-3 text-lg font-semibold">{title}</p>
      <div className="h-72">
        {mounted && (
          <ResponsiveContainer width="100%" height="100%">
            {children}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
