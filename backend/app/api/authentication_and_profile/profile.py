from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from fastapi.responses import JSONResponse
from api.utils.supabase_client import supabase_client, AVATAR_BUCKET
from api.utils.functions import get_current_user_id, generate_unique_filename
from api.authentication_and_profile.models import ProfileUpdateRequest
from datetime import datetime
from typing import Optional

profile_router = APIRouter()



@profile_router.get('/user/me')
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


@profile_router.patch("/user/avatar/")
async def upload_avatar(user_id: int = Depends(get_current_user_id), file: UploadFile = File(...)):
    """
    Эндпоинт для загрузки аватара и сохранения ссылки в БД

    Параметры:
    - user_id: ID пользователя, для которого загружается аватар
    - file: Файл аватара
    """
    try:
        user_exists = supabase_client.table('users').select("id").eq("id", user_id).execute()
        if not user_exists.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        filename = generate_unique_filename(user_id, file.filename)

        contents = await file.read()

        if not file.content_type.startswith('image/'):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only image files are allowed"
            )

        supabase_client.storage.from_(AVATAR_BUCKET).upload(
            file=contents,
            path=filename,
            file_options={"content-type": file.content_type}
        )

        avatar_url = supabase_client.storage.from_(AVATAR_BUCKET).get_public_url(filename)

        update_response = supabase_client.table('users').update(
            {"avatar_url": avatar_url}
        ).eq("id", user_id).execute()

        if not update_response.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update user avatar"
            )

        return JSONResponse({
            "message": "Avatar uploaded and updated successfully",
            "avatar_url": avatar_url,
            "user_id": user_id
        }, status_code=status.HTTP_200_OK)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error uploading avatar: {str(e)}"
        )

@profile_router.get("/user/avatar/")
async def get_avatar(user_id: int = Depends(get_current_user_id)):
    """Эндпоинт для получения аватара по user_id (перенаправляет на avatar_url из БД)"""
    try:
        user_data = supabase_client.table('users').select("avatar_url").eq("id", user_id).execute()

        if not user_data.data or not user_data.data[0].get("avatar_url"):
            raise HTTPException(status_code=404, detail="Avatar not found")

        avatar_url = user_data.data[0]["avatar_url"]

        return avatar_url

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
