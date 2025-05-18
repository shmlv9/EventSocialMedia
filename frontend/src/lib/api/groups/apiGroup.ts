import {apiFetch} from "@/lib/api/apiFetch";
import {apiFetchClient} from "@/lib/api/apiFetchClient";

export async function fetchGroup(id: string) {
    const response = await apiFetch(`/groups/${id}`, {
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
