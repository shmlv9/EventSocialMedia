import hashlib
from datetime import datetime, timedelta
from fastapi import HTTPException, Header
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


def get_current_user_id(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid token header")

    token = authorization.split(" ")[1]

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Token payload invalid")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = supabase_client.table("users").select("id").eq("email", email).execute().data
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user[0]["id"]
