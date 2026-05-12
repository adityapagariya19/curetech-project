# WHERE TO PUT YOUR GOOGLE VISION KEY
=============================================

Place your downloaded JSON file HERE, renamed to exactly:

    google_vision.json

Final path must be:
    backend/credentials/google_vision.json

That's the ONLY thing you need to do. The app detects it automatically.

=============================================
HOW TO GET THE KEY — Step by Step
=============================================

STEP 1 — Create a Google Cloud project
  → Go to: https://console.cloud.google.com
  → Click the project dropdown at the top
  → Click "New Project"
  → Give it any name, e.g. "curetech-ocr"
  → Click Create

STEP 2 — Enable the Vision API
  → In the search bar, type: Cloud Vision API
  → Click it, then click the blue "Enable" button
  → Wait ~10 seconds for it to activate

STEP 3 — Create a Service Account
  → In the left sidebar: IAM & Admin → Service Accounts
  → Click "+ Create Service Account" at the top
  → Name: curetech-vision  (anything works)
  → Click "Create and Continue"
  → Role: type "Cloud Vision" in the dropdown, select "Cloud Vision AI User"
  → Click Continue → Done

STEP 4 — Download the JSON Key
  → You'll see your new service account in the list
  → Click the 3-dot menu on the right → "Manage keys"
  → Click "Add Key" → "Create new key"
  → Select JSON → Click Create
  → A .json file downloads automatically to your computer

STEP 5 — Place the file here
  → Rename the downloaded file to:   google_vision.json
  → Move it into this folder:        backend/credentials/
  → Final path:                      backend/credentials/google_vision.json

STEP 6 — Restart the backend
  → Stop the uvicorn server (Ctrl+C)
  → Start it again: uvicorn main:app --reload --port 8000

STEP 7 — Verify it's working
  → Open: http://127.0.0.1:8000/ocr-status
  → You should see: "Google Cloud Vision API ✅"

=============================================
COST
=============================================

Google Vision API pricing (as of 2025):
  - First 1,000 pages/images per month: FREE
  - After that: ~$1.50 per 1,000 pages

For a personal/demo project, it stays free easily.

=============================================
WHAT THE JSON FILE LOOKS LIKE (for reference)
=============================================

{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN RSA PRIVATE KEY-----\n...",
  "client_email": "curetech-vision@your-project.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  ...
}

If your file looks like this, it's correct. Do NOT share this file publicly.
Add it to .gitignore if pushing to GitHub.

=============================================
WITHOUT GOOGLE VISION (DEMO MODE)
=============================================

If you don't place the file here:
  → PDFs: pdfplumber is used (works for digital PDFs)
  → Images: pytesseract is used (works for clear scans)
  → All report dashboards still work with sample demo data

