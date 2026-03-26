import instance from './client'

export async function register(username: string, email: string, password: string) {

    const url = "/api/auth/register"
    const response = await instance.post(url, { username, email, password })

    return response.data
}


export async function login(email: string, password: string) {

    const url = "/api/auth/login"
    const response = await instance.post(url, { email, password })

    return response.data
}