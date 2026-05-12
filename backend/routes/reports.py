"""
CureTech Report Routes — Python 3.14 Compatible
"""
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from uuid import uuid4
from datetime import datetime
import os
import shutil

from utils.auth import get_current_user
from utils.ocr import extract_text
from utils.parsers import parse_report, format_report_for_ui

router = APIRouter(prefix="/reports", tags=["Reports"])

UPLOAD_DIR   = "uploads/reports"
ALLOWED_TYPES = ["blood", "urine", "liver", "kidney", "thyroid"]
ALLOWED_EXTS  = [".pdf", ".png", ".jpg", ".jpeg"]

os.makedirs(UPLOAD_DIR, exist_ok=True)

# In-memory store (replace with DB for production)
reports_db: dict = {}


@router.post("/upload")
def upload_report(
    report_type: str,
    file: UploadFile = File(...),
    user: str = Depends(get_current_user),
):
    if report_type not in ALLOWED_TYPES:
        raise HTTPException(400, f"Invalid report_type. Must be one of: {ALLOWED_TYPES}")

    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_EXTS:
        raise HTTPException(400, f"Unsupported file type '{ext}'. Use PDF, PNG, or JPG.")

    report_id = str(uuid4())
    save_path = os.path.join(UPLOAD_DIR, f"{report_id}_{file.filename}")

    with open(save_path, "wb") as buf:
        shutil.copyfileobj(file.file, buf)

    reports_db[report_id] = {
        "id":         report_id,
        "type":       report_type,
        "filename":   file.filename,
        "path":       save_path,
        "user":       user,
        "status":     "uploaded",
        "result":     None,
        "uploadedAt": datetime.utcnow().isoformat(),
        "analyzedAt": None,
    }
    return {"report_id": report_id, "status": "uploaded", "message": "Upload successful"}


@router.post("/analyze/{report_id}")
def analyze_report(report_id: str, user: str = Depends(get_current_user)):
    report = reports_db.get(report_id)
    if not report:
        raise HTTPException(404, "Report not found")
    if report["user"] != user:
        raise HTTPException(403, "Access denied")

    try:
        # Step 1: OCR extraction
        raw_text = extract_text(report["path"])

        # Step 2: Parse (known-report match OR live regex)
        parsed = parse_report(report["type"], raw_text, report["filename"])

        # Step 3: Format for UI
        result = format_report_for_ui(report["type"], parsed, report["filename"])

        report["result"]     = result
        report["status"]     = "completed"
        report["analyzedAt"] = datetime.utcnow().isoformat()

    except Exception as e:
        report["status"] = "failed"
        raise HTTPException(500, f"Analysis failed: {str(e)}")

    return {"report_id": report_id, "status": "completed", "message": "Analysis completed"}


@router.get("/result/{report_id}")
def get_result(report_id: str, user: str = Depends(get_current_user)):
    report = reports_db.get(report_id)
    if not report:
        raise HTTPException(404, "Report not found")
    if report["user"] != user:
        raise HTTPException(403, "Access denied")
    if report["status"] == "uploaded":
        raise HTTPException(400, "Report not yet analyzed — please wait")
    if report["status"] == "failed":
        raise HTTPException(500, "Analysis failed for this report")
    return report["result"]


@router.get("/status/{report_id}")
def get_status(report_id: str, user: str = Depends(get_current_user)):
    report = reports_db.get(report_id)
    if not report:
        raise HTTPException(404, "Report not found")
    if report["user"] != user:
        raise HTTPException(403, "Access denied")
    return {"status": report["status"], "report_id": report_id}


@router.get("/history")
def get_history(user: str = Depends(get_current_user)):
    return [
        {
            "id":         r["id"],
            "type":       r["type"],
            "filename":   r["filename"],
            "status":     r["status"],
            "uploadedAt": r["uploadedAt"],
            "analyzedAt": r["analyzedAt"],
            "score":      r["result"]["score"] if r["result"] else None,
        }
        for r in reports_db.values()
        if r["user"] == user
    ]
