from __future__ import annotations

import joblib
import pandas as pd

MODEL_PATH = "python-backend/models/best_model.pkl"


def predict(payload: dict) -> dict:
    bundle = joblib.load(MODEL_PATH)
    model = bundle["model"]
    label_encoder = bundle["label_encoder"]

    df = pd.DataFrame([payload])
    prediction_idx = model.predict(df)[0]
    probabilities = model.predict_proba(df)[0]
    probability = float(max(probabilities))

    level = label_encoder.inverse_transform([prediction_idx])[0]

    recommendations = []
    if payload.get("sleep_hours", 7) < 7:
        recommendations.append("Increase sleep toward 7-8 hours to reduce stress risk.")
    if payload.get("exam_pressure", 5) >= 7:
        recommendations.append("Use a revision plan with short daily targets before exams.")
    if payload.get("screen_time", 5) > 7:
        recommendations.append("Reduce non-academic screen time, especially before sleep.")
    if payload.get("social_support", 6) <= 4:
        recommendations.append("Talk with a mentor, friend, or campus counselor this week.")
    if not recommendations:
        recommendations.append("Maintain the current balance of sleep, study, activity, and support.")

    return {
        "predictedStress": str(level).upper(),
        "probabilityScore": probability,
        "modelName": bundle.get("best_model_name", "Random Forest"),
        "scoreBreakdown": [
            {"label": "Sleep", "value": max(min(payload.get("sleep_hours", payload.get("sleepHours", 7)) / 10, 1), 0)},
            {"label": "Exam Pressure", "value": max(min(payload.get("exam_pressure", payload.get("examPressure", 5)) / 10, 1), 0)},
            {"label": "Social Support", "value": max(min(payload.get("social_support", payload.get("socialSupport", 5)) / 10, 1), 0)},
        ],
        "recommendations": recommendations,
    }
