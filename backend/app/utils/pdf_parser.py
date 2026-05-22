"""
PDF text extraction using PyMuPDF (fitz).
Handles multi-page PDFs, cleans extracted text.
"""

import fitz  # PyMuPDF
import io
from loguru import logger


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Extract all text from a PDF file given as raw bytes.
    Returns cleaned plain text.
    """
    try:
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        full_text = []

        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            text = page.get_text("text")
            full_text.append(text)

        doc.close()
        combined = "\n".join(full_text)

        # Basic cleanup
        lines = [line.strip() for line in combined.splitlines() if line.strip()]
        return "\n".join(lines)

    except Exception as e:
        logger.error(f"PDF extraction error: {e}")
        raise ValueError(f"Could not parse PDF: {e}")


def validate_pdf(file_bytes: bytes, max_size_mb: int = 10) -> None:
    """Validate PDF file size and format."""
    size_mb = len(file_bytes) / (1024 * 1024)
    if size_mb > max_size_mb:
        raise ValueError(f"File too large: {size_mb:.1f}MB. Max allowed: {max_size_mb}MB")

    # Check PDF magic bytes
    if not file_bytes.startswith(b"%PDF"):
        raise ValueError("Invalid PDF file format")
