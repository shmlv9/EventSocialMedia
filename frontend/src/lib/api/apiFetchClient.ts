function getToken(): string | null {
    const match = document.cookie.match(/(?:^|;\s*)token=([^;]+)/);
    return match ? match[1] : null;
}

export async function apiFetchClient(url: string, params: { method: string; body?: object | JSON }) {
    const token = getToken()
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
            method: params.method,
            ...params.body
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