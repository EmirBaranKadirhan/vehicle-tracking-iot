import mongoose from 'mongoose'


const vehicleSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    vehicleId: {
        type: String,
        required: true,
        unique: true
    },
    vehicleName: {
        type: String,
        required: true
    }
}, { timestamps: true });




const Vehicle = mongoose.model('Vehicle', vehicleSchema);

export default Vehicle