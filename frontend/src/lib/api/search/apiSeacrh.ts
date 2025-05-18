import {apiFetch} from "@/lib/api/apiFetch";
import {apiFetchClient} from "@/lib/api/apiFetchClient";

export async function fetchTags() {
    const response = await apiFetchClient(`/events/tags`, {
        method: 'GET',
    });
    if (!response.ok) return null;

    return response.json();
}
