from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from utils.auth import hash_password, verify_password, create_access_token, get_current_user
from datetime import datetime

router = APIRouter(prefix="/auth", tags=["Auth"])

# In-memory store (swap with a real DB in production)
users_db: dict = {}

class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class ProfileUpdateRequest(BaseModel):
    name: str | None = None
    phone: str | None = None
    age: str | None = None
    address: str | None = None
    blood: str | None = None
    gender: str | None = None

@router.post("/signup")
def signup(body: SignupRequest):
    if body.email in users_db:
        raise HTTPException(400, "Email already registered")
    users_db[body.email] = {
        "name": body.name,
        "email": body.email,
        "password": hash_password(body.password),
        "phone": "",
        "age": "",
        "address": "",
        "blood": "",
        "gender": "",
        "joinedAt": datetime.utcnow().isoformat(),
        "lastLogin": datetime.utcnow().isoformat(),
    }
    return {"message": "Signup successful"}

@router.post("/login")
def login(body: LoginRequest):
    user = users_db.get(body.email)
    if not user or not verify_password(body.password, user["password"]):
        raise HTTPException(401, "Invalid email or password")
    users_db[body.email]["lastLogin"] = datetime.utcnow().isoformat()
    token = create_access_token({"sub": body.email})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/profile")
def get_profile(email: str = Depends(get_current_user)):
    user = users_db.get(email)
    if not user:
        raise HTTPException(404, "User not found")
    return {k: v for k, v in user.items() if k != "password"}

@router.put("/profile")
def update_profile(body: ProfileUpdateRequest, email: str = Depends(get_current_user)):
    user = users_db.get(email)
    if not user:
        raise HTTPException(404, "User not found")
    updates = body.dict(exclude_none=True)
    users_db[email].update(updates)
    return {k: v for k, v in users_db[email].items() if k != "password"}
