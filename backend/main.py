from fastapi import FastAPI
from routers import agent_router

app = FastAPI(
    title="ForasKhadra AI API",
    description="Backend API for the AI agent, built with FastAPI and LangGraph",
    version="0.1.0"
)

app.include_router(agent_router.router)

@app.get("/")
def root():
    return {"message": "Hello from the ForasKhadra AI backend!"}

