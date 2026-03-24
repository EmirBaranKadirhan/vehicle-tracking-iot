import mongoose from 'mongoose'


const locationHistory = new mongoose.Schema({
    vehicleId: {
        type: String,
        required: true
    },
    long: {
        type: Number,
        required: true
    },
    lat: {
        type: Number,
        required: true
    },
    speed: {
        type: Number,
        required: true
    },
    direction: {
        type: Number,
        required: true
    },
    altitude: {
        type: Number,
        required: true
    }
}, { timestamps: true });




const History = mongoose.model('LocationHistory', locationHistory);

export default History