# Base image
FROM python:3.10-slim

# Desactivar buffering para logs inmediatos
env PYTHONUNBUFFERED=1
# Puerto por defecto (Cloud Run inyecta PORT en el entorno)
ENV PORT=8080

# Directorio de trabajo\ nWORKDIR /app

# 1) Copiar e instalar dependencias para cache de capas óptima
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# 2) Copiar todo el código fuente, datos y configuración
COPY . ./

# 3) Exponer el puerto que usa la app (usar variable de entorno)
EXPOSE $PORT

# 4) Comando por defecto: arranca Uvicorn leyendo el PORT en entorno\ n#    Ajusta <module>:<app> si tu FastAPI instancia está en otro archivo
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port $PORT"]
