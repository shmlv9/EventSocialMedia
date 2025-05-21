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

    return response


@search_router.get("/groups/")
def search_groups(
        query: str = Query(..., min_length=1),
        _: int = Depends(get_current_user_id)
):

    name_results = supabase_client.table("groups").select("*") \
        .ilike("name", f"%{query}%").execute().data

    other_results = supabase_client.table("groups").select("*") \
        .not_.in_("id", [g['id'] for g in name_results]) \
        .or_(f"name.ilike.%{query}%,description.ilike.%{query}%") \
        .execute().data

    result = name_results + other_results

    return result
