import { Router } from 'express'
import Alert from '../models/Alerts'
import { analyzeAlerts } from '../services/groqService'

const router = Router()


router.get("/analytics", async (req, res) => {

    try {

        const result = await Alert.aggregate([
            {
                $match: {
                    createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }     // $gte ==> Büyük veya Eşit anlamina gelir
                }
            },
            {
                $group: {
                    _id: "$vehicleId",        // neye göre grupla
                    toplamAlert: { $sum: 1 },  // her eşleşmede 1 ekle
                    speedViolations: {                                                      // $eq ==> "==" esittir anlaminda
                        $sum: { $cond: [{ $eq: ["$type", "speed_violation"] }, 1, 0] }      // $cond ==> if-else gibi calisir ya da ternary operator(? :) seklinde calisir.
                    },
                    offlineCount: {
                        $sum: { $cond: [{ $eq: ["$type", "offline"] }, 1, 0] }
                    }
                }
            },
            {
                $addFields: {
                    riskScore: {
                        $min: [
                            {
                                $add: [         // add ==> toplama yapar ve icine array([]) alir
                                    { $multiply: ["$speedViolations", 3] },     // multiply ==> carpma yapar icine array([]) alir
                                    { $multiply: ["$offlineCount", 1] }     // "$offlineCount" — başındaki $ işareti "bu bir değer değil, o field'ın değerini al. $ olmasaydi string algilardi hata verirdi!!"
                                ]
                            },
                            100
                        ]

                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    vehicleId: "$_id",
                    speedViolations: 1,
                    offlineCount: 1,
                    riskScore: 1
                }
            }
        ])

        return res.status(200).json({ message: "Analytics verisi getirildi", result })

    } catch (error) {

        return res.status(500).json({ message: "Bir hata oluştu", error })
    }

})


router.post("/analytics/ai-summary", async (req, res) => {

    try {

        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

        const speedViolationCount = await Alert.countDocuments({
            type: 'speed_violation',
            createdAt: { $gte: sevenDaysAgo }
        })

        const offlineCount = await Alert.countDocuments({
            type: 'offline',
            createdAt: { $gte: sevenDaysAgo }
        })

        const idleCount = await Alert.countDocuments({
            type: 'idle',
            createdAt: { $gte: sevenDaysAgo }
        })

        const result = await Alert.aggregate([
            {
                $match: {
                    createdAt: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: "$vehicleId",
                    speedViolations: {
                        $sum: { $cond: [{ $eq: ["$type", "speed_violation"] }, 1, 0] }
                    },
                    offlineCount: {
                        $sum: { $cond: [{ $eq: ["$type", "offline"] }, 1, 0] }
                    },
                    idleCount: {
                        $sum: { $cond: [{ $eq: ["$type", "idle"] }, 1, 0] }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    vehicleId: "$_id",
                    speedViolations: 1,
                    offlineCount: 1,
                    idleCount: 1

                }
            }
        ])

        const aiResponse = await analyzeAlerts({
            speed_violation: speedViolationCount,
            offline: offlineCount,
            idle: idleCount,
        },
            result)    // araç bazlı aggregate sonucu 

        if (!aiResponse) {
            return res.status(500).json({ message: "AI yanıt vermedi" })
        }
        const parsed = JSON.parse(aiResponse)
        return res.status(200).json({ cards: parsed })

    } catch (error) {
        return res.status(500).json({ message: "AI analiz hatası", error })
    }

})


export default router