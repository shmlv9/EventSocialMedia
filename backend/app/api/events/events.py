from typing import Literal
import supabase

from api.utils.functions import get_current_user_id
from api.utils.models import EventCreateRequest
from api.utils.supabase_client import supabase_client
from fastapi import APIRouter, Query, Form, File, UploadFile, HTTPException, Depends
from datetime import datetime
from typing import Optional, List
import uuid
import json

events_router = APIRouter(
    prefix='/events',
    tags=['events']
)


@events_router.get('/tags')
async def get_tags(user_id: int = Depends(get_current_user_id)):
    response = supabase_client.table("tags") \
        .select("tag") \
        .execute().data
    tags = [item['tag'] for item in response]
    return tags


@events_router.post("")
def create_event(event: EventCreateRequest, sponsor_id: int = Depends(get_current_user_id)):
    if event.start_timestamptz >= event.end_timestamptz:
        raise HTTPException(status_code=400, detail="Start time must be before end time")

    response = supabase_client.table("events").insert({
        "title": event.title,
        "description": event.description,
        "location": event.location,
        "start_timestamptz": event.start_timestamptz.isoformat(),
        "end_timestamptz": event.end_timestamptz.isoformat(),
        "sponsor_id": sponsor_id,
        "tags": event.tags,
        "participants": [sponsor_id]
    }).execute()

    if response.data is None:
        raise HTTPException(status_code=500, detail="Failed to create event")

    return {"msg": "Event created successfully", "event_id": response.data[0]["id"]}


@events_router.post("/{event_id}/upload-image")
def upload_event_image(event_id: int, file: UploadFile = File(...), sponsor_id: int = Depends(get_current_user_id)):
    event = supabase_client.table("events").select("sponsor_id").eq("id", event_id).single().execute().data
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    if event["sponsor_id"] != sponsor_id:
        raise HTTPException(status_code=403, detail="You are not the sponsor of this event")

    from uuid import uuid4
    file_ext = file.filename.split(".")[-1]
    file_path = f"events/{uuid4()}.{file_ext}"

    file_bytes = file.file.read()
    supabase_client.storage.from_("images").upload(file_path, file_bytes, {"content-type": file.content_type})

    public_url = supabase_client.storage.from_("images").get_public_url(file_path)

    supabase_client.table("events").update({"image": public_url}).eq("id", event_id).execute()

    return {"msg": "Image uploaded successfully", "image_url": public_url}


@events_router.get("/filter")
def get_filtered_events(
        filter_type: Literal["recommendations", "friends", "groups"] = Query(...),
        user_id: int = Depends(get_current_user_id)
):
    if filter_type == "recommendations":
        user = supabase_client.table("users").select("tags").eq("id", user_id).execute().data
        user_tags = user[0]["tags"]
        if not user or not user_tags:
            return {'error': 'Выберите тэги в профиле', "events": []}

        user_tags = user[0]["tags"]
        if not isinstance(user_tags, list) or len(user_tags) == 0:
            return {'error': 'Выберите тэги в профиле', "events": []}

        events = supabase_client.table("events") \
            .select("id, title, description, location, start_timestamptz, end_timestamptz, tags, image") \
            .contains("tags", user_tags) \
            .limit(20) \
            .execute().data

        return {"events": events}

    elif filter_type == "friends":
        friend_pairs = supabase_client.table("friends").select("sender_id, recipient_id").or_(
            f"sender_id.eq.{user_id},recipient_id.eq.{user_id}").eq("status", True).execute().data

        friend_ids = set()

        for pair in friend_pairs:
            if pair["sender_id"] == user_id:
                friend_ids.add(pair["recipient_id"])
            else:
                friend_ids.add(pair["sender_id"])
        if not friend_ids:
            return {"events": []}

        events = supabase_client.table("events").select(
            "id, title, description, location, start_timestamptz, end_timestamptz, tags, image, participants, organizer:sponsor_id(id, first_name, last_name, avatar_url)").limit(
            50).execute().data

        filtered_events = []
        for event in events:

            participants = event.get("participants") or []

            participating_friends = list(set(participants) & friend_ids)
            if participating_friends:
                friends_info = (supabase_client.table("users").select("id, first_name, last_name, avatar_url")
                                .in_("id", participating_friends).execute().data)
                event["friends_participants"] = friends_info
                filtered_events.append(event)
        return {"events": filtered_events[:20]}

    elif filter_type == "groups":
        return {"error": "Фильтр по группам ещё не реализован"}

    else:
        raise HTTPException(status_code=400, detail="Unknown filter type")


@events_router.get("/{event_id}")
def get_event(event_id: int, user_id: int = Depends(get_current_user_id)):
    try:
        event = supabase_client.table("events").select("*",
                                                       "organizer:sponsor_id(id, first_name, last_name, avatar_url)").eq(
            "id", event_id).execute().data[0]
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")

        return {'event': event}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@events_router.get('/events/{event_id}/participants')
def get_event_participants(event_id: int, user_id: int = Depends(get_current_user_id)):
    try:
        response = supabase_client.table('events').select('participants').eq('id', event_id).single().execute()
        event = response.data

        if not event:
            raise HTTPException(status_code=404, detail="Event not found")

        return {"participants": event.get("participants", [])}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@events_router.delete('/{event_id}/participants')
def leave_event_participants(event_id: int, user_id: int = Depends(get_current_user_id)):
    try:
        response = supabase_client.table('events').select('participants').eq('id', event_id).single().execute()
        event = response.data

        if not event:
            raise HTTPException(status_code=404, detail="Event not found")

        participants = event.get('participants') or []

        if user_id not in participants:
            raise HTTPException(status_code=409, detail="You are already left")

        updated_participants = [uid for uid in participants if uid != user_id]

        supabase_client.table('events').update({'participants': updated_participants}).eq('id', event_id).execute()

        return {"message": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@events_router.post('/{event_id}/participants')
def join_event_participants(event_id: int, user_id: int = Depends(get_current_user_id)):
    try:
        response = supabase_client.table('events').select('participants').eq('id', event_id).single().execute()
        event = response.data

        if not event:
            raise HTTPException(status_code=404, detail="Event not found")

        participants = event.get('participants') or []

        if user_id in participants:
            raise HTTPException(status_code=409, detail="You are already a participant")

        participants.append(user_id)

        supabase_client.table('events').update({'participants': participants}).eq('id', event_id).execute()

        return {"message": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@events_router.patch("/{event_id}")
def update_event(event_id: int, updated_data: dict, user_id: int = Depends(get_current_user_id)):
    event = supabase_client.table("events").select("sponsor_id").eq("id", event_id).single().execute().data
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    if event["sponsor_id"] != user_id:
        raise HTTPException(status_code=403, detail="You are not the organizer of this event")
    update_fields = {k: v for k, v in updated_data.items() if v is not None}
    supabase_client.table("events").update(update_fields).eq("id", event_id).execute()
    return {"msg": "Event updated successfully"}


@events_router.delete("/{event_id}")
def delete_event(event_id: int, user_id: int = Depends(get_current_user_id)):
    try:
        event = supabase_client.table("events").select("sponsor_id").eq("id", event_id).single().execute().data
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")
        if event["sponsor_id"] != user_id:
            raise HTTPException(status_code=403, detail="You are not the organizer of this event")
        supabase_client.table("events").delete().eq("id", event_id).execute()
        return {"msg": "Event deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@events_router.get("/user/{target_id}/created")
def get_my_created_events(target_id: int, user_id: int = Depends(get_current_user_id)):
    try:
        events = (
            supabase_client.table("events").select("*", "organizer:sponsor_id(id, first_name, last_name, avatar_url)")
            .eq("sponsor_id", target_id).eq("sponsor_id", target_id).execute().data)

        return {"events": events}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@events_router.get("/user/{target_id}/participants")
async def get_participating_events(
        target_id: int,
        user_id: int = Depends(get_current_user_id),
):
    response = supabase_client.table("events") \
        .select("*", "organizer:sponsor_id(id, first_name, last_name, avatar_url)") \
        .contains('participants', [str(target_id)]) \
        .execute().data

    return {"events": response}
