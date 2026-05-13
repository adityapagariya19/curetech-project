# 🩺 CureTech

<div align="center">

<img src="frontend/public/logo.png" width="120" alt="CureTech Logo" />

# AI-Powered Medical Report Analyzer

### Transforming Complex Medical Reports into Human-Friendly Health Insights

CureTech is a modern full-stack healthcare intelligence platform that uses **AI**, **OCR**, and **interactive analytics** to simplify medical laboratory reports into visually understandable dashboards.

---

![React](https://img.shields.io/badge/React-18-20232A?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-000000?style=for-the-badge&logo=framer)

<br/>

## 🚀 Live Demo

```bash
https://curetech-project.vercel.app/
```

</div>

---

# 📌 Introduction

Medical reports are often difficult for non-medical users to understand.  
CureTech bridges this gap using intelligent report processing and AI-driven analytics.

Users can upload laboratory reports such as:

- Blood Test Reports (CBC)
- Liver Function Test (LFT)
- Kidney Function Test (KFT)
- Thyroid Reports
- Urine Analysis Reports

The platform extracts report data using OCR technologies and converts raw medical values into:

✅ AI-generated summaries  
✅ Visual biomarker dashboards  
✅ Interactive analytics  
✅ Health scores  
✅ Smart abnormality detection  
✅ Actionable health insights  

---

# ✨ Core Features

## 🧠 AI-Powered Health Analysis

- AI-generated medical summaries
- Intelligent abnormality detection
- Personalized health insights
- Dynamic health scoring system
- Smart interpretation of biomarkers

---

## 📊 Advanced Medical Dashboards

- Animated health score cards
- Color-coded biomarkers
- Deep-dive analytics panels
- Interactive medical charts
- Responsive UI/UX experience

---

## 📄 OCR & Smart Parsing Engine

- PDF and image report uploads
- OCR-powered text extraction
- Smart parameter recognition
- Regex-based biomarker parsing
- Structured medical data mapping

---

## 🔐 Secure Authentication System

- JWT authentication
- bcrypt password hashing
- Protected API endpoints
- Secure session handling
- User profile management

---

## 📁 Report History & User Dashboard

- Persistent report storage
- Historical report tracking
- User profile dashboard
- Report access management

---

# 🧪 Supported Medical Reports

| Report Type | Parameters Supported |
|---|---|
| 🩸 Blood / CBC | Hb, RBC, WBC, Platelets, MCV, MCH, MCHC, RDW |
| 🫀 Liver Function Test | SGPT, SGOT, Bilirubin, Albumin, GGT |
| 🩺 Kidney Function Test | Creatinine, Urea, Uric Acid |
| 🧠 Thyroid Profile | TSH, T3, T4 |
| 🧪 Urine Analysis | Protein, Glucose, Ketones, pH |

---

# 🏗️ System Architecture

```text
User Upload
     ↓
OCR Processing Engine
     ↓
Medical Data Extraction
     ↓
AI Health Analysis
     ↓
Interactive Dashboard Generation
     ↓
User Insights & Recommendations
```

---

# ⚙️ Tech Stack

# Frontend

| Technology | Purpose |
|---|---|
| React 18 | UI Development |
| Vite | Frontend Build Tool |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| React Router DOM | Routing |
| Recharts | Data Visualization |
| Lucide React | Icons |

---

# Backend

| Technology | Purpose |
|---|---|
| FastAPI | API Framework |
| Python | Backend Logic |
| Uvicorn | ASGI Server |
| JWT | Authentication |
| bcrypt | Password Security |
| Pydantic | Validation |

---

# OCR & Processing

| Technology | Purpose |
|---|---|
| pdfplumber | PDF Extraction |
| pytesseract | OCR Processing |
| Regex Parsing | Biomarker Extraction |

---

# 📂 Project Structure

```bash
curetech-project-main/
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── utils/
│       ├── assets/
│       └── styles/
│
├── backend/
│   ├── routes/
│   ├── models/
│   ├── utils/
│   ├── services/
│   ├── credentials/
│   └── main.py
│
├── README.md
├── requirements.txt
└── .gitignore
```

---

# 🚀 Local Development Setup

# Prerequisites

Install the following:

- Node.js (v18+ recommended)
- Python (3.10+)
- Git

---

# 💻 Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend will run at:

```bash
http://localhost:5173
```

---

# 🖥️ Backend Setup

```bash
cd backend

python -m venv venv
```

## Activate Virtual Environment

### Windows

```bash
venv\Scripts\activate
```

### Mac/Linux

```bash
source venv/bin/activate
```

---

## Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Start Backend Server

```bash
uvicorn main:app --reload --port 8000
```

Backend will run at:

```bash
http://127.0.0.1:8000
```

---

# 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/signup` | Register new user |
| POST | `/auth/login` | Authenticate user |
| GET | `/auth/profile` | Fetch profile |
| PUT | `/auth/profile` | Update profile |
| POST | `/reports/upload` | Upload report |
| POST | `/reports/analyze/{report_id}` | Analyze report |
| GET | `/reports/result/{report_id}` | Fetch report result |
| GET | `/reports/history` | Fetch report history |

---

# 🎨 UI / UX Highlights

- Modern healthcare-inspired interface
- Smooth animations with Framer Motion
- Responsive design across devices
- Clean dashboard visualization
- Professional user experience

---

# 🔒 Security Features

- JWT-secured authentication
- Password hashing using bcrypt
- Protected backend endpoints
- Environment-based configuration
- Sensitive credentials excluded via `.gitignore`

---

# 📈 Future Scope

- 🤖 AI healthcare chatbot
- 📱 Mobile application
- 🌍 Multi-language support
- 🧑‍⚕️ Doctor consultation integration
- 📊 Advanced analytics engine
- ☁️ Cloud medical report storage

---

# 👨‍💻 Team & Contributors

| Name | Role | Contribution |
|---|---|---|
| **Aditya Pagariya** | Full Stack Developer | Frontend architecture, UI/UX, dashboard systems, integrations |
| **Omkar Patange** | Backend Developer | FastAPI backend, OCR pipeline, authentication, report processing |
| **Sohel Sayyed** | QA & Testing Engineer | Testing, debugging, documentation, validation |

---

# 📬 Contact & Profiles

## Aditya Pagariya
- 📧 Email: adityapagariya1906@gmail.com
- 🔗 LinkedIn: https://www.linkedin.com/in/aditya-pagariya-45545a328

---

## Omkar Patange
- 📧 Email: patangeomkar18@gmail.com
- 🔗 LinkedIn: https://www.linkedin.com/in/omkar-patange-91b545334

---

## Sohel Sayyed
- 📧 Email: sohelsayyed770@gmail.com
- 🔗 LinkedIn: https://www.linkedin.com/in/sohel-sayyed-a2871731a

---

# ⚠️ Medical Disclaimer

CureTech provides AI-assisted medical report analysis strictly for **educational and informational purposes**.

The platform does **not** replace professional medical advice, diagnosis, or treatment.

Always consult a qualified healthcare professional for medical concerns.

---

# ⭐ Vision

Our vision is to make healthcare reports more understandable, accessible, and interactive for everyone through the power of artificial intelligence and modern user experiences.

---

<div align="center">

❤️ Built by Team CureTech

Making Medical Reports Human-Friendly Through AI

</div>
