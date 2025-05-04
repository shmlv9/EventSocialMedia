from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from .core.auth import UserRegister, UserLogin, register_user, authenticate_user
from .core.database import supabase  # noqa (для инициализации)

app = FastAPI()

# Настройки CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/register")
async def register(user_data: UserRegister):
    user = await register_user(user_data)
    return {
        "message": "User created successfully",
        "user": {
            "email": user["email"],
            "username": user.get("username"),
            "id": user["id"]
        }
    }

@app.post("/login")
async def login(user_data: UserLogin):
    user = await authenticate_user(user_data.email, user_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {
        "message": "Login successful",
        "user": {
            "email": user["email"],
            "username": user.get("username"),
            "id": user["id"]
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)