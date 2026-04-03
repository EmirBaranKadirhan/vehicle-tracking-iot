export interface IAlert {
    _id: string
    vehicleId: string
    type: 'speed_violation' | 'offline' | 'idle'
    message: string
    speed?: number
    createdAt: string
}



export interface IAiCards {
    title: string
    insight: string
    severity: "critical" | "warning" | "info"
}