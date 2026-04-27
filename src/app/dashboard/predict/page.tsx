import { Card } from "@/components/ui/card";
import { PredictionForm } from "@/components/forms/prediction-form";

function getRecommendations(level: string) {
  if (level === "HIGH") {
    return [
      "Improve sleep schedule to at least 7 hours.",
      "Reduce non-academic screen time by 20%.",
      "Break study into focused blocks with short breaks.",
      "Talk to a mentor or campus counselor this week.",
    ];
  }
  if (level === "MEDIUM") {
    return [
      "Track daily stress triggers.",
      "Balance study and recreation blocks.",
      "Increase physical activity sessions.",
    ];
  }
  return ["Maintain your current routine.", "Continue regular exercise and social support."];
}

export default async function PredictPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: string; score?: string }>;
}) {
  const params = await searchParams;
  const level = params.level;
  const score = params.score ? `${Math.round(Number(params.score) * 100)}%` : null;

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">Stress Prediction</h1>
      <Card>
        <PredictionForm />
      </Card>
      {level && (
        <Card>
          <p className="text-lg font-semibold">Prediction Result</p>
          <p className="mt-2 text-2xl">Risk Level: <span className="font-bold text-cyan-300">{level}</span></p>
          {score && <p className="text-slate-300">Model Confidence: {score}</p>}
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-200">
            {getRecommendations(level).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
