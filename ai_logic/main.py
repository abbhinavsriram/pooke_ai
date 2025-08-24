from unittest import result
from langgraph.graph import StateGraph, END, START
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import httpx
from fastapi.middleware.cors import CORSMiddleware
from langchain_ollama import OllamaLLM


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True, 
    allow_methods=["*"],
    allow_headers=["*"],
)

PISTON_URL = "https://emkc.org/api/v2/piston/execute"

class RunRequest(BaseModel):
    language: str
    version: str
    code: str

@app.post("/run")
async def run_code(req: RunRequest):
    payload = {
        "language": req.language,
        "version": req.version,
        "files": [{"content": req.code}],
    }
    async with httpx.AsyncClient() as client:
        resp = await client.post(PISTON_URL, json=payload)
        if resp.status_code != 200:
            raise HTTPException(status_code=resp.status_code, detail=resp.text)
        return resp.json()

# 1. Define the state schema for the agent
class OllamaChatState(BaseModel):
    prompt: str
    response: str = ""

# 2. Initialize the Ollama LLM (make sure Ollama is running with your model, e.g., 'mistral')
llm = OllamaLLM(model="mistral")

# 3. Define the agent function
def ollama_agent(state: OllamaChatState):
    state.response = llm(state.prompt)
    return state

# 4. Build the LangGraph with a start node and the ollama agent
graph = StateGraph(state_schema=OllamaChatState)
graph.add_edge(START, "ollama")
graph.add_node("ollama", ollama_agent)
graph.add_edge("ollama", END)
compiled_graph = graph.compile()

# 5. FastAPI endpoint for the agent
class ChatRequest(BaseModel):
    prompt: str

@app.post("/chat")
async def chat(req: ChatRequest):
    state = OllamaChatState(prompt=req.prompt)
    result = compiled_graph.invoke(state)
    return {"response": result["response"]}