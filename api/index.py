from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import procurement

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(procurement.router, prefix="/api", tags=["procurement"])


@app.get("/")
async def root():
    return {"message": "Welcome to the Procurement API"}
