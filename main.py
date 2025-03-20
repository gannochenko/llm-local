from llama_cpp import Llama
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict, AsyncGenerator
from fastapi.responses import StreamingResponse
import asyncio

# GLOBAL VARIABLES
zephyr_model_path = "./zephyr-model.gguf"
deepseek_model_path = "./deepseek-model.gguf"
CONTEXT_SIZE = 512

app = FastAPI()

zephyr_llm = Llama(
                    model_path=zephyr_model_path,
                    chat_format="llama-2",
                    n_ctx=4096,
                    n_threads=8,
)

class ChatRequest(BaseModel):
    messages: List[Dict[str, str]]  # Expecting OpenAI-style message format
    stream: bool = False  # Option to enable streaming

@app.post("/chat")
async def chat(request: ChatRequest):
    response = zephyr_llm.create_chat_completion(
        messages=request.messages,
        stream=request.stream  # Pass the streaming flag
    )

    if request.stream:
        return StreamingResponse(stream_generator(response), media_type="text/event-stream")
    else:
        return {"response": response["choices"][0]["message"]["content"]}

# Async generator for streaming responses
async def stream_generator(response):
    for chunk in response:
        if "choices" in chunk and len(chunk["choices"]) > 0:
            choice = chunk["choices"][0]
            if "delta" in choice and "content" in choice["delta"]:
                content = choice["delta"]["content"]
                if content:
                    yield f"data: {content}\n\n"
            elif "message" in choice and "content" in choice["message"]:
                content = choice["message"]["content"]
                if content:
                    yield f"data: {content}\n\n"
    yield "data: [DONE]\n\n"
