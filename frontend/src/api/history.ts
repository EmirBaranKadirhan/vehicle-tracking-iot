import instance from './client'

export async function getHistory() {

    const { data } = await instance.get('/api/history')

    return data.response

}
