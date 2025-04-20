# Dockerfile
FROM python:3.10-slim

WORKDIR /app

# Copia requirements e instala
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia todo el backend y frontend
COPY backend/ backend/
COPY frontend/ frontend/

# Exponer puerto para Cloud Run / Uvicorn
EXPOSE 8080

# Arranca FastAPI
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8080"]
