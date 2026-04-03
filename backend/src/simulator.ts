import mqtt from 'mqtt'
import Vehicle from './models/Vehicle'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()


interface ISimVehicle {
    id: string
    lastLat: number
    lastLng: number
    lastSpeed: number
    dirLat: number
    dirLng: number
    lastDirection: number
}


const startSimulator = async () => {

    await mongoose.connect(process.env.MONGODB_URI || '')

    const dbVehicles = await Vehicle.find()


    const DEFAULT_POSITIONS = [
        { lastLat: 39.3194, lastLng: 26.6961, lastSpeed: 60, dirLat: 0.5, dirLng: 0.5, lastDirection: 45 },   // Ayvalık merkez
        { lastLat: 36.8121, lastLng: 34.6415, lastSpeed: 60, dirLat: 0.5, dirLng: -0.5, lastDirection: 135 },   // Mersin merkez
        { lastLat: 38.4237, lastLng: 27.1428, lastSpeed: 60, dirLat: -0.5, dirLng: 0.5, lastDirection: 270 },   // İzmir merkez
    ]

    const vehicles: ISimVehicle[] = []

    for (let i = 0; i < dbVehicles.length; i++) {
        const vehicle: any = dbVehicles[i]
        const defaultPosition: any = DEFAULT_POSITIONS[i % DEFAULT_POSITIONS.length]

        vehicles.push({
            id: vehicle.vehicleId,
            lastLat: defaultPosition.lastLat,
            lastLng: defaultPosition.lastLng,
            lastSpeed: defaultPosition.lastSpeed,
            dirLat: defaultPosition.dirLat,
            dirLng: defaultPosition.dirLng,
            lastDirection: defaultPosition.lastDirection

        })
    }

    const client = mqtt.connect('ws://127.0.0.1:8888')

    interface IGPSData {

        lat: number,
        long: number,
        speed: number,
        direction: number,
        altitude: number

    }


    client.on('connect', () => {

        console.log('connected!')


        setInterval(() => {

            vehicles.forEach((vehicle: ISimVehicle) => {

                // Math.floor(Math.random() * (max - min)) + min   ||  Math.min(120, Math.max(0, yeniHiz)       ==> alt satirda surat guncellemede kullanilan formuller !!!
                const vehicleSpeed = Math.floor(Math.min(120, Math.max(0, vehicle.lastSpeed + Math.floor(Math.random() * 20) + (-10))))

                const lat = vehicle.lastLat + vehicle.dirLat * vehicleSpeed * 0.000001
                const lng = vehicle.lastLng + vehicle.dirLng * vehicleSpeed * 0.000001

                const vehicleDirection = (vehicle.lastDirection + Math.floor(Math.random() * 6) + (-3) + 360) % 360       // +360 her zaman negatife düşmeyi engeller. % 360 ise 360'ı geçince başa döndürür

                const vehicleAltitude = Math.floor(Math.random() * 51) + 100;

                vehicle.lastLat = lat
                vehicle.lastLng = lng
                vehicle.lastSpeed = vehicleSpeed
                vehicle.lastDirection = vehicleDirection

                const radyan = (vehicleDirection * Math.PI) / 180       // bilgisayar dereceyle calismayi bilmediklerinden onlara "Radyan" seklinde veri veririz! Formulu de yandaki gibi
                vehicle.dirLat = Math.sin(radyan) * 0.5
                vehicle.dirLng = Math.cos(radyan) * 0.5

                const data: IGPSData = {
                    lat: lat,
                    long: lng,
                    speed: vehicleSpeed,
                    direction: vehicleDirection,
                    altitude: vehicleAltitude
                }

                client.publish(`vehicle/${vehicle.id}/location`, JSON.stringify(data))

                console.log('Gönderildi:', data)
            })

        }, 1000);

    })


}


startSimulator()