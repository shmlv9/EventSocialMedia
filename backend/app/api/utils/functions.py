import hashlib
from datetime import datetime, timedelta

from jose import jwt

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
