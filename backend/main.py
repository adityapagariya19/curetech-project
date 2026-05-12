import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, contact, reports

# Ensure uploads directory exists on startup
os.makedirs("uploads/reports", exist_ok=True)

app = FastAPI(
    title="CureTech API",
    version="2.0.0",
    description="AI-powered medical report analysis backend",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(contact.router)
app.include_router(reports.router)

@app.get("/", tags=["Health"])
def root():
    return {
        "status": "CureTech API v2.0 running",
        "docs": "http://127.0.0.1:8000/docs",
        "ocr_check": "http://127.0.0.1:8000/ocr-status",,
    }

@app.get("/ocr-status", tags=["Health"])
def ocr_status():
    """Check which OCR engine is active. Visit this URL after placing google_vision.json."""
    from utils.ocr import which_ocr_will_be_used, _CREDS_PATH
    return {
        "ocr_engine": which_ocr_will_be_used(),
        "credentials_path": _CREDS_PATH,
        "credentials_found": os.path.isfile(_CREDS_PATH),
        "instruction": "Place your Google Vision JSON key at the credentials_path above to activate Vision OCR",
    }
