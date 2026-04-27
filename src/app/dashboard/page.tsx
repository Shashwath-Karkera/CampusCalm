import { Card } from "@/components/ui/card";
import { StressDistributionChart } from "@/components/charts/stress-distribution";
import { TrendChart } from "@/components/charts/trend-chart";
import { average, groupAverage, loadModelMetrics, loadStudentDataset, stressScore } from "@/lib/student-dataset";

export default function DashboardPage() {
  const rows = loadStudentDataset();
  const metrics = loadModelMetrics();
  const counts = ["Low", "Medium", "High"].map((level) => ({
    name: level,
    value: rows.filter((row) => row.stress_level === level).length,
  }));
  const byYear = groupAverage(rows, (row) => `Year ${row.year_of_study}`, stressScore).sort((a, b) => a.name.localeCompare(b.name));
  const highRisk = rows.filter((row) => row.stress_level === "High").length;
  const averageRisk = Math.round(average(rows.map(stressScore)));

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-semibold">Dataset Overview</h1>
        <p className="mt-1 text-sm text-slate-300">All values on this page are computed from the project CSV dataset.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><p className="text-sm text-slate-300">Dataset Students</p><p className="text-2xl font-semibold">{rows.length}</p></Card>
        <Card><p className="text-sm text-slate-300">Average Risk</p><p className="text-2xl font-semibold">{averageRisk}%</p></Card>
        <Card><p className="text-sm text-slate-300">High Risk Students</p><p className="text-2xl font-semibold">{highRisk}</p></Card>
        <Card><p className="text-sm text-slate-300">Best Model Accuracy</p><p className="text-2xl font-semibold">{metrics[0] ? `${(metrics[0].accuracy * 100).toFixed(1)}%` : "Pending"}</p></Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <p className="mb-3 text-lg font-semibold">Stress Level Distribution</p>
          <StressDistributionChart data={counts} />
        </Card>
        <Card>
          <p className="mb-3 text-lg font-semibold">Average Stress Score by Study Year</p>
          <TrendChart data={byYear.map((item) => ({ date: item.name, score: item.value }))} />
        </Card>
      </div>
    </div>
  );
}
