from fastapi import APIRouter
from backend.app.api.v1.endpoints import auth, creations, templates, uploads, public, ai

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(creations.router, prefix="/creations", tags=["Creations"])
api_router.include_router(templates.router, prefix="/templates", tags=["Templates"])
api_router.include_router(uploads.router, prefix="/uploads", tags=["Uploads"])
api_router.include_router(public.router, prefix="/public", tags=["Public Sites"])
api_router.include_router(ai.router, prefix="/ai", tags=["AI Message Generator"])

