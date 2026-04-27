# Deployment Guide

## 1) NeonDB

1. Create a Neon project and database.
2. Copy connection string.
3. Set DATABASE_URL in Vercel and Python hosting platform.

## 2) Next.js App (Vercel)

- Framework preset: Next.js
- Root directory: repository root
- Build command: npm run build
- Install command: npm install
- Environment variables:
  - DATABASE_URL
  - JWT_SECRET
  - PYTHON_ML_URL
  - NEXT_PUBLIC_APP_URL

## 3) Python ML Backend (Railway or Render)

- Root directory: python-backend
- Install: pip install -r requirements.txt
- Build step: python train.py
- Start command: uvicorn main:app --host 0.0.0.0 --port $PORT

## 4) Domain Wiring

- Set PYTHON_ML_URL in Vercel to deployed FastAPI URL.
- Ensure CORS is configured if frontend calls FastAPI directly.

## 5) Production Checklist

- Use strong JWT_SECRET (32+ chars).
- Enable TLS everywhere.
- Rotate DB credentials regularly.
- Restrict admin creation policy.
- Add external Redis rate limiter for scale.
- Add logging and monitoring.
