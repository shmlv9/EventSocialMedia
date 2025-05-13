from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from typing import List
from api.utils.supabase_client import supabase_client
from api.utils.functions import get_current_user_id, check_user_exists
from api.utils.models import GroupCreate, GroupUpdate

groups_router = APIRouter(prefix="/groups", tags=["groups"])


def check_group_exists(group_id: int):
    group = supabase_client.table("groups").select("id, creator_id").eq("id", group_id).execute().data
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    return group[0]


@groups_router.get("/search", response_model=List[dict])
def search_groups(query: str, user_id: int = Depends(get_current_user_id)):
    check_user_exists(user_id)

    results = supabase_client.table("groups").select("*") \
        .ilike("name", f"%{query}%").execute().data
    return results


@groups_router.post("/", response_model=dict)
def create_group(group: GroupCreate, user_id: int = Depends(get_current_user_id)):
    check_user_exists(user_id)

    new_group = supabase_client.table("groups").insert({
        "name": group.name,
        "description": group.description,
        "tags": group.tags,
        "avatar_url": group.avatar_url,
        "creator_id": user_id,
        "created_at": datetime.utcnow().isoformat()
    }).execute().data[0]

    supabase_client.table("group_members").insert({
        "user_id": user_id,
        "group_id": new_group["id"],
        "is_admin": True
    }).execute()

    return {"msg": "Group created successfully", "group_id": new_group["id"]}


@groups_router.get("/{group_id}", response_model=dict)
def get_group(group_id: int, user_id: int = Depends(get_current_user_id)):
    check_user_exists(user_id)
    check_group_exists(group_id)

    response = (supabase_client.table("groups")
        .select("*, users(id, first_name, last_name, avatar_url)")
        .eq("id", group_id)
        .single()
        .execute())

    if not response.data:
        raise HTTPException(status_code=404, detail="Group not found")

    data = response.data
    creator_info = data.pop("users", {})
    data["creator"] = creator_info
    return data


@groups_router.put("/{group_id}", response_model=dict)
def update_group(group_id: int, group: GroupUpdate, user_id: int = Depends(get_current_user_id)):
    group_data = check_group_exists(group_id)

    member = supabase_client.table("group_members").select("is_admin") \
        .match({"group_id": group_id, "user_id": user_id}).single().execute().data
    if not member or not member["is_admin"]:
        raise HTTPException(status_code=403, detail="Not authorized to edit group")

    update_data = {k: v for k, v in group.dict().items() if v is not None}
    supabase_client.table("groups").update(update_data).eq("id", group_id).execute()

    return {"msg": "Group updated successfully"}


@groups_router.delete("/{group_id}", response_model=dict)
def delete_group(group_id: int, user_id: int = Depends(get_current_user_id)):
    group_data = check_group_exists(group_id)

    member = supabase_client.table("group_members").select("is_admin") \
        .match({"group_id": group_id, "user_id": user_id}).single().execute().data
    if not member or not member["is_admin"]:
        raise HTTPException(status_code=403, detail="Not authorized to delete group")

    supabase_client.table("groups").delete().eq("id", group_id).execute()
    supabase_client.table("group_members").delete().eq("group_id", group_id).execute()

    return {"msg": "Group deleted successfully"}


@groups_router.get("/", response_model=List[dict])
def get_all_groups(user_id: int = Depends(get_current_user_id)):
    check_user_exists(user_id)
    response = supabase_client.table("groups").select("*").execute().data
    return response


@groups_router.post("/{group_id}/join", response_model=dict)
def join_group(group_id: int, user_id: int = Depends(get_current_user_id)):
    check_group_exists(group_id)
    check_user_exists(user_id)

    existing = supabase_client.table("group_members").select("id").match({
        "group_id": group_id,
        "user_id": user_id
    }).execute().data
    if existing:
        raise HTTPException(status_code=400, detail="Already a member")

    supabase_client.table("group_members").insert({
        "group_id": group_id,
        "user_id": user_id,
        "is_admin": False
    }).execute()

    return {"msg": "Successfully joined the group"}


@groups_router.delete("/{group_id}/leave", response_model=dict)
def leave_group(group_id: int, user_id: int = Depends(get_current_user_id)):
    check_group_exists(group_id)

    deleted = supabase_client.table("group_members").delete().match({
        "group_id": group_id,
        "user_id": user_id
    }).execute().data

    if not deleted:
        raise HTTPException(status_code=404, detail="Not a member of the group")

    return {"msg": "Left the group successfully"}


@groups_router.get("/{group_id}/members", response_model=List[dict])
def get_group_members(group_id: int, user_id: int = Depends(get_current_user_id)):
    check_group_exists(group_id)

    members = (supabase_client.table("group_members")
               .select("user_id, is_admin, users(id, first_name, last_name, avatar_url)") \
        .eq("group_id", group_id).execute().data)
    return members


@groups_router.post("/{group_id}/members/{target_user_id}/toggle_admin", response_model=dict)
def toggle_admin(group_id: int, target_user_id: int, user_id: int = Depends(get_current_user_id)):
    check_group_exists(group_id)
    check_user_exists(target_user_id)

    requester = supabase_client.table("group_members").select("is_admin") \
        .match({"group_id": group_id, "user_id": user_id}).single().execute().data
    if not requester or not requester["is_admin"]:
        raise HTTPException(status_code=403, detail="Only admins can manage roles")

    target = supabase_client.table("group_members").select("is_admin") \
        .match({"group_id": group_id, "user_id": target_user_id}).single().execute().data
    if not target:
        raise HTTPException(status_code=404, detail="Target user is not a member")

    supabase_client.table("group_members").update({
        "is_admin": not target["is_admin"]
    }).match({
        "group_id": group_id,
        "user_id": target_user_id
    }).execute()

    return {"msg": "Admin status toggled"}


@groups_router.get("/user/{target_user_id}", response_model=List[dict])
def get_user_groups(target_user_id: int, user_id: int = Depends(get_current_user_id)):
    check_user_exists(target_user_id)

    groups = supabase_client.table("group_members").select("group_id, groups(*)") \
        .eq("user_id", target_user_id).execute().data
    return [g["groups"] for g in groups if g.get("groups")]
