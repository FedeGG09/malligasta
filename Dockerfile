FROM python:3.10-slim
WORKDIR /app

# Instala dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia los datos y configuración
COPY cookies.json datos_turisticos.csv ./

# Copia el backend y frontend
COPY backend/ backend/
COPY frontend/ frontend/

EXPOSE 8080

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8080"]
