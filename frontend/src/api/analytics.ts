import instance from './client'

export async function getAnalytics() {

    const url = "/api/analytics"

    const { data } = await instance.get(url)

    return data.result

}


export async function getAiSummary() {

    const url = "/api/analytics/ai-summary"

    const { data } = await instance.post(url)

    return data.cards
}