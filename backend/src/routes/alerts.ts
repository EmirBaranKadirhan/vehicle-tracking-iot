import { Router } from 'express'
import Alert from '../models/Alerts'

const router = Router()


router.get("/alerts", async (req, res) => {

    try {

        const { vehicleId, type, page, limit } = req.query

        const query: any = {}
        if (vehicleId) {
            query.vehicleId = vehicleId
        }
        if (type) {
            query.type = type
        }
        const pageNumber = Number(page) || 1
        const limitNumber = Number(limit) || 10
        const offset = (pageNumber - 1) * limitNumber;
        const response = await Alert.find(query).sort({ createdAt: -1 }).skip(offset).limit(limitNumber)
        const total = await Alert.countDocuments(query)

        // const response = await Alert.find(query).sort({ createdAt: -1 }).limit(50)   // query = {} bossa, Alert.find({}) seklinde hepsini getirir
        return res.status(200).json({ message: "Alerts Kayitlari Getirildi!", response, total })    // total ==> toplam kayit sayisi pagination icin !!
    } catch (error) {
        return res.status(500).json({ message: "Bir hata oluştu", error })
    }

})


export default router