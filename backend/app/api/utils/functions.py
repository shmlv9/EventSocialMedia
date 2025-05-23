import hashlib
from datetime import datetime, timedelta
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from api.utils.supabase_client import supabase_client
import uuid

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


security = HTTPBearer()


def get_current_user_id(
        credentials: HTTPAuthorizationCredentials = Depends(security),
) -> int:
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload",
            )
        return int(user_id)

    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )


def check_user_exists(user_id: int):
    response = supabase_client.table("users").select("id").eq("id", user_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="User not found")

def generate_unique_filename(user_id: str, original_filename: str) -> str:
    """Генерация уникального имени файла"""
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    unique_id = uuid.uuid4().hex[:6]
    file_ext = original_filename.split(".")[-1]
    return f"{user_id}_{timestamp}_{unique_id}.{file_ext}"

def get_avatar(user_id):
    """Эндпоинт для получения ссылки на аватар по user_id"""
    user_data = supabase_client.table('users').select("avatar_url").eq("id", user_id).execute()

    if not user_data.data or not user_data.data[0].get("avatar_url"):
        return None

    avatar_url = user_data.data[0]["avatar_url"]

    return avatar_url
