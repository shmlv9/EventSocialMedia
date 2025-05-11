from typing import Literal

from api.utils.functions import get_current_user_id
from api.utils.models import EventCreateRequest
from api.utils.supabase_client import supabase_client
from fastapi import APIRouter, Depends, HTTPException, Query

events_router = APIRouter(
    prefix='/events',
    tags=['events']
)


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


@events_router.get("/filter")
def get_filtered_events(
        filter_type: Literal["recommendations", "friends", "groups"] = Query(...),
        user_id: int = Depends(get_current_user_id)
):
    if filter_type == "recommendations":
        user = supabase_client.table("users").select("tags").eq("id", user_id).execute().data
        if not user or not user[0].get("tags"):
            return {'msg': 'You need tags to get recommendations', "events": []}

        user_tags = user[0]["tags"]
        if not isinstance(user_tags, list) or len(user_tags) == 0:
            return {'msg': 'You need tags to get recommendations', "events": []}

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
            "id, title, description, location, start_timestamptz, end_timestamptz, tags, image, participants").limit(
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
        return {"msg": "Фильтр по группам ещё не реализован"}

    else:
        raise HTTPException(status_code=400, detail="Unknown filter type")


@events_router.get("/{event_id}")
def get_event(event_id: int, user_id: int = Depends(get_current_user_id)):
    result = (supabase_client.table("events").select("*", "users:sponsor_id(id, first_name, last_name, avatar_url)")
              .eq("id", event_id).execute().data)

    if not result:
        raise HTTPException(status_code=404, detail="Event not found")

    event = result[0]

    return {
        "title": event["title"],
        "description": event["description"],
        "location": event["location"],
        "start": event["start_timestamptz"],
        "end": event["end_timestamptz"],
        "organizer": event["users"],
        "tags": event.get("tags", []),
        "participants_count": len(event.get("participants", [])),
        "created_at": event["created_at"],
        "image_url": event.get("image")
    }


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
    event = supabase_client.table("events").select("sponsor_id").eq("id", event_id).single().execute().data
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    if event["sponsor_id"] != user_id:
        raise HTTPException(status_code=403, detail="You are not the organizer of this event")
    supabase_client.table("events").delete().eq("id", event_id).execute()
    return {"msg": "Event deleted successfully"}


@events_router.get("/my/created")
def get_my_created_events(user_id: int = Depends(get_current_user_id)):
    events = supabase_client.table("events").select("id, title, "
                                                    "description, "
                                                    "start_timestamptz, end_timestamptz, "
                                                    "location, image").eq("sponsor_id", user_id).execute().data
    return {"events": events}


@events_router.get("/my/participating")
def get_my_participating_events(user_id: int = Depends(get_current_user_id)):
    all_events = supabase_client.table("events").select("id, title, "
                                                        "description, "
                                                        "start_timestamptz, end_timestamptz, "
                                                        "location, image, participants").execute().data
    participating = [event for event in all_events if user_id in (event.get("participants") or [])]
    return {"events": participating}
