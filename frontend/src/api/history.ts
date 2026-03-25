import instance from './client'

export async function getHistory(vehicleId?: string) {

    const url = vehicleId ? `/api/history?vehicleId=${vehicleId}` : "/api/history"

    // axios objesi icinden "data" key'ini direkt aldik. Ornek yapi ==>     axiosObjesi:{status:,headers:{},data:message:"",response:[]}
    const { data } = await instance.get(url)

    return data.response

}
