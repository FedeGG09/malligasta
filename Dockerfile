FROM python:3.10-slim
ENV PYTHONUNBUFFERED=1 PORT=8080

# 1) Copiar e instalar requisitos
WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# 2) Copiar app y datos
COPY . /app
# Mueve los datos al backend para que quede /app/backend/cookies.json, etc.
RUN mv /app/cookies.json /app/backend/
RUN mv /app/datos_turisticos.csv /app/backend/

# 3) Cambiar a directorio del backend
WORKDIR /app/backend
EXPOSE $PORT

# 4) Arrancar uvicorn apuntando a main.py
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port $PORT"]
