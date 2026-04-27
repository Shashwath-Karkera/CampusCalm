from __future__ import annotations

import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

TARGET = "stress_level"

FEATURE_COLUMNS = [
    "age",
    "gender",
    "year_of_study",
    "attendance",
    "study_hours",
    "sleep_hours",
    "screen_time",
    "assignments_per_week",
    "exam_pressure",
    "financial_pressure",
    "social_support",
    "physical_activity",
    "backlog_count",
]


def clean_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df = df.drop_duplicates()

    for col in ["attendance", "study_hours", "sleep_hours", "screen_time", "physical_activity"]:
        df[col] = pd.to_numeric(df[col], errors="coerce")

    for col in ["exam_pressure", "financial_pressure", "social_support", "backlog_count", "assignments_per_week", "age", "year_of_study"]:
        df[col] = pd.to_numeric(df[col], errors="coerce")

    # Cap obvious outliers for stability.
    df["attendance"] = df["attendance"].clip(0, 100)
    df["study_hours"] = df["study_hours"].clip(0, 16)
    df["sleep_hours"] = df["sleep_hours"].clip(0, 14)
    df["screen_time"] = df["screen_time"].clip(0, 18)
    df["physical_activity"] = df["physical_activity"].clip(0, 20)

    return df


def create_preprocessor() -> ColumnTransformer:
    categorical = ["gender"]
    numerical = [c for c in FEATURE_COLUMNS if c not in categorical]

    numeric_pipeline = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
        ]
    )

    categorical_pipeline = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("encoder", OneHotEncoder(handle_unknown="ignore")),
        ]
    )

    return ColumnTransformer(
        transformers=[
            ("num", numeric_pipeline, numerical),
            ("cat", categorical_pipeline, categorical),
        ]
    )
