from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import httpx
from fastapi.middleware.cors import CORSMiddleware

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