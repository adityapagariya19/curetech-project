# CureTech — Complete Setup Guide
**Version 2.0 — Premium AI Healthcare Report Analyzer**

---

## What's Inside

```
curetech-project-main/
├── frontend/          ← React + Vite + Tailwind (run first)
├── backend/           ← FastAPI Python server
│   ├── credentials/   ← Put Google Vision JSON key here
│   └── requirements.txt
└── SETUP_GUIDE.md     ← You are here
```

---

## Prerequisites — Install These First

| Tool | Version | Download |
|------|---------|----------|
| Node.js | 18 or higher | https://nodejs.org |
| Python | 3.10 or higher | https://python.org |
| pip | bundled with Python | — |

Check versions:
```bash
node -v        # should show v18+
python --version   # should show 3.10+
```

---

## PART 1 — Run the Frontend (Takes 2 minutes)

### Step 1 — Open terminal, go to frontend folder

```bash
cd curetech-project-main/frontend
```

### Step 2 — Install packages

```bash
npm install
```

This downloads all dependencies (React, Framer Motion, Recharts, etc). Takes 1–2 minutes first time.

### Step 3 — Start the frontend

```bash
npm run dev
```

You will see:
```
  VITE v5.x.x  ready in 300ms
  ➜  Local:   http://localhost:5173/
```

### Step 4 — Open in browser

Go to: **http://localhost:5173**

**The frontend is fully working now, no backend needed for demo mode.**

---

## PART 2 — Run the Backend (For real file uploads)

### Step 1 — Open a NEW terminal tab, go to backend folder

```bash
cd curetech-project-main/backend
```

### Step 2 — Create a Python virtual environment

**Mac/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

You will see `(venv)` at the start of your terminal line. That means it's activated.

### Step 3 — Install Python packages

```bash
pip install -r requirements.txt
```

This installs FastAPI, pdfplumber, pytesseract, Google Vision SDK, etc.

If you get errors on any package, install individually:
```bash
pip install fastapi uvicorn python-multipart passlib[bcrypt] python-jose pdfplumber pillow
```

### Step 4 — Start the backend server

```bash
uvicorn main:app --reload --port 8000
```

You will see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

### Step 5 — Verify backend is running

Open: **http://127.0.0.1:8000/docs**

You should see the FastAPI Swagger UI with all endpoints listed.

---

## PART 3 — Using the App (Demo Mode, No Login Needed)

1. Open **http://localhost:5173**
2. Click **Upload** in the navbar
3. Select report type (Blood, Urine, Liver, Kidney, Thyroid)
4. Upload any PDF or image file
5. App shows the analyzing animation, then opens the report dashboard
6. **Click any parameter card** to see the full deep-dive: charts, cure plan, doctor questions, AI insight

> **Demo Mode:** If you are not logged in, clicking Analyze navigates directly to the sample report dashboard with full data displayed. This lets you explore the complete UI without backend.

---

## PART 4 — Enable Real OCR (Optional)

The app works in demo mode without OCR. To enable real report parsing:

### Option A — Google Cloud Vision (Best Quality)

1. Go to https://console.cloud.google.com
2. Create a new project
3. Search and enable **Cloud Vision API**
4. Go to IAM & Admin → Service Accounts → Create
5. Role: **Cloud Vision AI User**
6. Keys → Add Key → JSON → Download the file
7. Rename the downloaded file to `google_vision.json`
8. Place it at: `backend/credentials/google_vision.json`
9. Restart the backend (`uvicorn main:app --reload --port 8000`)

### Option B — Tesseract (Free, Local, Offline)

**Mac:**
```bash
brew install tesseract
```

**Ubuntu/Debian:**
```bash
sudo apt-get install tesseract-ocr
```

**Windows:**
- Download installer from: https://github.com/UB-Mannheim/tesseract/wiki
- Install to default path
- Add to system PATH

No configuration needed — backend auto-detects it.

---

## PART 5 — All Available Report Pages

| Report Type | URL | Biomarkers Covered |
|-------------|-----|--------------------|
| Blood CBC | /blood-report | Hb, RBC, WBC, Platelets, MCV, MCH, MCHC, RDW, PCV, MPV |
| Urine Analysis | /urine-report | pH, Color, Protein, Glucose, Ketones, Nitrite, Leucocytes, Bilirubin |
| Liver (LFT) | /liver-report | SGPT, SGOT, Alkaline Phosphatase, Bilirubin, Albumin, GGT |
| Kidney (KFT) | /kidney-report | Creatinine, Urea, Uric Acid, Sodium, Potassium, eGFR |
| Thyroid | /thyroid-report | TSH, T3, T4, TPO Antibodies |

You can go directly to any report page without uploading.

---

## PART 6 — Account System (Optional)

The app has a built-in auth system.

**Register:**
- Go to http://localhost:5173/auth
- Click Sign Up, enter name/email/password
- Logged-in users can upload reports that get processed by the backend

**Without account:**
- Full demo mode — all 5 report dashboards accessible directly
- No file processing, but all UI, charts, insights work perfectly

---

## Troubleshooting

### "npm install" fails
```bash
npm cache clean --force
npm install
```

### "pip install" fails
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### Port 5173 or 8000 already in use

Frontend on different port:
```bash
npm run dev -- --port 3000
```

Backend on different port:
```bash
uvicorn main:app --reload --port 8001
```
Then update the fetch URL in Upload.jsx from `8000` to `8001`.

### Backend won't start — module not found
Make sure venv is activated:
```bash
# Mac/Linux
source venv/bin/activate

# Windows
venv\Scripts\activate
```

### Google Vision credentials error
Make sure the file is exactly at: `backend/credentials/google_vision.json`
(Not inside a subfolder, not renamed differently)

### Recharts import error in browser
```bash
cd frontend
npm install recharts@latest
npm run dev
```

---

## Quick Reference — Commands

```bash
# FRONTEND (Terminal 1)
cd curetech-project-main/frontend
npm install
npm run dev
# → http://localhost:5173

# BACKEND (Terminal 2)
cd curetech-project-main/backend
python3 -m venv venv
source venv/bin/activate    # Mac/Linux
# OR: venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# → http://127.0.0.1:8000/docs
```

---

## Feature Tour

Once running, here is what to explore:

1. **Landing page** — Premium hero with animations
2. **Upload page** — Select report type → upload file → analyzing animation
3. **Report dashboards:**
   - Health Score ring at top
   - Risk Score + off-parameter count
   - Priority Fix list (top 3 abnormal)
   - AI Summary + Plain Language mode
   - Body System scores bar chart
   - Full biomarker grid with color-coded cards
   - **Click any card** → Deep-dive modal opens with:
     - Value vs Range bar chart
     - Trend & Forecast line chart
     - Body System Impact radar chart
     - Deviation Risk donut chart
     - Why It Matters explanation
     - Foods to eat / avoid
     - Lifestyle recommendations
     - Estimated improvement window
     - Smart doctor questions

---

Built with: React 18 · Vite · Tailwind CSS · Framer Motion · Recharts · FastAPI · Google Cloud Vision OCR
