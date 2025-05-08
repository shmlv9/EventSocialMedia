from fastapi import APIRouter, HTTPException
from api.authentication_and_profile.models import RegisterRequest
from api.utils.functions import normalize_phone_number, hash_password
from api.utils.supabase_client import supabase_client

register_router = APIRouter()


@register_router.post("/user/register")
def register(user: RegisterRequest):
    normalized_phone = normalize_phone_number(user.phone_number)

    existing_email = supabase_client.table("users").select("id").eq("email", user.email).execute().data
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already registered")

    existing_phone = supabase_client.table("users").select("id").eq("phone_number", normalized_phone).execute().data
    if existing_phone:
        raise HTTPException(status_code=400, detail="Phone number already registered")

    hashed_pwd = hash_password(user.password)

    supabase_client.table("users").insert({
        "email": user.email,
        "phone_number": normalized_phone,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "birthday": user.birthday,
        "hashed_password": hashed_pwd
    }).execute()

    return {"msg": "User registered successfully"}
