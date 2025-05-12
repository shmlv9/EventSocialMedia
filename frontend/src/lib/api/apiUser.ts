import {apiFetch} from "@/lib/api/apiFetch";

export async function fetchID() {
    const response = await apiFetch(`/user/profile/me`, {
        method: 'GET',
    });
    if (!response.ok) return null;

    return response.json();
}


export async function fetchProfile(id: string) {

    const response = await apiFetch(`/user/profile/${id}`, {
        method: 'GET',
    });
    if (!response.ok) return null;

    return response.json();
}

export async function updateProfile(data: object) {
    const response = await apiFetch('/user/profile/', {
        method: 'PATCH',
        body: {...data},
    })
    return response.ok;
}