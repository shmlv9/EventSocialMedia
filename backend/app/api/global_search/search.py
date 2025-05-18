from api.utils.functions import get_current_user_id
from api.utils.supabase_client import supabase_client
from fastapi import APIRouter, Depends, Query

search_router = APIRouter(
    prefix='/search',
    tags=['search']
)


@search_router.get("/users/")
def search_users(
        query: str = Query(..., min_length=1),
        _: int = Depends(get_current_user_id)):
    response = supabase_client.table("users").select(
        "id, first_name, last_name, avatar_url"
    ).or_(
        f"first_name.ilike.{query}%,last_name.ilike.{query}%"
    ).execute().data

    return {"results": response}


@search_router.get("/groups/")
def search_groups(
        query: str = Query(..., min_length=1),
        _: int = Depends(get_current_user_id)):
    results = supabase_client.table("groups").select("*") \
        .ilike("name", f"{query}%").execute().data
    return results
