from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.authentication_and_profile.register import register_router
from api.authentication_and_profile.login import login_router
from api.authentication_and_profile.profile import profile_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(register_router)
app.include_router(login_router)
app.include_router(profile_router)
