import { AnalyticsCharts } from "@/components/charts/analytics-charts";
import { average, groupAverage, loadStudentDataset, stressScore, type StudentStressRow } from "@/lib/student-dataset";

function attendanceBand(row: StudentStressRow) {
  if (row.attendance < 60) return "<60%";
  if (row.attendance < 75) return "60-74%";
  if (row.attendance < 90) return "75-89%";
  return "90%+";
}

function correlation(rows: StudentStressRow[], value: (row: StudentStressRow) => number) {
  const xs = rows.map(value);
  const ys = rows.map(stressScore);
  const meanX = average(xs);
  const meanY = average(ys);
  const numerator = xs.reduce((sum, x, index) => sum + (x - meanX) * (ys[index] - meanY), 0);
  const denomX = Math.sqrt(xs.reduce((sum, x) => sum + (x - meanX) ** 2, 0));
  const denomY = Math.sqrt(ys.reduce((sum, y) => sum + (y - meanY) ** 2, 0));
  return denomX && denomY ? Math.abs(numerator / (denomX * denomY)) : 0;
}

export default function AnalyticsPage() {
  const rows = loadStudentDataset();
  const orderedLevels = ["Low", "Medium", "High"];
  const sortLevels = <T extends { name: string }>(items: T[]) => items.sort((a, b) => orderedLevels.indexOf(a.name) - orderedLevels.indexOf(b.name));
  const pressurePoints = rows.slice(0, 180).map((row) => ({
    exam: row.exam_pressure,
    finance: row.financial_pressure,
    stress: stressScore(row),
    level: row.stress_level,
  }));
  const featureImpact = [
    { name: "Exam", value: correlation(rows, (row) => row.exam_pressure) },
    { name: "Finance", value: correlation(rows, (row) => row.financial_pressure) },
    { name: "Sleep", value: correlation(rows, (row) => row.sleep_hours) },
    { name: "Screen", value: correlation(rows, (row) => row.screen_time) },
    { name: "Support", value: correlation(rows, (row) => row.social_support) },
    { name: "Backlogs", value: correlation(rows, (row) => row.backlog_count) },
  ].map((item) => ({ ...item, value: Number((item.value * 100).toFixed(1)) }));

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-semibold">Analytics Dashboard</h1>
        <p className="mt-1 text-sm text-slate-300">EDA charts are generated from the CSV dataset fields used by the prediction model.</p>
      </div>
      <AnalyticsCharts
        sleepByStress={sortLevels(groupAverage(rows, (row) => row.stress_level, (row) => row.sleep_hours))}
        studyByStress={sortLevels(groupAverage(rows, (row) => row.stress_level, (row) => row.study_hours))}
        attendanceBands={groupAverage(rows, attendanceBand, stressScore).sort((a, b) => ["<60%", "60-74%", "75-89%", "90%+"].indexOf(a.name) - ["<60%", "60-74%", "75-89%", "90%+"].indexOf(b.name))}
        screenByStress={sortLevels(groupAverage(rows, (row) => row.stress_level, (row) => row.screen_time))}
        pressurePoints={pressurePoints}
        featureImpact={featureImpact}
      />
    </div>
  );
}
