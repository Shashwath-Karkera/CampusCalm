import Link from "next/link";
import { ArrowRight, BarChart3, Brain, Database, LineChart, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { average, loadModelMetrics, loadStudentDataset, stressScore } from "@/lib/student-dataset";

const highlights = [
  {
    title: "Clean Dataset",
    text: "850 student records with academic, lifestyle, and wellbeing features.",
    icon: Database,
  },
  {
    title: "Accurate ML Models",
    text: "Random Forest and Decision Tree trained on the same CSV data.",
    icon: Brain,
  },
  {
    title: "Useful Analytics",
    text: "Charts show stress distribution, pressure, sleep, attendance, and support patterns.",
    icon: BarChart3,
  },
];

export default function HomePage() {
  const rows = loadStudentDataset();
  const metrics = loadModelMetrics();
  const bestModel = metrics[0];
  const highRisk = rows.filter((row) => row.stress_level === "High").length;
  const averageRisk = Math.round(average(rows.map(stressScore)));
  const accuracy = bestModel ? `${(bestModel.accuracy * 100).toFixed(1)}%` : "Ready";

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        <header className="mb-10 flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3 backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-cyan-300 text-slate-950">
              <Brain size={21} />
            </span>
            <span>
              <span className="block text-lg font-semibold text-white">CampusCalm</span>
              <span className="block text-xs text-slate-300">Student Stress Prediction</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="hidden text-sm text-slate-300 transition hover:text-white md:block">
              Dashboard
            </Link>
            <ThemeToggle />
          </div>
        </header>

        <section className="grid gap-10 py-6 md:grid-cols-[1.05fr_0.95fr] md:items-center md:py-10">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-200/30 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-100">
              <Sparkles size={14} /> AI Wellness Analytics
            </p>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white md:text-6xl">
              Predict student stress before it becomes burnout.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
              CampusCalm analyzes attendance, sleep, study load, screen time, pressure, support,
              activity, and backlog patterns to classify stress risk and explain the result clearly.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/dashboard/predict">
                <Button size="lg" className="gap-2">
                  Run Prediction <ArrowRight size={18} />
                </Button>
              </Link>
              <Link href="/dashboard/analytics">
                <Button size="lg" variant="secondary">View Analytics</Button>
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/15 bg-slate-950/65 p-4 shadow-2xl backdrop-blur-xl">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Live Model Preview</p>
                  <p className="text-2xl font-semibold text-white">{bestModel?.model ?? "Random Forest"}</p>
                </div>
                <div className="rounded-2xl bg-emerald-300/15 px-4 py-2 text-right">
                  <p className="text-xs text-emerald-100">Accuracy</p>
                  <p className="text-xl font-bold text-emerald-200">{accuracy}</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <PreviewStat label="Students" value={String(rows.length)} />
                <PreviewStat label="High Risk" value={String(highRisk)} tone="rose" />
                <PreviewStat label="Avg Risk" value={`${averageRisk}%`} tone="amber" />
              </div>

              <div className="mt-6 space-y-4">
                <Factor label="Sleep Balance" value={72} color="bg-cyan-300" />
                <Factor label="Exam Pressure" value={88} color="bg-rose-300" />
                <Factor label="Attendance Pattern" value={64} color="bg-emerald-300" />
                <Factor label="Social Support" value={58} color="bg-amber-300" />
              </div>

              <div className="mt-6 rounded-2xl border border-cyan-200/15 bg-cyan-300/10 p-4">
                <div className="flex items-start gap-3">
                  <LineChart className="mt-1 text-cyan-200" size={20} />
                  <div>
                    <p className="font-semibold text-white">Judge-ready ML flow</p>
                    <p className="mt-1 text-sm leading-6 text-slate-300">
                      Dataset overview, prediction form, analytics dashboard, and model performance all use the same project data.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="my-8 grid gap-4 md:grid-cols-4">
          <MetricCard label="Dataset Records" value={String(rows.length)} />
          <MetricCard label="Best Model" value={bestModel?.model ?? "Random Forest"} />
          <MetricCard label="Accuracy" value={accuracy} />
          <MetricCard label="Stress Classes" value="Low / Medium / High" />
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="rounded-2xl border-white/15 bg-slate-950/40 p-5 shadow-lg">
                <div className="mb-5 grid size-11 place-items-center rounded-xl bg-white/10">
                  <Icon className="text-cyan-200" size={23} />
                </div>
                <p className="mb-2 text-lg font-semibold text-white">{item.title}</p>
                <p className="text-sm leading-6 text-slate-300">{item.text}</p>
              </Card>
            );
          })}
        </section>

        <section className="mt-4 rounded-2xl border border-white/10 bg-slate-950/35 p-5 backdrop-blur-xl md:flex md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-1 text-emerald-200" />
            <div>
              <p className="text-lg font-semibold text-white">Built for project evaluation</p>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-300">
                The app presents the full pipeline clearly: dataset, preprocessing, trained models, prediction output, recommendations, and visual analysis.
              </p>
            </div>
          </div>
          <Link href="/dashboard/models" className="mt-4 inline-block md:mt-0">
            <Button variant="secondary">Model Performance</Button>
          </Link>
        </section>
      </div>
    </main>
  );
}

function PreviewStat({ label, value, tone = "cyan" }: { label: string; value: string; tone?: "cyan" | "rose" | "amber" }) {
  const toneClass = {
    cyan: "text-cyan-200",
    rose: "text-rose-200",
    amber: "text-amber-200",
  }[tone];

  return (
    <div className="rounded-2xl bg-white/10 p-4">
      <p className="text-xs uppercase tracking-wider text-slate-400">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${toneClass}`}>{value}</p>
    </div>
  );
}

function Factor({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <p className="text-slate-300">{label}</p>
        <p className="font-medium text-white">{value}%</p>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-5 backdrop-blur-xl">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}
