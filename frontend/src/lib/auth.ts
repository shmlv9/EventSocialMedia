const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function checkUserExists(
    method: 'email' | 'phone_number',
    value: string
): Promise<boolean> {
    try {
        const response = await fetch(`${apiUrl}/user/exists`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                value_type: method,
                value: value,
            }),
        });

        return response.ok;
    } catch (error) {
        console.error('Error checking user:', error);
        return false;
    }
}

export async function checkLogin(
    method: 'email' | 'phone_number',
    login: string,
    password: string,
) {
    const response = await fetch(`${apiUrl}/user/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            [method]: login,
            password,
        }),
    });
    const respData = await response.json()
    if (!response.ok) {
        const errorData = await respData;
        throw new Error(errorData.detail || 'Login failed');
    } else {
        document.cookie = `token=${respData.token}; path=/;`
    }

    return await respData;
}

export async function registerUser(
    email: string,
    password: string,
    name: string,
    dateBirth: string,
    phone: string,
) {
    const [firstName, lastName] = name.split(' ');

    try {
        const response = await fetch(`${apiUrl}/user/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                phone_number: phone,
                password: password,
                first_name: firstName,
                last_name: lastName || '',
                birthday: dateBirth,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Registration failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
}
