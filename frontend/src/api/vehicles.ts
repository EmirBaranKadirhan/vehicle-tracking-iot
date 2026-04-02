import instance from './client'
import type { IVehicle } from '../types/vehicles'

export async function getVehicles(): Promise<IVehicle[]> {

    const url = "/api/vehicles"

    const { data } = await instance.get(url)

    return data.vehicles
}