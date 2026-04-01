import instance from './client'

export async function getAnalytics() {

    const url = "/api/analytics"

    const { data } = await instance.get(url)

    return data.result

}