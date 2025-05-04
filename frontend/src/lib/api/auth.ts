export async function checkUserExists(
    method: 'email' | 'phone',
    value: string
): Promise<boolean> {
    // const response = await fetch('/api/auth/check', {
    //     method: 'POST',
    //     body: JSON.stringify({ method, value }),
    // });
    // return response.ok;
    return true
}

export async function checkLogin(
    method: 'email' | 'phone',
    login: string,
    password: string
) {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
            method: method,
            login: login,
            password: password,
        })
    })

    return response.json()['token']
}

export async function registerUser( // ДОДЕЛАТЬ С БЕКОМ
    email: string,
    password: string,
    name: string,
    dateBirth: string,
    phone: string,
) {
    // const firstName = name.split(' ')[0];
    // const lastName = name.split(' ')[1];
    // const response = await fetch('', {
    //     method: 'POST',
    //     body: JSON.stringify({
    //         email: email,
    //         password: password,
    //         firstName: firstName,
    //         lastName: lastName,
    //         phone: phone,
    //         dateBirth: dateBirth,
    //     }),
    // })
    // return response.json()
    return true
}