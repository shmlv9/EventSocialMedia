import {apiFetch} from "@/lib/api/apiFetch";
import {apiFetchClient} from "@/lib/api/apiFetchClient";

export async function fetchEvents(filter: string) {
    const response = await apiFetchClient(`/events/filter?filter_type=${filter}`, {
        method: 'GET',
    })
    return response.json();
}

export async function fetchEvent(id: string) {
    const response = await apiFetch(`/events/${id}`, {
        method: 'GET',
    })
    return response.json();
}

export async function updateEvent(id: string, data: object) {
    console.log(id)
    console.log(data)
    return true
}

export async function deleteEvent(id: string) {
    const response = await apiFetchClient(`/events/${id}`, {
        method: 'DELETE',
    })
    if (!response.ok) return null
    return response.ok;
}


export async function fetchEventClient(id: string) {
    const response = await apiFetchClient(`/events/${id}`, {
        method: 'GET',
    })
    return response.json();
}

export async function fetchEventUserCreated(id: string) {
    const response = await apiFetch(`/events/user/${id}/created`, {
        method: 'GET',
    })
    return response.json();
}

export async function fetchEventUserParticipants(id: string) {
    const response = await apiFetch(`/events/user/${id}/participants`, {
        method: 'GET',
    });
    return response.json();
}

export async function joinEvent(id: string) {
    const response = await apiFetchClient(`/events/${id}/participants`, {
        method: 'POST'
    });
    return response.ok
}

export async function leaveEvent(id: string) {
    const response = await apiFetchClient(`/events/${id}/participants`, {
        method: 'DELETE'
    });
    return response.ok
}

export async function createEvent(data: object) {
    const response = await apiFetchClient('/events', {
        method: 'POST',
        body: {
            body: JSON.stringify(data)
        }
    });
    return response.json();
}
