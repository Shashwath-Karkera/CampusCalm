import { Card } from "@/components/ui/card";
import { loadModelMetrics } from "@/lib/student-dataset";

function percent(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

export default function ModelsPage() {
  const rows = loadModelMetrics();
  const best = rows[0];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-semibold">Model Performance</h1>
        <p className="mt-1 text-sm text-slate-300">Only the implemented models are shown: Decision Tree and Random Forest.</p>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/20 text-slate-300">
              <th className="p-2">Model</th>
              <th className="p-2">Accuracy</th>
              <th className="p-2">Precision</th>
              <th className="p-2">Recall</th>
              <th className="p-2">F1</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.model} className="border-b border-white/10">
                <td className="p-2 font-medium">{row.model}</td>
                <td className="p-2">{percent(row.accuracy)}</td>
                <td className="p-2">{percent(row.precision)}</td>
                <td className="p-2">{percent(row.recall)}</td>
                <td className="p-2">{percent(row.f1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <p className="text-lg font-semibold">Best Model</p>
          <p className="mt-2 text-sm text-slate-300">
            {best?.model ?? "Random Forest"} is used for live predictions because it handles non-linear relationships across sleep,
            pressure, attendance, activity, and support more reliably than a single tree.
          </p>
        </Card>
        <Card>
          <p className="text-lg font-semibold">Why Decision Tree Is Included</p>
          <p className="mt-2 text-sm text-slate-300">
            Decision Tree remains useful for explanation and comparison. It gives a simple baseline, while Random Forest improves stability by averaging many trees.
          </p>
        </Card>
      </div>
    </div>
  );
}
