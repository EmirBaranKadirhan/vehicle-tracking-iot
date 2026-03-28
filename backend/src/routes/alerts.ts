import { Router } from 'express'
import Alert from '../models/Alerts'

const router = Router()


router.get("/alerts", async (req, res) => {

    try {

        const { vehicleId, type } = req.query

        const query: any = {}
        if (vehicleId) {
            query.vehicleId = vehicleId
        }
        if (type) {
            query.type = type
        }
        const response = await Alert.find(query).sort({ createdAt: -1 }).limit(50)

        return res.status(200).json({ message: "Alerts Kayitlari Getirildi!", response })
    } catch (error) {
        return res.status(500).json({ message: "Bir hata oluştu", error })
    }

})



export default router