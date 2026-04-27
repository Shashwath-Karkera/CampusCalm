export type StressLevel = "LOW" | "MEDIUM" | "HIGH";

export interface PredictionPayload {
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
}

export interface ModelPredictionResponse {
  predictedStress: StressLevel;
  probabilityScore: number;
  scoreBreakdown: { label: string; value: number }[];
  recommendations: string[];
}
