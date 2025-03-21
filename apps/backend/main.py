from llama_cpp import Llama
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict, AsyncGenerator
from fastapi.responses import StreamingResponse, PlainTextResponse
import asyncio
from fastapi.middleware.cors import CORSMiddleware
import psutil
import time
import re

# GLOBAL VARIABLES
zephyr_model_path = "./zephyr-model.gguf"
START_TIME = time.time()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize model without specifying a chat format
# We'll handle the formatting ourselves
zephyr_llm = Llama(
    model_path=zephyr_model_path,
    n_ctx=4096,
    n_threads=8,
    # No chat_format specified - we'll convert messages manually
)

class ChatRequest(BaseModel):
    messages: List[Dict[str, str]]
    stream: bool = False
    max_tokens: int = 2048

def convert_to_chatml(messages: List[Dict[str, str]]) -> str:
    """
    Convert messages from the OpenAI/Llama-2 format to ChatML format for Zephyr 7B.
    """
    chatml_prompt = ""

    for message in messages:
        role = message["role"]
        content = message["content"]

        if role == "system":
            chatml_prompt += f"<|system|>\n{content}\n</s>\n"
        elif role == "user":
            chatml_prompt += f"<|user|>\n{content}\n</s>\n"
        elif role == "assistant":
            chatml_prompt += f"<|assistant|>\n{content}\n</s>\n"

    # Add the assistant tag at the end to prompt the model to generate
    if not chatml_prompt.endswith("<|assistant|>\n"):
        chatml_prompt += "<|assistant|>\n"

    return chatml_prompt


@app.post("/chat")
async def chat(request: ChatRequest):
    # Convert messages to ChatML format
    chatml_prompt = convert_to_chatml(request.messages)

    # Use completion API instead of chat completion
    if request.stream:
        response = zephyr_llm.create_completion(
            prompt=chatml_prompt,
            max_tokens=request.max_tokens,
            stream=True,
            stop=["</s>", "<|user|>"]  # Stop generation at these tokens
        )
        return StreamingResponse(stream_chatml_generator(response), media_type="text/event-stream")
    else:
        response = zephyr_llm.create_completion(
            prompt=chatml_prompt,
            max_tokens=request.max_tokens,
            stream=False,
            stop=["</s>", "<|user|>"]  # Stop generation at these tokens
        )
        generated_text = response["choices"][0]["text"]

        # Return in a format compatible with your existing code
        return {
            "response": generated_text,
            "choices": [{"message": {"content": generated_text, "role": "assistant"}}]
        }

async def stream_chatml_generator(response):
    for chunk in response:
        if "choices" in chunk and len(chunk["choices"]) > 0:
            choice = chunk["choices"][0]
            if "text" in choice:
                content = choice["text"]
                if content:
                    # Clean the chunk content before sending
                    if content:
                        yield f"data: {content}\n\n"
    yield "data: [DONE]\n\n"

@app.get("/")
async def root():
    return {"message": "Zephyr API is running"}