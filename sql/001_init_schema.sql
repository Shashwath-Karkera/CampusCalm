CREATE TYPE user_role AS ENUM ('STUDENT', 'ADMIN');
CREATE TYPE stress_level AS ENUM ('LOW', 'MEDIUM', 'HIGH');

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'STUDENT',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE students (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  age INT NOT NULL,
  gender TEXT NOT NULL,
  year_of_study INT NOT NULL,
  department TEXT NOT NULL
);

CREATE TABLE stress_predictions (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  study_hours DOUBLE PRECISION NOT NULL,
  sleep_hours DOUBLE PRECISION NOT NULL,
  screen_time DOUBLE PRECISION NOT NULL,
  attendance DOUBLE PRECISION NOT NULL,
  assignments_per_week INT NOT NULL,
  exam_pressure INT NOT NULL,
  financial_pressure INT NOT NULL,
  social_support INT NOT NULL,
  physical_activity DOUBLE PRECISION NOT NULL,
  backlog_count INT NOT NULL,
  predicted_stress stress_level NOT NULL,
  probability_score DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE datasets (
  id TEXT PRIMARY KEY,
  file_name TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE feedback (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  rating INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_predictions_student_created ON stress_predictions(student_id, created_at DESC);
CREATE INDEX idx_predictions_level ON stress_predictions(predicted_stress);
