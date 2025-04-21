
import logging
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Import directo, asumiendo que main.py y chat_console.py están en el mismo dir
from chat_console import rag_chat  

logging.basicConfig(level=logging.INFO)

app = FastAPI(
    title="Chat RAG Turístico",
    description="API que utiliza embeddings + HuggingChat para responder sobre turismo",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500", "null"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    pregunta: str

class ChatResponse(BaseModel):
    respuesta: str

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    if not req.pregunta.strip():
        raise HTTPException(status_code=400, detail="La pregunta no puede estar vacía")
    try:
        resp = rag_chat(req.pregunta)
        return ChatResponse(respuesta=resp)
    except Exception as e:
        logging.error("Error en RAG chat: %s", e)
        raise HTTPException(status_code=500, detail="Error interno al generar respuesta")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)

