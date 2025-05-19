import {apiFetch} from "@/lib/api/apiFetch";
import {apiFetchClient} from "@/lib/api/apiFetchClient";

export async function fetchGroup(id: string) {
    const response = await apiFetch(`/groups/${id}`, {
        method: 'GET',
    });
    if (!response.ok) return null;
    return response.json();
}

export async function fetchGroupClient(id: string) {
    const response = await apiFetchClient(`/groups/${id}`, {
        method: 'GET',
    });
    if (!response.ok) return null;
    return response.json();
}

export async function fetchEventsGroup(id: string) {
    const response = await apiFetch(`/groups/${id}/events`, {
        method: 'GET',
    });
    if (!response.ok) return null;
    return response.json();
}

export async function joinGroup(id: string) {
    const response = await apiFetchClient(`/groups/${id}/join`, {
        method: 'POST',
    });
    if (!response.ok) return null;
    return response.ok;
}

export async function leaveGroup(id: string) {
    const response = await apiFetchClient(`/groups/${id}/leave`, {
        method: 'DELETE',
    });
    if (!response.ok) return null;
    return response.ok;
}

export async function fetchMembers(id: string) {
    const response = await apiFetchClient(`/groups/${id}/members`, {
        method: 'GET',
    });
    if (!response.ok) return null;
    return response.json();
}

export async function fetchGroups() {
    const response = await apiFetchClient(`/groups/`, {
        method: 'GET',
    });
    if (!response.ok) return null;
    return response.json();
}

export async function fetchGroupsUser(id: string) {
    const response = await apiFetchClient(`/groups/user/${id}`, {
        method: 'GET',
    });
    if (!response.ok) return null;
    return response.json();
}


type CreateData = {
    name: string;
    description: string;
    tags: string[];
    location: string;
    avatar_url: string;
}

export async function createGroup(data: CreateData) {
    const response = await apiFetchClient(`/groups/`, {
        method: 'POST',
        body: {
            body: JSON.stringify(data)
        }
    });
    if (!response.ok) return null;
    return response.json();
}

export async function updateGroup(id: string, data: object) {
    console.log(data)
    const response = await apiFetchClient(`/groups/${id}`, {
        method: 'PUT',
        body: {
            body: JSON.stringify(data)
        }
    });
    if (!response.ok) return null;
    return response.json();
}
