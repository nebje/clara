from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

class Features(BaseModel):
    score: float = 0.0

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/evaluate")
def evaluate(features: Features):
    s = features.score
    if s < 0.33:
        return {"intervention": "respira"}
    elif s < 0.66:
        return {"intervention": "estira"}
    else:
        return {"intervention": "pausa"}
