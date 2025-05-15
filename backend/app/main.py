from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.authentication_and_profile.register import register_router
from api.authentication_and_profile.login import login_router
from api.authentication_and_profile.profile import profile_router
from api.friends.friends import friends_router
from api.global_search.search import search_router
from api.events.events import events_router
from api.groups.groups import groups_router

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
app.include_router(profile_router)
app.include_router(friends_router)
app.include_router(search_router)
app.include_router(events_router)
app.include_router(groups_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
