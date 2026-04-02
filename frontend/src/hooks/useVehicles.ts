import { useState, useEffect } from 'react'
import { getVehicles } from '../api/vehicles'
import type { IVehicle } from '../types/vehicles'

const COLORS = ['#4cd7f6', '#94de2d', '#ffb873']

export function useVehicles() {
    const [vehicles, setVehicles] = useState<IVehicle[]>([])

    useEffect(() => {

        const fetchData = async () => {

            const vehicleList = await getVehicles()

            const newVehicleList = vehicleList.map((item, index) => {
                return { color: COLORS[index], ...item }
            })

            setVehicles(newVehicleList)
        }

        fetchData()
    }, [])

    return vehicles
}