import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  password: z.string().min(8),
  age: z.coerce.number().int().min(16).max(35),
  gender: z.enum(["Male", "Female", "Other"]),
  yearOfStudy: z.coerce.number().int().min(1).max(6),
  department: z.string().trim().min(2),
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8),
});

export const predictionSchema = z.object({
  age: z.coerce.number().int().min(16).max(35),
  gender: z.enum(["Male", "Female", "Other"]),
  yearOfStudy: z.coerce.number().int().min(1).max(6),
  attendance: z.coerce.number().min(0).max(100),
  studyHours: z.coerce.number().min(0).max(16),
  sleepHours: z.coerce.number().min(0).max(14),
  screenTime: z.coerce.number().min(0).max(18),
  assignmentsPerWeek: z.coerce.number().int().min(0).max(20),
  examPressure: z.coerce.number().int().min(1).max(10),
  financialPressure: z.coerce.number().int().min(1).max(10),
  socialSupport: z.coerce.number().int().min(1).max(10),
  physicalActivity: z.coerce.number().min(0).max(20),
  backlogCount: z.coerce.number().int().min(0).max(15),
});
