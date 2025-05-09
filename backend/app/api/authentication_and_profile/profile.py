from fastapi import APIRouter, Depends, HTTPException
from api.utils.supabase_client import supabase_client
from api.utils.functions import get_current_user_id
from api.authentication_and_profile.models import ProfileUpdateRequest

profile_router = APIRouter()


@profile_router.get('user/me')
def get_me(user_id: int = Depends(get_current_user_id)):
    return user_id


@profile_router.patch("/user/profile")
def update_profile(
        profile_data: ProfileUpdateRequest,
        user_id: int = Depends(get_current_user_id)
):
    update_data = {k: v for k, v in profile_data.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No data provided for update")

    supabase_client.table("users").update(update_data).eq("id", user_id).execute()

    return {"msg": "Profile updated successfully"}


@profile_router.delete("/user/profile")
def delete_profile(user_id: int = Depends(get_current_user_id)):
    supabase_client.table("users").delete().eq("id", user_id).execute()

    return {"msg": "Profile deleted successfully"}


@profile_router.get("/user/profile/{user_id}")
def get_profile(user_id: int, current_user_id: int = Depends(get_current_user_id)):
    if user_id != current_user_id:
        result = supabase_client.table("users").select(
            "first_name, last_name, city, birthday"
        ).eq("id", user_id).execute().data
    else:
        result = supabase_client.table("users").select(
            "id, email, phone_number, first_name, last_name, city, birthday, tags"
        ).eq("id", user_id).execute().data

    if not result:
        raise HTTPException(status_code=404, detail="User not found")

    if user_id == current_user_id:
        user_info = result[0]
        user_info.pop("hashed_password", None)
        user_info.pop("created_at", None)
        user_info.pop("avatar_url", None)

        return user_info
    else:
        return result[0]
