from typing import Literal
from pydantic import BaseModel, EmailStr


class RegisterRequest(BaseModel):
    email: EmailStr
    phone_number: str
    password: str
    first_name: str
    last_name: str
    birthday: str


class LoginInput(BaseModel):
    email: EmailStr | None = None
    phone_number: str | None = None
    password: str


class LoginExists(BaseModel):
    value_type: Literal["email", "phone_number"]
    value: str

class ProfileUpdateRequest(BaseModel):
    email: EmailStr | None = None
    phone_number: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    city: str | None = None
    birthday: str | None = None