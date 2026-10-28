import os
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from sqlalchemy import text

from backend.app.core.config import settings
from backend.app.db.session import engine, Base, get_db
from backend.app.api.v1.router import api_router
from backend.app.api.v1.endpoints.templates import ensure_templates_seeded


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure upload directory exists
    os.makedirs(os.path.abspath(settings.UPLOAD_DIR), exist_ok=True)
    
    # Create tables if not existing
    Base.metadata.create_all(bind=engine)

    # Seed templates
    with Session(engine) as db:
        try:
            ensure_templates_seeded(db)
        except Exception as e:
            print(f"Warning during template seed: {e}")

    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Full-stack API powering WishCraft celebration website builder.",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount local upload storage for public image serving
upload_path = os.path.abspath(settings.UPLOAD_DIR)
os.makedirs(upload_path, exist_ok=True)
app.mount("/api/v1/uploads", StaticFiles(directory=upload_path), name="uploads")

# Health Check
@app.get("/health", tags=["Health"])
def health_check(db: Session = Depends(get_db)):
    """Health check endpoint verifying API and database operational status."""
    db_status = "healthy"
    try:
        db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    return {
        "status": "healthy" if db_status == "healthy" else "degraded",
        "database": db_status,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }


# Include API v1 Router
app.include_router(api_router, prefix="/api/v1")

