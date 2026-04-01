export interface IAlert {
    _id: string
    vehicleId: string
    type: 'speed_violation' | 'offline' | 'idle'
    message: string
    speed?: number
    createdAt: string
}