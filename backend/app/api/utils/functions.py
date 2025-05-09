import hashlib
from datetime import datetime, timedelta
from typing import Optional
from fastapi import HTTPException, Header, status, Cookie, Depends
from fastapi.security import HTTPBearer
from jose import jwt, JWTError
from api.utils.supabase_client import supabase_client

from config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES


def normalize_phone_number(phone_number: str) -> str:
    phone_number = ''.join(filter(str.isdigit, phone_number))

    if phone_number.startswith("7"):
        phone_number = "8" + phone_number[1:]

    return phone_number


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode('utf-8')).hexdigest()


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


async def get_current_user_id(
        authorization: Optional[str] = Header(None),
) -> int:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    jwt_token = authorization.split(" ")[1]

    try:
        payload = jwt.decode(jwt_token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if not email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload",
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    response = supabase_client.table("users").select("id").eq("email", email).execute()
    user_data = response.data

    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return user_data[0]["id"]
