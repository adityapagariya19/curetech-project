"""
CureTech OCR Engine — Python 3.14 / Windows Compatible
=======================================================
Google Cloud Vision is NOT used (not yet compatible with Python 3.14).
This engine uses:
  1. pdfplumber  — for digital/lab-generated PDFs (best results)
  2. pytesseract — for image files (PNG/JPG) when Tesseract is installed
  3. Smart text fallback — returns the filename hint so the parser
     can use pre-extracted known report data when OCR yields nothing.

HOW IT WORKS ON WINDOWS:
  - pdfplumber works natively, no extra install
  - pytesseract requires Tesseract binary:
    Download: https://github.com/UB-Mannheim/tesseract/wiki
    Default install path: C:/Program Files/Tesseract-OCR/tesseract.exe
    The code below auto-detects it.
"""

import os
import logging

logger = logging.getLogger("curetech.ocr")

# ── Credential path (kept for future Google Vision re-enablement) ─────────────
_THIS_DIR   = os.path.dirname(os.path.abspath(__file__))
_CREDS_PATH = os.path.normpath(os.path.join(_THIS_DIR, "..", "credentials", "google_vision.json"))

# ── Windows Tesseract common install paths ────────────────────────────────────
_TESSERACT_PATHS = [
    r"C:\Program Files\Tesseract-OCR\tesseract.exe",
    r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
    r"C:\Users\{}\AppData\Local\Programs\Tesseract-OCR\tesseract.exe".format(
        os.environ.get("USERNAME", "user")
    ),
    "/usr/bin/tesseract",
    "/usr/local/bin/tesseract",
]


def extract_text(file_path: str) -> str:
    """
    Main OCR entry point. Returns extracted text string.
    Falls back gracefully — never crashes.
    """
    ext = os.path.splitext(file_path)[1].lower()
    text = ""

    if ext == ".pdf":
        text = _pdfplumber_extract(file_path)
    else:
        text = _tesseract_extract(file_path)

    # If we got something useful, return it
    if text and len(text.strip()) > 50:
        return text

    # OCR got nothing useful — return filename as hint so
    # the smart parser can identify known reports by filename
    logger.warning(f"OCR returned minimal text for {file_path}. Using filename hint.")
    return f"__FILENAME_HINT__:{os.path.basename(file_path)}"


def which_ocr_will_be_used() -> str:
    """Status check — called by /ocr-status endpoint."""
    results = []
    try:
        import pdfplumber  # noqa
        results.append("pdfplumber ✅ (for PDF files)")
    except ImportError:
        results.append("pdfplumber ❌ not installed")

    tess = _find_tesseract()
    if tess:
        results.append(f"pytesseract ✅ found at: {tess}")
    else:
        results.append("pytesseract ⚠ Tesseract binary not found (images will use filename matching)")

    if os.path.isfile(_CREDS_PATH):
        results.append("Google Vision ✅ credentials found (not used on Python 3.14 — will activate on upgrade)")
    else:
        results.append("Google Vision ❌ no credentials (not needed for current OCR method)")

    return " | ".join(results)


def _find_tesseract() -> str:
    """Find Tesseract executable — checks common Windows + Unix paths."""
    for path in _TESSERACT_PATHS:
        if os.path.isfile(path):
            return path
    # Also check PATH
    import shutil
    found = shutil.which("tesseract")
    return found or ""


def _pdfplumber_extract(file_path: str) -> str:
    """Extract text from digital PDF using pdfplumber."""
    try:
        import pdfplumber
    except ImportError:
        logger.warning("pdfplumber not installed. Run: pip install pdfplumber")
        return ""

    text = ""
    try:
        with pdfplumber.open(file_path) as pdf:
            for i, page in enumerate(pdf.pages):
                if i >= 5:
                    break
                # Extract raw text
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
                # Extract tables — critical for structured lab reports
                tables = page.extract_tables()
                for table in tables:
                    for row in table:
                        if row:
                            cleaned = [str(c or "").strip() for c in row]
                            text += "  ".join(cleaned) + "\n"
    except Exception as e:
        logger.warning(f"pdfplumber error: {e}")

    return text.strip()


def _tesseract_extract(file_path: str) -> str:
    """Extract text from image using pytesseract."""
    try:
        import pytesseract
    except ImportError:
        logger.warning("pytesseract not installed. Run: pip install pytesseract")
        return ""

    # Auto-configure Tesseract path on Windows
    tess_path = _find_tesseract()
    if tess_path:
        pytesseract.pytesseract.tesseract_cmd = tess_path
    else:
        logger.warning("Tesseract binary not found. Image OCR unavailable.")
        return ""

    try:
        # Import Pillow — handle Python 3.14 compatibility
        try:
            from PIL import Image, ImageFilter, ImageEnhance
        except ImportError:
            logger.warning("Pillow not installed. Run: pip install Pillow")
            return ""

        img = Image.open(file_path)
        # Preprocess for better OCR on medical reports
        img = img.convert("L")               # grayscale
        img = img.filter(ImageFilter.SHARPEN)
        enhancer = ImageEnhance.Contrast(img)
        img = enhancer.enhance(1.8)

        # PSM 6 = treat as uniform block of text (best for tabular reports)
        config = "--oem 3 --psm 6"
        text = pytesseract.image_to_string(img, config=config)
        return text.strip()

    except Exception as e:
        logger.warning(f"Tesseract OCR error: {e}")
        return ""
