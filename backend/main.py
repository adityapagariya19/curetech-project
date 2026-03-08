from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import auth, contact, reports

app = FastAPI()

# 🔹 CORS (THIS FIXES OPTIONS ERROR)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite frontend
    allow_credentials=True,
    allow_methods=["*"],   # allows OPTIONS, POST, GET, etc
    allow_headers=["*"],
)

# 🔹 ROUTES
app.include_router(auth.router)
app.include_router(contact.router)
app.include_router(reports.router) 

@app.get("/")
def root():
    return {"status": "CureTech backend is running 🚀"}
