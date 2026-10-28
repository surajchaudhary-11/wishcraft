import os
import uuid
import io
from typing import Tuple, Optional
from PIL import Image
from fastapi import UploadFile, HTTPException, status
from backend.app.core.config import settings


class StorageService:
    def __init__(self):
        self.upload_dir = os.path.abspath(settings.UPLOAD_DIR)
        os.makedirs(self.upload_dir, exist_ok=True)

    async def save_image(self, file: UploadFile) -> Tuple[str, str]:
        """
        Validates and permanently stores an uploaded image file.
        Returns a tuple of (asset_id, url).
        """
        # Validate MIME type
        content_type = file.content_type or ""
        if content_type not in settings.ALLOWED_IMAGE_TYPES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported image type '{content_type}'. Allowed types: JPG, PNG, WEBP, GIF."
            )

        # Read file contents and check size
        contents = await file.read()
        max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
        if len(contents) > max_bytes:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"File exceeds maximum allowed size of {settings.MAX_UPLOAD_SIZE_MB}MB."
            )

        # Validate that content is a real image with Pillow
        try:
            image = Image.open(io.BytesIO(contents))
            image.verify()
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The uploaded file is corrupted or not a valid image format."
            )

        # Handle Cloudinary backend if configured
        if (
            settings.STORAGE_BACKEND == "cloudinary"
            and settings.CLOUDINARY_CLOUD_NAME
            and settings.CLOUDINARY_API_KEY
            and settings.CLOUDINARY_API_SECRET
        ):
            try:
                import cloudinary
                import cloudinary.uploader

                cloudinary.config(
                    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
                    api_key=settings.CLOUDINARY_API_KEY,
                    api_secret=settings.CLOUDINARY_API_SECRET
                )
                upload_res = cloudinary.uploader.upload(
                    contents,
                    folder="wishcraft",
                    resource_type="image"
                )
                asset_id = upload_res.get("public_id")
                url = upload_res.get("secure_url")
                return asset_id, url
            except Exception as e:
                # Fallback to local storage if Cloudinary fails
                pass

        # Local storage backend (default)
        ext = os.path.splitext(file.filename or "")[1].lower()
        if not ext or ext not in [".jpg", ".jpeg", ".png", ".webp", ".gif"]:
            type_map = {
                "image/jpeg": ".jpg",
                "image/png": ".png",
                "image/webp": ".webp",
                "image/gif": ".gif"
            }
            ext = type_map.get(content_type, ".jpg")

        asset_id = str(uuid.uuid4())
        filename = f"{asset_id}{ext}"
        filepath = os.path.join(self.upload_dir, filename)

        with open(filepath, "wb") as f:
            f.write(contents)

        url = f"/api/v1/uploads/{filename}"
        return asset_id, url

    def delete_local_file(self, filename: str) -> bool:
        """Safely remove a local file by filename."""
        safe_name = os.path.basename(filename)
        filepath = os.path.join(self.upload_dir, safe_name)
        if os.path.exists(filepath):
            try:
                os.remove(filepath)
                return True
            except OSError:
                return False
        return False


storage_service = StorageService()

