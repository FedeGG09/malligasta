
import os
import re
import logging
import pandas as pd
from pathlib import Path
from hugchat import hugchat
from sentence_transformers import SentenceTransformer, util
from pydantic_settings import BaseSettings

logging.basicConfig(level=logging.INFO)

# ── CONFIG ────────────────────────────────────────────────────────────
class Settings(BaseSettings):
    CSV_PATH: str          = os.getenv("CSV_PATH", "D:/Repositorios/Malligasta/datos_turisticos.csv")
    COOKIE_PATH: str       = os.getenv("COOKIE_PATH", "D:/Repositorios/Malligasta/backend/cookies.json")
    EMBED_MODEL_NAME: str  = os.getenv("EMBED_MODEL_NAME", "all-MiniLM-L6-v2")
    TOP_K: int             = int(os.getenv("TOP_K", 3))

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()

# ── FUNCIONES DE PREPROCESADO ─────────────────────────────────────────
def limpiar_texto(texto: str) -> str:
    if not isinstance(texto, str) or not texto.strip():
        return "SIN_DATA"
    t = texto.lower().strip()
    t = re.sub(r'\s+', ' ', t)
    t = re.sub(r'[^\w\s,.:/-]', '', t)
    return t

def load_csv() -> pd.DataFrame:
    df = pd.read_csv(settings.CSV_PATH)
    df = df.astype(str).applymap(lambda x: limpiar_texto(x) if x.strip() else "SIN_DATA")
    logging.info("CSV cargado con %d registros.", len(df))
    return df

# ── PLANTILLAS PARA RAG ────────────────────────────────────────────────
campos = {
    "ubicacion":      ("¿Dónde se ubica {nombre}?",      "ubicación"),
    "precio":         ("¿Cuál es el rango de precios de {nombre}?", "servicios_precios"),
    "tipo_de_comida": ("¿Qué tipo de comida ofrece {nombre}?",    "tipo_de_comida"),
    "horarios":       ("¿Cuáles son los horarios de {nombre}?",   "servicios_horarios"),
    "agenda":         ("Cuéntame la agenda o eventos de {nombre}.","agenda"),
    "telefono":       ("¿Cuál es el número de teléfono de {nombre}?", "contacto_telefono"),
    "email":          ("¿Cuál es la dirección de correo electrónico de {nombre}?", "contacto_email"),
    "sitio_web":      ("¿Cuál es el sitio web oficial de {nombre}?",   "contacto_web"),
}

def construir_corpus(df: pd.DataFrame) -> list[str]:
    corpus = []
    for _, row in df.iterrows():
        nombre = limpiar_texto(row.get("nombre", ""))
        if nombre == "sin_data":
            continue
        for plantilla, columna in campos.values():
            valor = row.get(columna)
            if pd.notnull(valor) and limpiar_texto(str(valor)) != "sin_data":
                pregunta  = plantilla.format(nombre=nombre)
                respuesta = limpiar_texto(str(valor))
                corpus.append(f"Pregunta: {pregunta}\nRespuesta: {respuesta}")
    logging.info("Corpus construido con %d fragmentos.", len(corpus))
    return corpus

def embed_corpus(corpus: list[str], model: SentenceTransformer):
    emb = model.encode(corpus, convert_to_tensor=True)
    logging.info("Embeddings del corpus listos.")
    return emb

# ── RAG + HuggingChat ─────────────────────────────────────────────────
_embed_model = SentenceTransformer(settings.EMBED_MODEL_NAME)
_df           = load_csv()
_corpus       = construir_corpus(_df)
_corpus_emb   = embed_corpus(_corpus, _embed_model)

_chatbot = None
def _get_chatbot():
    global _chatbot
    if _chatbot is None:
        if not Path(settings.COOKIE_PATH).exists():
            raise FileNotFoundError(f"No se encontró cookies en '{settings.COOKIE_PATH}'")
        _chatbot = hugchat.ChatBot(cookie_path=settings.COOKIE_PATH)
        cid = _chatbot.new_conversation()
        _chatbot.change_conversation(cid)
        logging.info("HuggingChat inicializado.")
    return _chatbot

def rag_chat(pregunta: str) -> str:
    if not pregunta.strip():
        return "Por favor ingresa una pregunta."

    # 1) Embedding de la query
    q_emb = _embed_model.encode(pregunta, convert_to_tensor=True)
    # 2) Recuperar top-K
    cos_scores = util.cos_sim(q_emb, _corpus_emb)[0]
    topk = cos_scores.topk(settings.TOP_K)
    indices = topk.indices.tolist()
    # 3) Construir contexto
    contexto = "\n---\n".join(_corpus[i] for i in indices)
    # 4) Formar prompt
    prompt = (
        "Usa SOLO esta info extraída de nuestro CSV para responder:\n\n"
        f"{contexto}\n\n"
        f"Pregunta: {pregunta}\nRespuesta:"
    )
    # 5) Llamar al LLM remoto (HuggingChat)
    bot = _get_chatbot()
    respuesta = bot.chat(prompt)
    return respuesta.text 
