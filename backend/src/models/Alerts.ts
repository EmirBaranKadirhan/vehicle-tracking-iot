import mongoose from "mongoose";


interface IAlerts {
    vehicleId: string;
    type: 'speed_violation' | 'offline' | 'idle'
    message: string;
    speed: number;

}



const alertSchema = new mongoose.Schema<IAlerts>({

    vehicleId: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['speed_violation', 'offline', 'idle'],       // veriler db ye kaydedilerken enum icindeki degerler olacak ayni zamanda da string olacak
        required: true
    },
    message: {
        type: String,
        required: true
    },
    speed: {
        type: Number,
        required: false
    }

}, { timestamps: true })


const Alert = mongoose.model('Alert', alertSchema);

export default Alert

