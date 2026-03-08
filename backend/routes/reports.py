from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from uuid import uuid4
import os
import shutil

from utils.ocr import extract_text
from utils.blood_parser import parse_blood_report
from utils.blood_formatter import format_blood_for_ui
from utils.auth import get_current_user

router = APIRouter(prefix="/reports", tags=["Reports"])

UPLOAD_DIR = "uploads/reports"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# TEMP in-memory DB
fake_reports_db = {}

@router.post("/upload")
def upload_report(
    report_type: str,
    file: UploadFile = File(...),
    user=Depends(get_current_user),
):
    report_id = str(uuid4())
    path = f"{UPLOAD_DIR}/{report_id}_{file.filename}"

    with open(path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    fake_reports_db[report_id] = {
        "id": report_id,
        "type": report_type,
        "path": path,
        "status": "uploaded",
        "result": None,
    }

    return {"report_id": report_id}

@router.post("/analyze/{report_id}")
def analyze_report(report_id: str, user=Depends(get_current_user)):
    report = fake_reports_db.get(report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    text = extract_text(report["path"])

    if report["type"] == "blood":
        parsed = parse_blood_report(text)
        report["result"] = format_blood_for_ui(parsed)

    report["status"] = "completed"
    return {"message": "Analysis completed"}

@router.get("/blood/{report_id}")
def get_blood_report(report_id: str, user=Depends(get_current_user)):
    report = fake_reports_db.get(report_id)

    if not report or report["type"] != "blood":
        raise HTTPException(status_code=404, detail="Blood report not found")

    if report["status"] != "completed":
        raise HTTPException(status_code=400, detail="Report not ready")

    return report["result"]
