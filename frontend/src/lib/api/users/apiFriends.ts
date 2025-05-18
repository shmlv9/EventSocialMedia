import {apiFetch} from "@/lib/api/apiFetch";
import {apiFetchClient} from "@/lib/api/apiFetchClient";

export async function fetchFriends(id: string) {
    const response = await apiFetch(`/user/friends/${id}`, {
        method: 'GET',
    });
    if (!response.ok) return null;
    return response.json();
}

export async function fetchFriendsRequests() {
    const response = await apiFetch(`/user/friends/requests/`, {
        method: 'GET',
    });
    if (!response.ok) return null;
    return response.json();
}

export async function deleteFriend(id: string) {
    const response = await apiFetchClient(`/user/friends/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) return null;
    return response.ok;
}

export async function rejectRequest(id: string) {
    const response = await apiFetchClient(`/user/friends/requests/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) return null;
    return response.ok;
}

export async function acceptRequest(id: string) {
    const response = await apiFetchClient(`/user/friends/requests/${id}`, {
        method: 'PATCH',
    });
    if (!response.ok) return null;
    return response.ok;
}