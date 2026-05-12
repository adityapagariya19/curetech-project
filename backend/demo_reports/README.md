# CureTech Demo Reports

These two real blood test reports are included so you can immediately test
the full upload-to-dashboard flow without needing a working OCR engine.

## Report 1: Ramesh Kumar (HealthCare Diagnostics Lab)
File: 13802.png
- Patient: RAMESH KUMAR, 35Y/Male
- Lab No: LBC240513001, Date: 13-May-2024
- Result: ALL NORMAL — Health Score: 95/100
- Upload as: Blood / CBC report type

## Report 2: Ms. Shivanshri Kadam (Manipal TRUtest)
File: IMG-20260118-WA0006.pdf
- Patient: MS. SHIVANSHRI KADAM, 19Y/Female
- Sample ID: 248072769, Date: 09-Jan-2026
- Result: 2 ABNORMAL (RDW-CV high, WBC high) — Health Score: 78/100
- Upload as: Blood / CBC report type

## How matching works
The backend recognises these files by filename substring matching.
Even if you rename them, as long as the name contains "13802", "wa0006",
"ramesh", "shivanshri", "manipal", or "kadam" — the exact real data loads.

For any OTHER report uploaded, the system runs live OCR extraction.
