from fastapi import FastAPI
from routers import agent_router, opportunities
from fastapi.middleware.cors import CORSMiddleware

import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="ForasKhadra AI API",
    description="Backend API for the AI agent, built with FastAPI and LangGraph",
    version="0.1.0"
)

app.include_router(agent_router.router)
app.include_router(opportunities.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Hello from the ForasKhadra AI backend!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)