from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# 1. Import your brand new Fleet Operations routers
from app.routes.trip import router as trip_router
from app.routes.operations import router as operations_router
from app.routes.analytics import router as analytics_router

app = FastAPI(
    title="Transit-Ops API",
    description="Fleet Operations and Logistics Management System Backend",
    version="1.0.0"
)

# Enable CORS so Bhavya's Vite frontend can talk to your FastAPI backend seamlessly
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify Bhavya's local dev port (e.g., http://localhost:5173)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Register your module's routers into the application instance
app.include_router(trip_router)
app.include_router(operations_router)
app.include_router(analytics_router)

@app.get("/")
def root():
    return {"status": "online", "module": "Transit-Ops Central Gateway Enabled"}