# Base image
FROM python:3.10-slim

# Disable Python buffering for immediate logs
ENV PYTHONUNBUFFERED=1
# Set default PORT (Cloud Run will override this)
ENV PORT=8080

# Working directory
WORKDIR /app

# 1) Copy and install dependencies (leverage Docker layer cache)
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# 2) Copy application code, data and configuration
COPY . ./

# 3) Expose the port for the app
EXPOSE $PORT

# 4) Start Uvicorn for the FastAPI app in backend/main.py
CMD ["sh", "-c", "uvicorn backend.main:app --host 0.0.0.0 --port $PORT"]

