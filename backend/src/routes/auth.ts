import { Router } from 'express'
import User from '../models/User'
import bcrypt from "bcrypt"

const router = Router()



router.post('/register', async (req, res) => {

    try {

        const saltRounds = 10;
        const { username, email, password } = req.body;

        if (!username || !email || !password) {

            return res.status(400).json({ message: "Tüm alanlar zorunlu" })
        }

        const userCheck = await User.findOne({ email })

        if (!userCheck) {

            const hashedPassword = await bcrypt.hash(password, saltRounds)

            const userRegister = await User.create({
                username,
                email,
                password: hashedPassword
            })

            return res.status(201).json({ message: "Kayit Basarili", userRegister })
        }

        return res.status(400).json({ message: "Kayit Basarisiz Kayitli Kullanici" })



    } catch (error) {
        console.log("Kayit Sirasinda Hata Olustu", error)
        return res.status(500).json({ message: "Sunucu hatası", error })
    }
})


export default router