import mongoose from 'mongoose'


const vehicleSchema = new mongoose.Schema({
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