from api.utils.functions import get_current_user_id
from api.utils.supabase_client import supabase_client
from fastapi import APIRouter, Depends, HTTPException

friends_router = APIRouter()


@friends_router.get("/user/{target_id}/friends")
def get_friends(target_id: int, current_user_id: int = Depends(get_current_user_id)):
    response = supabase_client.table("friends").select("*").or_(
        f"sender_id.eq.{target_id},recipient_id.eq.{target_id}"
    ).eq("status", True).execute().data

    if not response:
        return {"friends": []}

    friend_ids = []
    for record in response:
        if record["sender_id"] == target_id:
            friend_ids.append(record["recipient_id"])
        else:
            friend_ids.append(record["sender_id"])

    if not friend_ids:
        return {"friends": []}

    users_response = supabase_client.table("users").select(
        "id, first_name, last_name, avatar_url"
    ).in_("id", friend_ids).execute().data

    return {"friends": users_response}


@friends_router.get("/user/friend_requests")
def get_pending_requests(user_id: int = Depends(get_current_user_id)):
    response = supabase_client.table("friends").select("*").eq("recipient_id", user_id).eq("status",
                                                                                           False).execute().data

    pending_info = []
    for record in response:
        sender_id = record["sender_id"]
        user_data = supabase_client.table("users").select("first_name, last_name, avatar_url").eq("id",
                                                                                                  sender_id).execute().data
        if user_data:
            pending_info.append(user_data[0])

    return {"pending_requests": pending_info}


@friends_router.post("/user/friend_request/{target_id}")
def send_friend_request(target_id: int, user_id: int = Depends(get_current_user_id)):
    if user_id == target_id:
        raise HTTPException(status_code=400, detail="Cannot send friend request to yourself")

    existing_request = supabase_client.table("friends").select("*").match({
        "sender_id": user_id,
        "recipient_id": target_id
    }).execute().data

    if existing_request:
        raise HTTPException(status_code=400, detail="Friend request already sent or user is already a friend")

    supabase_client.table("friends").insert({
        "sender_id": user_id,
        "recipient_id": target_id,
        "status": False
    }).execute()

    return {"msg": "Friend request sent successfully"}


@friends_router.post("/user/friend_request/{sender_id}/accept")
def accept_friend_request(sender_id: int, user_id: int = Depends(get_current_user_id)):
    response = supabase_client.table("friends").select("*").eq("sender_id", sender_id).eq("recipient_id", user_id).eq(
        "status", False).execute().data

    if not response:
        raise HTTPException(status_code=404, detail="Friend request not found")

    supabase_client.table("friends").update({"status": True}).eq("sender_id", sender_id).eq("recipient_id",
                                                                                            user_id).execute()

    return {"msg": "Friend request accepted"}


@friends_router.delete("/user/friend_request/{sender_id}/reject")
def reject_friend_request(sender_id: int, user_id: int = Depends(get_current_user_id)):
    response = supabase_client.table("friends").select("*").eq("sender_id", sender_id).eq("recipient_id", user_id).eq(
        "status", False).execute().data

    if not response:
        raise HTTPException(status_code=404, detail="Friend request not found")

    supabase_client.table("friends").delete().eq("sender_id", sender_id).eq("recipient_id", user_id).execute()

    return {"msg": "Friend request rejected"}


@friends_router.delete("/user/friend/{friend_id}")
def remove_friend(friend_id: int, user_id: int = Depends(get_current_user_id)):
    response = supabase_client.table("friends").select("*").or_(
        f"(sender_id.eq.{user_id},recipient_id.eq.{friend_id})",
        f"(sender_id.eq.{friend_id},recipient_id.eq.{user_id})"
    ).eq("status", True).execute().data

    if not response:
        raise HTTPException(status_code=404, detail="Friend relationship not found")

    supabase_client.table("friends").delete().or_(
        f"(sender_id.eq.{user_id},recipient_id.eq.{friend_id})",
        f"(sender_id.eq.{friend_id},recipient_id.eq.{user_id})"
    ).execute()

    return {"msg": "Friend removed"}
