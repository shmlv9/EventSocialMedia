from passlib.context import CryptContext
from fastapi import HTTPException, status
from .database import supabase
from pydantic import BaseModel, EmailStr
from typing import Optional

# Настройки хеширования
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class UserRegister(BaseModel):
    email: EmailStr
    password: str
    username: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


async def register_user(user_data: UserRegister):
    # Проверка существующего пользователя
    existing_user = supabase.table("users") \
        .select("id") \
        .eq("email", user_data.email) \
        .execute()

    if existing_user.data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Хеширование пароля
    hashed_password = get_password_hash(user_data.password)

    # Создание пользователя
    new_user = {
        "email": user_data.email,
        "hashed_password": hashed_password,
        "username": user_data.username
    }

    try:
        result = supabase.table("users").insert(new_user).execute()
        return result.data[0]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


async def authenticate_user(email: str, password: str):
    user = supabase.table("users") \
        .select("*") \
        .eq("email", email) \
        .execute()

    if not user.data:
        return False

    db_user = user.data[0]
    if not verify_password(password, db_user["hashed_password"]):
        return False

    return db_user