from datetime import datetime
from typing import Literal, Optional, List
from pydantic import BaseModel, EmailStr, Field


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
    bio: str | None = None
    city: str | None = None
    birthday: str | None = None
    tags: List | None = None
    avatar_url: str | None = None
    is_private: bool | None = None


class EventCreateRequest(BaseModel):
    title: str
    description: str
    location: str
    start_timestamptz: datetime
    end_timestamptz: datetime
    tags: List[str]
    by_group: bool


class GroupCreate(BaseModel):
    name: str
    description: Optional[str] = None
    tags: Optional[List[str]] = None
    location: Optional[str] = None
    avatar_url: Optional[str] = None


class GroupUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    avatar_url: Optional[str] = None
    tags: Optional[List[str]] = None
    is_private: Optional[bool] = None
