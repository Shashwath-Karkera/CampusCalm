import { Card } from "@/components/ui/card";

const toolkit = [
  {
    name: "Pandas",
    use: "Data loading, cleaning, missing-value handling, duplicates, and consistency checks.",
  },
  {
    name: "NumPy",
    use: "Numerical transformations and synthetic feature computation.",
  },
  {
    name: "Scikit-learn",
    use: "Pipelines, preprocessing, model training, cross-validation, metrics, clustering, ANN.",
  },
  {
    name: "Matplotlib",
    use: "Static plots for reports and model diagnostics.",
  },
  {
    name: "Seaborn",
    use: "EDA visuals including heatmaps and distribution plots.",
  },
];

export default function ToolkitDocsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-4 p-4 md:p-8">
      <h1 className="text-3xl font-semibold">ML Toolkit Documentation</h1>
      {toolkit.map((item) => (
        <Card key={item.name}>
          <p className="text-xl font-semibold">{item.name}</p>
          <p className="mt-2 text-sm text-slate-300">{item.use}</p>
        </Card>
      ))}
    </div>
  );
}
