import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI as string
        await mongoose.connect(uri)
        console.log('MongoDB bağlandı')
    } catch (error) {
        console.error('MongoDB bağlantı hatası:', error)
    }
}

export default connectDB