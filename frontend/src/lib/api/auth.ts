export async function checkUserExists(
    method: 'email' | 'phone',
    value: string
): Promise<boolean> {
    const response = await fetch('/api/auth/check', {
        method: 'POST',
        body: JSON.stringify({ method, value }),
    });
    return response.ok;
}

export async function checkLogin(
    method: 'email' | 'phone',
    login: string,
    password: string
) {
    // const response = await fetch('/api/auth/login', {
    //     method: 'POST',
    //     body: JSON.stringify({
    //         method: method,
    //         login: login,
    //         password: password,
    //     })
    // })
    return true;
    // return response.json()['token']
}