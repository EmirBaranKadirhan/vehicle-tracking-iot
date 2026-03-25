export interface IGPSData {
    lat: number
    long: number
    speed: number
    direction: number
    altitude: number
}


export interface ILocationHistory extends IGPSData {
    _id: string
    vehicleId: string
    createdAt: string
}