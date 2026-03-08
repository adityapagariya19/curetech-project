from fastapi import APIRouter, HTTPException, Depends
from schemas.user import UserSignup, UserLogin
from utils.auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
)

router = APIRouter(tags=["Auth"])

fake_users_db = {}

@router.post("/signup")
def signup(user: UserSignup):
    if user.email in fake_users_db:
        raise HTTPException(status_code=400, detail="Email already registered")

    fake_users_db[user.email] = {
        "name": user.name,
        "email": user.email,
        "password": hash_password(user.password),
        "phone": "",
        "age": "",
        "address": "",
        "blood": "",
    }

    return {"message": "Signup successful"}

@router.post("/login")
def login(user: UserLogin):
    db_user = fake_users_db.get(user.email)

    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/profile")
def profile(email: str = Depends(get_current_user)):
    return fake_users_db[email]

@router.put("/profile")
def update_profile(
    updated: dict,
    email: str = Depends(get_current_user)
):
    fake_users_db[email].update(updated)
    return {"message": "Profile updated"}
