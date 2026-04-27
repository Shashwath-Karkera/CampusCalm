from __future__ import annotations

from fastapi import FastAPI
from pydantic import BaseModel, Field

from predict import predict

app = FastAPI(title="CampusCalm ML API")


class PredictionInput(BaseModel):
    age: int = Field(ge=16, le=35)
    gender: str
    yearOfStudy: int = Field(ge=1, le=6)
    attendance: float = Field(ge=0, le=100)
    studyHours: float = Field(ge=0, le=16)
    sleepHours: float = Field(ge=0, le=14)
    screenTime: float = Field(ge=0, le=18)
    assignmentsPerWeek: int = Field(ge=0, le=20)
    examPressure: int = Field(ge=1, le=10)
    financialPressure: int = Field(ge=1, le=10)
    socialSupport: int = Field(ge=1, le=10)
    physicalActivity: float = Field(ge=0, le=20)
    backlogCount: int = Field(ge=0, le=15)


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/predict")
def predict_route(payload: PredictionInput) -> dict:
    normalized = {
        "age": payload.age,
        "gender": payload.gender,
        "year_of_study": payload.yearOfStudy,
        "attendance": payload.attendance,
        "study_hours": payload.studyHours,
        "sleep_hours": payload.sleepHours,
        "screen_time": payload.screenTime,
        "assignments_per_week": payload.assignmentsPerWeek,
        "exam_pressure": payload.examPressure,
        "financial_pressure": payload.financialPressure,
        "social_support": payload.socialSupport,
        "physical_activity": payload.physicalActivity,
        "backlog_count": payload.backlogCount,
    }
    return predict(normalized)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
