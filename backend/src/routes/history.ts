import { Router } from 'express'
import History from '../models/LocationHistory'

const router = Router()

router.get('/history', async (req, res) => {
    try {

        const vehicleId = req.query.vehicleId

        let response;

        // const query = vehicleId ? { vehicleId } : {}     if blogu yerine bu sekilde de yazabilirdik

        if (vehicleId) {
            response = await History.find({ vehicleId }).sort({ createdAt: -1 }).limit(50)

        } else {
            response = await History.find().sort({ createdAt: -1 }).limit(50)
        }

        return res.status(200).json({ message: "Geçmiş Kayıtlar Getirildi!", response })
    } catch (error) {
        return res.status(500).json({ message: "Bir hata oluştu", error })
    }
})



export default router