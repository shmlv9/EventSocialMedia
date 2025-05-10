'use server'

import {cookies} from "next/headers";
export async function apiFetch(url: string, params: { method: string; body?: string }) {
    const token = (await cookies()).get('token')?.value;
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!token) {
        console.error('No token found')
        throw new Error('No token found');
    }

    try {
        const response = await fetch(`${apiUrl}${url}`, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`,
            },
            ...params
        });

        if (!response.ok) {
            console.log(response.statusText)

        }

        return response;
    } catch (e) {
        console.error('Fetch Error:', e);
        throw e;
    }
}