import {apiFetch} from "@/lib/api/apiFetch";
import {apiFetchClient} from "@/lib/api/apiFetchClient";

export async function getInvitationData(token: string) {
    const response = await apiFetch(`${token}`, {
        method: 'GET',
    });
    if (!response.ok) return null;
    return response.json();
}

export async function getInvitationLink(id: string) {
    const response = await apiFetchClient(`/groups/${id}/generate_link`, {
        method: 'POST',
    });
    if (!response.ok) return null;
    return response.json();
}

export async function acceptInvite(token: string) {
    const response = await apiFetchClient(`/groups/join_by_token/${token}`, {
        method: 'POST',
    });
    if (!response.ok) return null;
    return response.ok;
}