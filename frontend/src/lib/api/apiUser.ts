'use server'

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
    console.log(data)
    const response = await apiFetch('/user/profile/', {
        method: 'PATCH',
        body: JSON.stringify(data),
    })
    return response.ok;
}