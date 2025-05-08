from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.authentication_and_profile.register import register_router
from api.authentication_and_profile.login import login_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(register_router)
app.include_router(login_router)
