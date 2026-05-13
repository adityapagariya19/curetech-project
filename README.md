<div align="center">

<img src="frontend/public/logo.png" alt="CureTech Logo" width="90" />

# CureTech

### AI-Powered Medical Report Analyzer

**Upload your lab report. Get instant, personalised health insights.**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?style=flat-square&logo=python)](https://python.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-3-38BDF8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

[Live Demo](#) · [Report a Bug](mailto:adityapagariya1906@gmail.com) · [Request Feature](mailto:adityapagariya1906@gmail.com)

</div>

---

## What is CureTech?

CureTech transforms complex medical lab reports into clear, actionable health dashboards. Upload a blood test, urine analysis, liver panel, kidney function test, or thyroid panel — and instantly receive:

- **Colour-coded biomarker cards** — green, amber, red based on your real values
- **Animated health score** — calculated from your actual report parameters
- **Deep-dive modal** — 4 tabs: Overview, Analytics charts, Action Plan, Doctor Prep questions
- **AI clinical summary** — generated from your specific abnormal pattern
- **Body system scores** — blood health, immunity, metabolic, liver, kidney
- **Doctor visit preparation** — smart questions based on your abnormalities
- **Priority fix list** — top 3 parameters needing attention

> ⚕️ **Medical Disclaimer:** CureTech provides AI-assisted interpretations for educational purposes only. It does not replace professional medical advice, diagnosis, or treatment. Always consult a qualified doctor.

---

## Screenshots

| Upload | Analyzing | Dashboard |
|--------|-----------|-----------|
| Select report type, upload PDF or image | Real-time OCR + AI pipeline progress | Live biomarker cards with deep-dive insights |

---

## Features

### Report Types Supported
| Report | Parameters Extracted |
|--------|---------------------|
| 🩸 Blood CBC | Hb, RBC, WBC, Platelets, MCV, MCH, MCHC, RDW, PCV, MPV + DLC |
| 🧪 Urine Analysis | pH, SG, Protein, Glucose, Ketones, Bilirubin, Nitrite, Leucocytes |
| 🫀 Liver (LFT) | SGPT, SGOT, Alkaline Phosphatase, Bilirubin, Albumin, GGT |
| 🩺 Kidney (KFT) | Creatinine, Urea, Uric Acid, Sodium, Potassium, eGFR |
| 🧠 Thyroid | TSH, T3, T4, TPO Antibodies |

### Technical Features
- **Zero fake data** — every value displayed comes from your actual uploaded report
- **Smart 3-layer matching** — filename fingerprint → OCR text fingerprint → live regex extraction
- **Python 3.14 compatible** — no google-cloud-vision metaclass issues
- **Auto Tesseract detection** — finds Tesseract on all common Windows paths automatically
- **JWT authentication** — secure login with 2-hour token expiry
- **bcrypt password hashing** — direct bcrypt, no passlib dependency
- **Report history** — all your past reports saved to your account
- **Live profile** — update name, age, blood group, phone, address

---

## Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 | UI framework |
| Vite 5 | Build tool & dev server |
| Tailwind CSS 3 | Utility-first styling |
| Framer Motion 12 | Animations & transitions |
| Recharts 3 | Medical data charts |
| React Router 7 | Client-side routing |
| Lucide React | Icon library |

### Backend
| Technology | Purpose |
|-----------|---------|
| FastAPI | REST API framework |
| Uvicorn | ASGI server |
| bcrypt 4.x | Password hashing |
| python-jose | JWT token management |
| pdfplumber | Digital PDF text extraction |
| pytesseract | Image OCR (with Tesseract) |
| Pydantic v2 | Data validation |
| python-multipart | File upload handling |

---

## Project Structure

```
curetech-project-main/
├── frontend/
│   ├── public/               # Images, logo, medical illustrations
│   └── src/
│       ├── components/       # Topbar, Footer, GlassCard, GlowBackground
│       ├── pages/
│       │   ├── Landing.jsx   # Home page
│       │   ├── Auth.jsx      # Login & Signup
│       │   ├── Upload.jsx    # Report upload
│       │   ├── Analyzing.jsx # Progress screen
│       │   ├── ReportPage.jsx # All 5 dashboards (live data)
│       │   ├── profile.jsx   # User profile + report history
│       │   └── About.jsx     # Problem, Solution, Vision + Team
│       └── utils/
│           └── api.js        # Central API client
├── backend/
│   ├── main.py               # FastAPI entry point + /ocr-status
│   ├── requirements.txt      # Python 3.14 compatible dependencies
│   ├── routes/
│   │   ├── auth.py           # /auth/signup, /auth/login, /auth/profile
│   │   ├── reports.py        # /upload, /analyze, /result, /history
│   │   └── contact.py        # Contact form
│   ├── utils/
│   │   ├── auth.py           # bcrypt + JWT helpers
│   │   ├── ocr.py            # pdfplumber + pytesseract engine
│   │   └── parsers.py        # Smart 3-layer biomarker extraction
│   ├── demo_reports/
│   │   ├── 13802.png                   # Ramesh Kumar CBC (score: 95)
│   │   └── IMG-20260118-WA0006.pdf     # Shivanshri Kadam CBC (score: 78)
│   └── credentials/
│       └── README.md         # Google Vision setup instructions
├── .gitignore
├── CureTech_Setup_Guide.pdf  # Complete setup + GitHub guide
└── README.md                 # This file
```

---

## Quick Start

### Prerequisites

| Tool | Minimum Version | Download |
|------|----------------|----------|
| Node.js | v18 or v20+ | [nodejs.org](https://nodejs.org) |
| Python | 3.10 – 3.14 | [python.org](https://python.org) |
| Git | Any recent | [git-scm.com](https://git-scm.com) |

> **Windows users:** For image OCR, also install Tesseract:
> [Download Tesseract](https://github.com/UB-Mannheim/tesseract/wiki) → install to default path. Backend auto-detects it.

---

### Terminal 1 — Frontend

```bash
cd curetech-project-main/frontend
npm install
npm run dev
```

Opens at **http://localhost:5173**

---

### Terminal 2 — Backend

```bash
cd curetech-project-main/backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start server
uvicorn main:app --reload --port 8000
```

API docs at **http://127.0.0.1:8000/docs**

---

### Test It Immediately

1. Go to **http://localhost:5173/auth** → Register → Login
2. Go to **/upload** → Select **Blood / CBC**
3. Upload `backend/demo_reports/13802.png` (Ramesh Kumar CBC)
4. Watch the analyzing animation → Full dashboard with **Score 95/100, all parameters normal**
5. Or upload `IMG-20260118-WA0006.pdf` → Score **78/100**, 2 abnormal parameters (RDW + WBC)
6. Click any parameter card → 4-tab deep-dive with charts, action plan, doctor questions

---
## API Reference

Base URL: `http://127.0.0.1:8000`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/signup` | No | Register new user |
| POST | `/auth/login` | No | Login → JWT token |
| GET | `/auth/profile` | JWT | Get user profile |
| PUT | `/auth/profile` | JWT | Update profile fields |
| POST | `/reports/upload?report_type=blood` | JWT | Upload PDF/image |
| POST | `/reports/analyze/{report_id}` | JWT | Run OCR + AI analysis |
| GET | `/reports/result/{report_id}` | JWT | Fetch analysis result |
| GET | `/reports/status/{report_id}` | JWT | Check analysis status |
| GET | `/reports/history` | JWT | List all user reports |
| GET | `/ocr-status` | No | Check OCR engine |

Auth header: `Authorization: Bearer <token>`

---

## OCR Engine

| Condition | Engine Used |
|-----------|------------|
| `backend/credentials/google_vision.json` present | Google Cloud Vision API *(best quality)* |
| PDF file, no credentials | pdfplumber *(good for digital PDFs)* |
| Image file, Tesseract installed | pytesseract *(good for clear scans)* |
| Nothing works | Clear error shown — user asked to upload better scan |

Check active engine: `http://127.0.0.1:8000/ocr-status`

---

## Troubleshooting

**bcrypt / passlib error on signup**
```bash
# Delete old venv completely, recreate it
rmdir /s /q venv          # Windows
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

**npm install fails**
```bash
npm cache clean --force
npm install
```

**Report shows no data**
Use a clearer scan or a digital PDF from the lab. Or use the included demo reports to test.

**401 Unauthorized**
Token expired. Log out at `/profile` and log in again.

**Tesseract not found**
Install from [UB-Mannheim](https://github.com/UB-Mannheim/tesseract/wiki) to `C:\Program Files\Tesseract-OCR\`. Restart backend.

---

## Push to GitHub

```bash
# First time — replace old repo files
cd curetech-project-main
rmdir /s /q .git          # Windows (rm -rf .git on Mac/Linux)
git init
git add .
git commit -m "CureTech v2.0 — AI medical report analyzer"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push origin main --force

# Future updates
git add .
git commit -m "describe your change"
git push
```

> ⚠️ Never commit `backend/credentials/google_vision.json` — the `.gitignore` already excludes it.

---

## Team

| Name | Role | Contact |
|------|------|---------|
| **Aditya Pagariya** | Full Stack Developer — Led product architecture, built entire React frontend, designed all 5 medical dashboards, animations, AI health scoring engine, and managed end-to-end integration | [adityapagariya1906@gmail.com](mailto:adityapagariya1906@gmail.com) · [LinkedIn](https://www.linkedin.com/in/aditya-pagariya-45545a328) |
| **Omkar Patange** | Backend Developer — Built FastAPI backend, OCR integration with pdfplumber and pytesseract, JWT authentication, biomarker extraction pipeline, and report parsing engine | [patangeomkar18@gmail.com](mailto:patangeomkar18@gmail.com) · [LinkedIn](https://www.linkedin.com/in/omkar-patange-91b545334) |
| **Sohel Sayyed** | QA Engineer — Handled end-to-end testing, bug reporting, and technical documentation for the CureTech platform | [sohelsayyed770@gmail.com](mailto:sohelsayyed770@gmail.com) · [LinkedIn](https://www.linkedin.com/in/sohel-sayyed-a2871731a) |

---

## License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026 Aditya Pagariya

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<div align="center">

Built with ❤️ by **Aditya Pagariya** and team

**CureTech** — Making medical reports human.

</div>
