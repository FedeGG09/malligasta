FROM python:3.10-slim

# Evitar buffers de Python para logs inmediatos
env PYTHONUNBUFFERED=1

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar e instalar dependencias primero (para cache de capas)
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el resto de la aplicación (código, datos, frontend, config)
COPY . ./

# Puerto en el que la aplicación escuchará en Cloud Run
EXPOSE 8080

# Comando por defecto: arranca Uvicorn apuntando al FastAPI en main.py
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
