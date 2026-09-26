# ==========================================
# FRONTEND - React + Vite
# ==========================================

FROM node:22-alpine AS frontend-builder

WORKDIR /frontend

COPY frontend/package*.json ./

RUN npm ci

COPY frontend/ ./

# En producción frontend y API viven
# bajo el mismo dominio.
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build


# ==========================================
# BACKEND - FastAPI
# ==========================================

FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1


# Dependencias Python

COPY backend/requirements.txt ./requirements.txt

RUN pip install \
    --no-cache-dir \
    -r requirements.txt


# Backend

COPY backend/ /app/


# Frontend compilado

COPY --from=frontend-builder \
    /frontend/dist \
    /app/web


# Railway proporciona PORT automáticamente.
# Antes de arrancar aplicamos migraciones.

CMD ["/bin/sh", "-c", "python -m alembic upgrade head && exec python -m uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]