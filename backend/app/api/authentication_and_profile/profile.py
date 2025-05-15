from api.utils.models import ProfileUpdateRequest
from api.utils.functions import get_current_user_id, get_avatar, generate_unique_filename
from api.utils.supabase_client import supabase_client, AVATAR_BUCKET
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from fastapi.responses import JSONResponse

profile_router = APIRouter(
    tags=["profile"],
    prefix="/user/profile",
)


@profile_router.get('/me')
def get_me(user_id: int = Depends(get_current_user_id)):
    return user_id


@profile_router.patch("")
def update_profile(
        profile_data: ProfileUpdateRequest,
        user_id: int = Depends(get_current_user_id)
):
    update_data = {k: v for k, v in profile_data.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No data provided for update")

    supabase_client.table("users").update(update_data).eq("id", user_id).execute()

    return {"msg": "Profile updated successfully"}


@profile_router.delete("")
def delete_profile(user_id: int = Depends(get_current_user_id)):
    supabase_client.table("users").delete().eq("id", user_id).execute()

    return {"msg": "Profile deleted successfully"}


@profile_router.get("/{user_id}")
def get_profile(user_id: int, current_user_id: int = Depends(get_current_user_id)):
    if user_id != current_user_id:
        result = supabase_client.table("users").select(
            "first_name, last_name, city, birthday, avatar_url"
        ).eq("id", user_id).execute().data
    else:
        result = supabase_client.table("users").select(
            "id, email, phone_number, first_name, last_name, city, birthday, tags, avatar_url"
        ).eq("id", user_id).execute().data

    if not result:
        raise HTTPException(status_code=404, detail="User not found")

    user_info = result[0]

    friends_response = supabase_client.table("friends").select("id").or_(
        f"sender_id.eq.{user_id},recipient_id.eq.{user_id}"
    ).eq("status", True).execute().data
    user_info["friends_count"] = len(friends_response)

    if user_id != current_user_id:
        friendship = supabase_client.table("friends") \
            .select("recipient_id, sender_id, status").or_(
            f"and(sender_id.eq.{user_id},recipient_id.eq.{current_user_id}),and(sender_id.eq.{current_user_id},"
            f"recipient_id.eq.{user_id})"
        ).execute().data

        if not friendship:
            user_info["friendship_status"] = "not_in_friends"
        else:
            record = friendship[0]
            if record["status"] is True:
                user_info["friendship_status"] = "in_friends"
            elif record["recipient_id"] == current_user_id:
                user_info["friendship_status"] = "application_received"
            else:
                user_info["friendship_status"] = "application_sent"

        return user_info

    user_info.pop("hashed_password", None)
    user_info.pop("created_at", None)

    return user_info


@profile_router.patch("/avatar")
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