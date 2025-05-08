from datetime import timedelta

from config import SUPABASE_URL, SUPABASE_KEY, SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from fastapi import APIRouter, HTTPException
from supabase import create_client
from api.authentication_and_profile.models import LoginInput
from api.utils.functions import normalize_phone_number, hash_password, create_access_token

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
login_router = APIRouter()


@login_router.post("/user/login")
def login(user: LoginInput):
    if not user.email and not user.phone_number:
        raise HTTPException(status_code=400, detail="Provide either email or phone_number")

    if user.phone_number:
        user.phone_number = normalize_phone_number(user.phone_number)

    query = supabase.table("users").select("id, email, phone_number, hashed_password")

    if user.email:
        query = query.eq("email", user.email)
    elif user.phone_number:
        query = query.eq("phone_number", user.phone_number)

    response = query.execute()
    user_obj = response.data[0] if response.data else None

    if not user_obj:
        raise HTTPException(status_code=401, detail="User not found")

    hashed_pwd = hash_password(user.password)

    if hashed_pwd != user_obj["hashed_password"]:
        raise HTTPException(status_code=401, detail="Incorrect password")

    token_data = {"sub": user_obj["email"]}
    access_token = create_access_token(data=token_data, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))

    return {"access_token": access_token, "token_type": "bearer"}
