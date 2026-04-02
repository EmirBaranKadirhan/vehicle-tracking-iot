import { Router } from 'express'
import Vehicle from '../models/Vehicle'


const router = Router()


router.post("/vehicles/add", async (req: any, res) => {

    try {

        const { vehicleId, vehicleName } = req.body

        const userId = req.userId

        const newVehicle: any = {}

        if (!vehicleId || !vehicleName) {
            return res.status(400).json({ message: "Tum Alanlar Zorunlu" })
        } else {
            newVehicle.vehicleId = vehicleId
            newVehicle.vehicleName = vehicleName
            newVehicle.userId = userId
        }

        const response = await Vehicle.create(newVehicle)

        return res.status(200).json({ message: "Yeni Arac Kayiti Basarili", response })

    } catch (error) {

        return res.status(500).json({ message: "Bir hata oluştu", error })
    }


})



router.get("/vehicles", async (req: any, res) => {

    try {

        const userId = req.userId
        const vehicles = await Vehicle.find({ userId })
        return res.status(200).json({ message: "Araçlar getirildi", vehicles })

    } catch (error) {
        return res.status(500).json({ message: "Bir hata oluştu", error })
    }


})


export default router