function getToken(): string | null {
    const match = document.cookie.match(/(?:^|;\s*)token=([^;]+)/);
    return match ? match[1] : null;
}


export async function UploadEventImg(eventId: number, file: File) {
    const token = getToken()
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${apiUrl}/events/${eventId}/upload-image`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: formData
    })

    if (!response.ok) {
        throw new Error('Ошибка при загрузке изображения')
    }

    const data = await response.json()

    return data
}