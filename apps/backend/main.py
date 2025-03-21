from llama_cpp import Llama
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict, AsyncGenerator
from fastapi.responses import StreamingResponse, PlainTextResponse
import asyncio
from fastapi.middleware.cors import CORSMiddleware
import psutil
import time

# GLOBAL VARIABLES
zephyr_model_path = "./zephyr-model.gguf"
# deepseek_model_path = "./deepseek-model.gguf"
START_TIME = time.time()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

zephyr_llm = Llama(
                    model_path=zephyr_model_path,
                    chat_format="llama-2",
                    n_ctx=4096,
                    n_threads=8,
)

class ChatRequest(BaseModel):
    messages: List[Dict[str, str]]
    stream: bool = False 

@app.post("/chat")
async def chat(request: ChatRequest):
    response = zephyr_llm.create_chat_completion(
        messages=request.messages,
        stream=request.stream
    )

    if request.stream:
        return StreamingResponse(stream_generator(response), media_type="text/event-stream")
    else:
        return {"response": response["choices"][0]["message"]["content"]}

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

@app.get("/metrics")
async def get_metrics():
    """
    Endpoint that provides system metrics in Prometheus format
    """
    # Get metrics
    cpu_percent = psutil.cpu_percent(interval=1)
    cpu_count = psutil.cpu_count()
    memory = psutil.virtual_memory()
    disk = psutil.disk_usage('/')
    uptime_seconds = time.time() - START_TIME
    process = psutil.Process()
    process_memory = process.memory_info()
    
    # Format metrics in Prometheus format
    metrics = []
    
    # Add HELP and TYPE comments for each metric
    metrics.append("# HELP system_cpu_utilization CPU utilization percentage")
    metrics.append("# TYPE system_cpu_utilization gauge")
    metrics.append(f"system_cpu_utilization {cpu_percent}")
    
    metrics.append("# HELP system_cpu_count Number of CPU cores")
    metrics.append("# TYPE system_cpu_count gauge")
    metrics.append(f"system_cpu_count {cpu_count}")
    
    metrics.append("# HELP system_memory_total_bytes Total memory in bytes")
    metrics.append("# TYPE system_memory_total_bytes gauge")
    metrics.append(f"system_memory_total_bytes {memory.total}")
    
    metrics.append("# HELP system_memory_available_bytes Available memory in bytes")
    metrics.append("# TYPE system_memory_available_bytes gauge")
    metrics.append(f"system_memory_available_bytes {memory.available}")
    
    metrics.append("# HELP system_memory_used_bytes Used memory in bytes")
    metrics.append("# TYPE system_memory_used_bytes gauge")
    metrics.append(f"system_memory_used_bytes {memory.used}")
    
    metrics.append("# HELP system_memory_percent Percentage of memory used")
    metrics.append("# TYPE system_memory_percent gauge")
    metrics.append(f"system_memory_percent {memory.percent}")
    
    metrics.append("# HELP system_disk_total_bytes Total disk space in bytes")
    metrics.append("# TYPE system_disk_total_bytes gauge")
    metrics.append(f"system_disk_total_bytes {disk.total}")
    
    metrics.append("# HELP system_disk_used_bytes Used disk space in bytes")
    metrics.append("# TYPE system_disk_used_bytes gauge")
    metrics.append(f"system_disk_used_bytes {disk.used}")
    
    metrics.append("# HELP system_disk_free_bytes Free disk space in bytes")
    metrics.append("# TYPE system_disk_free_bytes gauge")
    metrics.append(f"system_disk_free_bytes {disk.free}")
    
    metrics.append("# HELP system_disk_percent Percentage of disk used")
    metrics.append("# TYPE system_disk_percent gauge")
    metrics.append(f"system_disk_percent {disk.percent}")
    
    metrics.append("# HELP app_uptime_seconds Time since application started in seconds")
    metrics.append("# TYPE app_uptime_seconds counter")
    metrics.append(f"app_uptime_seconds {uptime_seconds}")
    
    metrics.append("# HELP app_memory_usage_bytes Memory usage of this application in bytes")
    metrics.append("# TYPE app_memory_usage_bytes gauge")
    metrics.append(f"app_memory_usage_bytes {process_memory.rss}")
    
    metrics.append("# HELP app_cpu_percent CPU usage percentage of this application")
    metrics.append("# TYPE app_cpu_percent gauge")
    metrics.append(f"app_cpu_percent {process.cpu_percent(interval=0.1)}")

    # Return the metrics as plain text
    return PlainTextResponse("\n".join(metrics))
