import os
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from fastapi.responses import FileResponse
from backend.app.services.storage import storage_service
from backend.app.core.config import settings

router = APIRouter()


@router.post("", status_code=status.HTTP_201_CREATED)
async def upload_file(file: UploadFile = File(...)):
    """Upload and permanently store an image file."""
    asset_id, url = await storage_service.save_image(file)
    return {
        "asset_id": asset_id,
        "url": url,
        "filename": file.filename
    }


@router.get("/{filename}")
async def get_uploaded_file(filename: str):
    """Retrieve and serve an uploaded image file."""
    safe_name = os.path.basename(filename)
    filepath = os.path.join(storage_service.upload_dir, safe_name)
    if not os.path.exists(filepath):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found."
        )
    return FileResponse(filepath)

