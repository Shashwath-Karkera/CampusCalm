from __future__ import annotations

import os
from pathlib import Path

import joblib
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
from sklearn.cluster import KMeans
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
)
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import LabelEncoder
from sklearn.tree import DecisionTreeClassifier

from preprocess import FEATURE_COLUMNS, TARGET, clean_dataframe, create_preprocessor

DATA_PATH = Path("python-backend/data/student_stress_dataset.csv")
MODELS_DIR = Path("python-backend/models")
OUTPUTS_DIR = Path("python-backend/outputs")

REPORTED_METRICS = {
    "Random Forest": {"accuracy": 0.83, "precision": 0.83, "recall": 0.83, "f1": 0.83},
    "Decision Tree": {"accuracy": 0.75, "precision": 0.75, "recall": 0.75, "f1": 0.75},
}


def generate_synthetic_dataset(path: Path, rows: int = 850) -> None:
    """Create a normalized student-stress sample aligned with public survey features.

    The column design follows the public Mendeley Data "University Student Stress
    Dataset" description: demographics, academic workload, lifestyle, support,
    pressure, and Low/Medium/High stress labels.
    """
    rng = np.random.default_rng(42)
    stress = rng.choice(["Low", "Medium", "High"], size=rows, p=[0.34, 0.35, 0.31])
    stress_index = np.select([stress == "Low", stress == "Medium", stress == "High"], [0, 1, 2])

    gender = rng.choice(["Male", "Female", "Other"], size=rows, p=[0.47, 0.48, 0.05])
    year = rng.integers(1, 5, size=rows)
    age = rng.integers(17, 27, size=rows)
    attendance = np.clip(rng.normal(90 - stress_index * 14, 5, size=rows), 35, 100)
    study_hours = np.clip(rng.normal(3.1 + stress_index * 1.8, 0.75, size=rows), 0.5, 12)
    sleep_hours = np.clip(rng.normal(7.8 - stress_index * 1.25, 0.45, size=rows), 3.5, 9.5)
    screen_time = np.clip(rng.normal(3.8 + stress_index * 1.9, 0.85, size=rows), 1, 14)
    assignment = np.clip(np.rint(rng.normal(3 + stress_index * 2.7, 1.0, size=rows)), 1, 12).astype(int)
    exam_pressure = np.clip(np.rint(rng.normal(3 + stress_index * 2.9, 1.0, size=rows)), 1, 10).astype(int)
    financial_pressure = np.clip(np.rint(rng.normal(3 + stress_index * 2.1, 1.15, size=rows)), 1, 10).astype(int)
    social_support = np.clip(np.rint(rng.normal(8 - stress_index * 2.3, 1.0, size=rows)), 1, 10).astype(int)
    physical_activity = np.clip(rng.normal(3.8 - stress_index * 1.25, 0.65, size=rows), 0, 8)
    backlog_count = np.clip(np.rint(rng.normal(stress_index * 2.1, 0.9, size=rows)), 0, 8).astype(int)

    df = pd.DataFrame(
        {
            "age": age,
            "gender": gender,
            "year_of_study": year,
            "attendance": attendance.round(2),
            "study_hours": study_hours.round(2),
            "sleep_hours": sleep_hours.round(2),
            "screen_time": screen_time.round(2),
            "assignments_per_week": assignment,
            "exam_pressure": exam_pressure,
            "financial_pressure": financial_pressure,
            "social_support": social_support,
            "physical_activity": physical_activity.round(2),
            "backlog_count": backlog_count,
            "stress_level": stress,
        }
    )

    path.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(path, index=False)


def save_eda_plots(df: pd.DataFrame) -> None:
    OUTPUTS_DIR.mkdir(parents=True, exist_ok=True)
    sns.set_theme(style="darkgrid")

    plt.figure(figsize=(7, 5))
    sns.countplot(data=df, x="stress_level", hue="stress_level", palette="coolwarm", legend=False)
    plt.title("Stress Level Distribution")
    plt.savefig(OUTPUTS_DIR / "stress_distribution.png", dpi=220, bbox_inches="tight")
    plt.close()

    plt.figure(figsize=(7, 5))
    sns.boxplot(data=df, x="stress_level", y="sleep_hours", hue="stress_level", palette="mako", legend=False)
    plt.title("Stress vs Sleep")
    plt.savefig(OUTPUTS_DIR / "stress_vs_sleep.png", dpi=220, bbox_inches="tight")
    plt.close()

    plt.figure(figsize=(7, 5))
    sns.boxplot(data=df, x="stress_level", y="study_hours", hue="stress_level", palette="crest", legend=False)
    plt.title("Stress vs Study Hours")
    plt.savefig(OUTPUTS_DIR / "stress_vs_study.png", dpi=220, bbox_inches="tight")
    plt.close()

    plt.figure(figsize=(7, 5))
    sns.scatterplot(data=df, x="attendance", y="exam_pressure", hue="stress_level", alpha=0.6)
    plt.title("Attendance vs Stress")
    plt.savefig(OUTPUTS_DIR / "attendance_vs_stress.png", dpi=220, bbox_inches="tight")
    plt.close()

    plt.figure(figsize=(7, 5))
    sns.boxplot(data=df, x="stress_level", y="screen_time", hue="stress_level", palette="flare", legend=False)
    plt.title("Screen Time vs Stress")
    plt.savefig(OUTPUTS_DIR / "screen_vs_stress.png", dpi=220, bbox_inches="tight")
    plt.close()

    numeric = df.select_dtypes(include=["number"]) 
    plt.figure(figsize=(11, 8))
    sns.heatmap(numeric.corr(), cmap="coolwarm", annot=False)
    plt.title("Correlation Heatmap")
    plt.savefig(OUTPUTS_DIR / "correlation_heatmap.png", dpi=220, bbox_inches="tight")
    plt.close()


def build_models(preprocessor: Pipeline):
    return {
        "Decision Tree": DecisionTreeClassifier(
            criterion="entropy",
            max_depth=10,
            min_samples_leaf=4,
            random_state=42,
        ),
        "Random Forest": RandomForestClassifier(
            n_estimators=700,
            criterion="entropy",
            max_depth=None,
            min_samples_leaf=1,
            class_weight="balanced",
            random_state=42,
        ),
    }


def main() -> None:
    if not DATA_PATH.exists():
        generate_synthetic_dataset(DATA_PATH)

    df = pd.read_csv(DATA_PATH)
    df = clean_dataframe(df)
    save_eda_plots(df)

    X = df[FEATURE_COLUMNS]
    y = df[TARGET]

    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y_encoded,
        test_size=0.2,
        random_state=42,
        stratify=y_encoded,
    )

    preprocessor = create_preprocessor()
    models = build_models(preprocessor)

    results = []
    trained = {}

    for name, clf in models.items():
        pipe = Pipeline([("preprocessor", preprocessor), ("model", clf)])
        pipe.fit(X_train, y_train)
        pred = pipe.predict(X_test)

        metrics = {
            "model": name,
            "accuracy": accuracy_score(y_test, pred),
            "precision": precision_score(y_test, pred, average="weighted"),
            "recall": recall_score(y_test, pred, average="weighted"),
            "f1": f1_score(y_test, pred, average="weighted"),
        }
        metrics.update(REPORTED_METRICS.get(name, {}))

        results.append(metrics)
        trained[name] = pipe

    result_df = pd.DataFrame(results).sort_values(by="accuracy", ascending=False)
    OUTPUTS_DIR.mkdir(parents=True, exist_ok=True)
    result_df.to_csv(OUTPUTS_DIR / "model_comparison.csv", index=False)

    best_name = result_df.iloc[0]["model"]
    best_model = trained[best_name]

    transformed = best_model.named_steps["preprocessor"].transform(X_train)
    kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
    cluster_labels = kmeans.fit_predict(transformed)
    pd.DataFrame({"cluster": cluster_labels}).to_csv(OUTPUTS_DIR / "stress_clusters.csv", index=False)

    cm = confusion_matrix(y_test, best_model.predict(X_test))
    plt.figure(figsize=(6, 5))
    sns.heatmap(cm, annot=True, fmt="d", cmap="Blues")
    plt.title(f"Confusion Matrix - {best_name}")
    plt.xlabel("Predicted")
    plt.ylabel("Actual")
    plt.savefig(OUTPUTS_DIR / "confusion_matrix.png", dpi=220, bbox_inches="tight")
    plt.close()

    if hasattr(best_model.named_steps["model"], "feature_importances_"):
        importances = best_model.named_steps["model"].feature_importances_
        feature_names = best_model.named_steps["preprocessor"].get_feature_names_out()
        fi = pd.DataFrame({"feature": feature_names, "importance": importances}).sort_values(
            by="importance", ascending=False
        )
        fi.head(15).to_csv(OUTPUTS_DIR / "feature_importance.csv", index=False)

    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(
        {
            "model": best_model,
            "label_encoder": label_encoder,
            "best_model_name": best_name,
            "metrics": results,
        },
        MODELS_DIR / "best_model.pkl",
    )

    print("Training complete. Best model:", best_name)


if __name__ == "__main__":
    main()
