"""
File upload handler — saves files locally, S3-ready abstraction.
"""

import os
import uuid
import aiofiles
from pathlib import Path
from loguru import logger
from fastapi import UploadFile

from app.core.config import settings


async def save_upload(file: UploadFile, subfolder: str = "") -> dict:
    """
    Save an uploaded file to the uploads directory.
    Returns file metadata dict.
    """
    # Create subdirectory if needed
    upload_path = Path(settings.UPLOAD_DIR) / subfolder
    upload_path.mkdir(parents=True, exist_ok=True)

    # Generate unique filename preserving extension
    ext = Path(file.filename).suffix.lower()
    unique_name = f"{uuid.uuid4().hex}{ext}"
    file_path = upload_path / unique_name

    # Read content
    content = await file.read()

    # Validate size
    size_mb = len(content) / (1024 * 1024)
    if size_mb > settings.MAX_FILE_SIZE_MB:
        raise ValueError(f"File too large ({size_mb:.1f}MB). Max: {settings.MAX_FILE_SIZE_MB}MB")

    # Save asynchronously
    async with aiofiles.open(file_path, "wb") as f:
        await f.write(content)

    logger.info(f"File saved: {file_path} ({size_mb:.2f}MB)")

    return {
        "original_name": file.filename,
        "stored_name": unique_name,
        "file_path": str(file_path),
        "url": f"/uploads/{subfolder}/{unique_name}".replace("\\", "/"),
        "size_bytes": len(content),
        "content_type": file.content_type,
        "raw_bytes": content,  # For immediate processing (resume parsing)
    }


def delete_file(file_path: str) -> bool:
    """Delete a file from local storage."""
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            logger.info(f"Deleted file: {file_path}")
            return True
        return False
    except Exception as e:
        logger.error(f"Error deleting file {file_path}: {e}")
        return False
