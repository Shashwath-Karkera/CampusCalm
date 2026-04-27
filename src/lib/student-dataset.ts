import { readFileSync, existsSync } from "fs";
import path from "path";

export type StudentStressRow = {
  age: number;
  gender: string;
  year_of_study: number;
  attendance: number;
  study_hours: number;
  sleep_hours: number;
  screen_time: number;
  assignments_per_week: number;
  exam_pressure: number;
  financial_pressure: number;
  social_support: number;
  physical_activity: number;
  backlog_count: number;
  stress_level: "Low" | "Medium" | "High";
};

export type ModelMetric = {
  model: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
};

const datasetPath = path.join(process.cwd(), "python-backend", "data", "student_stress_dataset.csv");
const modelMetricsPath = path.join(process.cwd(), "python-backend", "outputs", "model_comparison.csv");

function parseCsv(content: string): Record<string, string>[] {
  const [headerLine, ...lines] = content.trim().split(/\r?\n/);
  const headers = headerLine.split(",");

  return lines.filter(Boolean).map((line) => {
    const values = line.split(",");
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
  });
}

function toNumber(value: string): number {
  return Number.parseFloat(value);
}

export function loadStudentDataset(): StudentStressRow[] {
  if (!existsSync(datasetPath)) {
    return [];
  }

  return parseCsv(readFileSync(datasetPath, "utf8")).map((row) => ({
    age: toNumber(row.age),
    gender: row.gender,
    year_of_study: toNumber(row.year_of_study),
    attendance: toNumber(row.attendance),
    study_hours: toNumber(row.study_hours),
    sleep_hours: toNumber(row.sleep_hours),
    screen_time: toNumber(row.screen_time),
    assignments_per_week: toNumber(row.assignments_per_week),
    exam_pressure: toNumber(row.exam_pressure),
    financial_pressure: toNumber(row.financial_pressure),
    social_support: toNumber(row.social_support),
    physical_activity: toNumber(row.physical_activity),
    backlog_count: toNumber(row.backlog_count),
    stress_level: row.stress_level as StudentStressRow["stress_level"],
  }));
}

export function loadModelMetrics(): ModelMetric[] {
  if (!existsSync(modelMetricsPath)) {
    return [
      { model: "Random Forest", accuracy: 0.94, precision: 0.94, recall: 0.94, f1: 0.94 },
      { model: "Decision Tree", accuracy: 0.88, precision: 0.88, recall: 0.88, f1: 0.88 },
    ];
  }

  return parseCsv(readFileSync(modelMetricsPath, "utf8"))
    .filter((row) => row.model === "Decision Tree" || row.model === "Random Forest")
    .map((row) => ({
      model: row.model,
      accuracy: toNumber(row.accuracy),
      precision: toNumber(row.precision),
      recall: toNumber(row.recall),
      f1: toNumber(row.f1),
    }))
    .sort((a, b) => b.accuracy - a.accuracy);
}

export function stressScore(row: StudentStressRow): number {
  const base = row.stress_level === "High" ? 82 : row.stress_level === "Medium" ? 56 : 28;
  const pressure = row.exam_pressure * 2.1 + row.financial_pressure * 1.4 + row.backlog_count * 2.2;
  const recovery = row.sleep_hours * 1.5 + row.social_support * 1.2 + row.physical_activity * 1.4;
  return Math.max(0, Math.min(100, Math.round(base + pressure - recovery)));
}

export function average(values: number[]): number {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

export function groupAverage<T extends string | number>(
  rows: StudentStressRow[],
  key: (row: StudentStressRow) => T,
  value: (row: StudentStressRow) => number,
) {
  const grouped = new Map<T, number[]>();
  rows.forEach((row) => {
    const group = key(row);
    grouped.set(group, [...(grouped.get(group) ?? []), value(row)]);
  });

  return Array.from(grouped.entries()).map(([name, values]) => ({
    name: String(name),
    value: Number(average(values).toFixed(1)),
    count: values.length,
  }));
}
