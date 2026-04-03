import instance from './client'
import type { IVehicle } from '../types/vehicles'

export async function getVehicles(): Promise<IVehicle[]> {

    const url = "/api/vehicles"

    const { data } = await instance.get(url)

    return data.vehicles
}


export async function addVehicle(vehicleId: string, vehicleName: string): Promise<IVehicle> {

    const { data } = await instance.post('/api/vehicles/add', { vehicleId, vehicleName })       // { vehicleId, vehicleName } body olarak gidiyor 

    return data.response
}

export async function deleteVehicle(vehicleId: string): Promise<void> {

    await instance.delete(`/api/vehicles/${vehicleId}`)

}