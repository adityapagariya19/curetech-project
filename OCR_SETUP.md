# CureTech — Google OCR Setup Guide
Complete guide to understand and enable Google Cloud Vision OCR.

---

## How OCR Is Wired in This Project

Here is the exact flow when a user uploads a report:

```
User uploads file
      ↓
routes/reports.py  →  POST /reports/upload
      ↓
      Saves file to: backend/uploads/reports/<uuid>_filename.pdf
      ↓
routes/reports.py  →  POST /reports/analyze/<report_id>
      ↓
utils/ocr.py  →  extract_text(file_path)
      ↓
      Checks: does backend/credentials/google_vision.json exist?
      ├─ YES → Google Cloud Vision API (best)
      ├─ NO + PDF → pdfplumber (good for digital PDFs)
      └─ NO + image → pytesseract (local, offline)
      ↓
utils/parsers.py  →  parse_report(report_type, text)
      ↓
      Regex extracts biomarker values from the text
      ↓
Returns structured JSON with values, ranges, status
```

---

## Where to Put the Key — Visual Map

```
curetech-project-main/
├── frontend/
│   └── ...
├── backend/
│   ├── credentials/
│   │   ├── README.md
│   │   └── google_vision.json   ← ✅ PUT YOUR KEY FILE HERE
│   ├── utils/
│   │   └── ocr.py               ← auto-detects the key above
│   ├── routes/
│   │   └── reports.py           ← calls ocr.py
│   └── main.py
└── OCR_SETUP.md                 ← you are reading this
```

**The file must be named exactly:** `google_vision.json`
**It must be inside the folder:** `backend/credentials/`

---

## Step-by-Step: Get Your Google Vision Key

### 1. Go to Google Cloud Console
Open: **https://console.cloud.google.com**
Log in with your Google account.

---

### 2. Create a Project
- Click the **project dropdown** at the very top of the page (next to the Google Cloud logo)
- Click **"New Project"**
- Project name: `curetech-ocr` (or anything you like)
- Click **Create**
- Wait a few seconds, then select your new project

---

### 3. Enable the Cloud Vision API
- In the top search bar, type: `Cloud Vision API`
- Click the result that says **"Cloud Vision API"**
- Click the blue **"Enable"** button
- Wait ~15 seconds

---

### 4. Create a Service Account
- Left sidebar → **IAM & Admin** → **Service Accounts**
- Click **"+ Create Service Account"** at the top
- Fill in:
  - **Name:** `curetech-vision`
  - **ID:** auto-fills, leave it
- Click **"Create and Continue"**
- **Role:** In the dropdown, search for `Cloud Vision` → select **"Cloud Vision AI User"**
- Click **Continue** → **Done**

---

### 5. Download the JSON Key
- You'll see `curetech-vision@...` in the service accounts list
- Click the **3-dot menu** on the right → **"Manage keys"**
- Click **"Add Key"** → **"Create new key"**
- Select **JSON** → Click **Create**
- A `.json` file downloads to your computer automatically

---

### 6. Place the File in Your Project
1. Rename the downloaded file to: **`google_vision.json`**
2. Move it into: **`backend/credentials/`**

Final result:
```
backend/credentials/google_vision.json   ✅
```

---

### 7. Restart the Backend
```bash
# Stop the server with Ctrl+C, then:
uvicorn main:app --reload --port 8000
```

---

### 8. Verify It's Working
Open this URL in your browser:
**http://127.0.0.1:8000/ocr-status**

You should see:
```json
{
  "ocr_engine": "Google Cloud Vision API ✅",
  "credentials_file_found": true
}
```

If you see `credentials_file_found: false`, the file is in the wrong place or has the wrong name.

---

## How the OCR Code Works (Plain English)

**File:** `backend/utils/ocr.py`

```python
# Step 1: Check if credentials file exists
if os.path.isfile("backend/credentials/google_vision.json"):
    use_google_vision()   # ← uses your key

# Step 2: No key? Try pdfplumber for PDFs
elif file_is_pdf:
    use_pdfplumber()      # ← works for digital PDFs

# Step 3: Last resort — local Tesseract OCR
else:
    use_tesseract()       # ← works offline, lower quality
```

**For PDFs**, Google Vision uses `annotate_file()` which reads the PDF directly — no conversion needed, reads up to 5 pages.

**For images** (PNG/JPG), Google Vision uses `document_text_detection()` which is tuned for dense printed text like medical reports and lab forms.

---

## What the Key File Looks Like

When you open `google_vision.json` it will look like this:
```json
{
  "type": "service_account",
  "project_id": "curetech-ocr",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----\n",
  "client_email": "curetech-vision@curetech-ocr.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token"
}
```
This is normal — keep this file private. Never commit it to GitHub.

---

## Add to .gitignore (Important if using Git)

Open `backend/.gitignore` (or create it) and add:
```
credentials/google_vision.json
uploads/
venv/
__pycache__/
```

---

## Pricing (You Won't Be Charged for Testing)

| Usage | Cost |
|-------|------|
| First 1,000 pages/month | **FREE** |
| 1,001–5,000,000 pages | $1.50 per 1,000 |

A typical blood report PDF = 1–2 pages. You can process ~500 reports/month for free.

---

## Common Errors and Fixes

### "credentials_file_found: false" at /ocr-status
The file is missing or misnamed. Check:
- File is named exactly `google_vision.json`
- File is inside `backend/credentials/` folder
- Not inside a subfolder of credentials

### "Cloud Vision API has not been enabled"
Go back to Step 3 and enable the API in your Google project.

### "Permission denied"
The service account doesn't have the Vision role.
Go to IAM & Admin → Service Accounts → your account → permissions → add "Cloud Vision AI User".

### ImportError: google.cloud.vision not found
```bash
pip install google-cloud-vision
```

### Works on images but not PDFs
Make sure you installed: `pip install google-cloud-vision` version 3.x or higher.

---

## Summary

| What to do | Where |
|------------|-------|
| Download JSON key from Google Cloud | Step 4–5 above |
| Rename file to `google_vision.json` | Your downloads folder |
| Place it in this exact folder | `backend/credentials/` |
| Restart backend | `uvicorn main:app --reload --port 8000` |
| Confirm it works | `http://127.0.0.1:8000/ocr-status` |

