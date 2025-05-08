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
