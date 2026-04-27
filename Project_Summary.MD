# CampusCalm Project Summary

## 1. Problem Statement
Develop a machine learning model to predict the stress level of students using academic, personal, and lifestyle factors.

The model predicts one of three classes:
- Low Stress
- Medium Stress
- High Stress

This helps colleges identify students under stress at an early stage and provide timely interventions such as mentoring, counseling, or academic support.

## 2. Why This Project is Good
- Unique topic: Student mental wellness is highly relevant and socially meaningful.
- Real-world useful: Colleges can use predictions to design support programs.
- Easy to explain: Input features are understandable and relatable.
- Good visuals possible: Stress distributions and feature-impact graphs are intuitive.
- Faculty-friendly: It is a student-focused project with practical outcomes.

## 3. Dataset Features (Input Variables)
The dataset can be taken from Kaggle or collected using Google Forms.

### Example input features
- Age
- Gender
- Year of Study
- Attendance Percentage
- Study Hours per Day
- Sleep Hours
- Screen Time
- Assignment Count per Week
- Exam Pressure (1-10)
- Financial Pressure (1-10)
- Social Support (1-10)
- Physical Activity Hours
- Internet Usage Hours
- Backlogs (Yes/No)

### Target variable
- Stress Level
- Low
- Medium
- High

## 4. ML Type
This is a Classification problem because the model output is a category label (Low, Medium, High) rather than a continuous numeric value.

## 5. Algorithms to Use
Minimum two algorithms are included:

### Model 1: Decision Tree
- Provides clear split logic and feature importance.
- Fast baseline model.

### Model 2: Random Forest
- Better generalization and accuracy than a single tree.
- More robust to noise and overfitting.
- Strong choice for structured student data.

## 6. Steps for Assignment
### Data preprocessing
- Handle missing values.
- Encode categorical columns.
- Normalize or scale numerical columns when needed.
- Split dataset into training and test sets.

### Exploratory Data Analysis (EDA)
Generate visualizations such as:
- Stress vs Sleep Hours
- Stress vs Study Hours
- Stress vs Attendance
- Stress level countplot

### Training
- Train Decision Tree classifier.
- Train Random Forest classifier.
- Compare both models.

### Evaluation metrics
Use:
- Accuracy
- Precision
- Recall
- F1 Score
- Confusion Matrix

## 7. Expected Insights
Potential findings:
- Lower sleep duration tends to increase stress.
- Low attendance is often associated with higher stress.
- Higher screen time can correlate with increased stress.
- Higher physical activity can correlate with lower stress.

## 8. Advanced Concept (For Assignment Requirement)
To satisfy advanced requirement, use one of the following:

### Option A: Clustering (KMeans)
Group students into behavior-based clusters such as:
- Academically stressed
- Lifestyle stressed
- Balanced students

## 9. Tools
- Python
- Pandas
- Matplotlib
- Seaborn
- Scikit-learn

## 10. Final Output
A complete student stress prediction system that can classify stress levels and support early intervention.

In this CampusCalm implementation, the final output includes:
- User registration and login.
- Form-based stress data collection.
- Real-time stress prediction result.
- Prediction history tracking.
- Dashboard views and model-oriented analytics.
- Backend-ready structure for deployment and extension.

## Current Project Implementation Snapshot
### Frontend stack
- Next.js (App Router) with TypeScript.
- Tailwind CSS + custom UI components.
- Framer Motion animations.

### Backend stack
- Next.js API routes for auth, prediction, analytics, history, and utility services.
- Python FastAPI module for ML training/inference workflows.

### Database and auth
- Neon PostgreSQL with Prisma ORM.
- JWT session cookie-based authentication.
- Protected dashboard routes through middleware.

### UX improvements included
- CampusCalm entry loader screen.
- Field labels added to registration and prediction forms.
- Success or error response messages displayed during login and registration.
- Submission feedback for prediction actions.

## Conclusion
CampusCalm is a practical, presentation-ready mini project that combines machine learning, full-stack development, and student wellness analytics. It is suitable for academic submission and can be extended into an institutional support platform.
