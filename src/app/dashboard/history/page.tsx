import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { ExportReportButton } from "@/components/dashboard/export-report-button";

export default async function HistoryPage() {
  const predictions = await prisma.stressPrediction.findMany({
    take: 20,
    orderBy: { createdAt: "desc" },
    include: { student: { include: { user: true } } },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Prediction History</h1>
        <ExportReportButton />
      </div>
      <Card className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/20 text-slate-300">
              <th className="p-2">Student</th>
              <th className="p-2">Stress</th>
              <th className="p-2">Score</th>
              <th className="p-2">Study</th>
              <th className="p-2">Sleep</th>
              <th className="p-2">Created</th>
            </tr>
          </thead>
          <tbody>
            {predictions.map((item) => (
              <tr key={item.id} className="border-b border-white/10">
                <td className="p-2">{item.student.user.name}</td>
                <td className="p-2">{item.predictedStress}</td>
                <td className="p-2">{Math.round(item.probabilityScore * 100)}%</td>
                <td className="p-2">{item.studyHours}</td>
                <td className="p-2">{item.sleepHours}</td>
                <td className="p-2">{item.createdAt.toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
