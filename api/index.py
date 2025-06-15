import os
from fastapi import FastAPI
from langfuse import Langfuse
from api.config import Config
from api.routes.procurement import router as procurement_router

# Initialize Langfuse
config = Config()
langfuse = Langfuse(
    secret_key=os.getenv("LANGFUSE_SECRET_KEY"),
    public_key=os.getenv("LANGFUSE_PUBLIC_KEY"),
    host="https://cloud.langfuse.com",
)

app = FastAPI(
    title="Procurement API",
    description="API for processing procurement documents",
    version="1.0.0",
)

# Include routers
app.include_router(procurement_router, prefix="/api", tags=["procurement"])


@app.get("/")
async def root():
    return {"message": "Procurement API is running"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
