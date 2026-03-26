import { Router } from 'express'
import User from '../models/User'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const router = Router()



router.post('/register', async (req, res) => {

    try {

        const saltRounds = 10;
        const { username, email, password } = req.body;

        if (!username || !email || !password) {

            return res.status(400).json({ message: "Tüm alanlar zorunlu" })
        }

        const userRegisterCheck = await User.findOne({ email })

        if (!userRegisterCheck) {

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


router.post('/login', async (req, res) => {

    try {

        const { email, password } = req.body

        if (!email || !password) {

            return res.status(400).json({ message: "Tüm alanlar zorunlu" })

        }

        const userLoginCheck = await User.findOne({ email })

        if (!userLoginCheck) {
            return res.status(400).json({ message: "Kullanici adi ya da sifre hatali!" })
        }

        const comparedPassword = await bcrypt.compare(password, userLoginCheck.password)

        if (!comparedPassword) {
            return res.status(400).json({ message: "Kullanici adi ya da sifre hatali!" })
        }

        const secret = process.env.JWT_SECRET_KEY
        const token = jwt.sign({ userId: userLoginCheck._id }, secret, {
            expiresIn: '30m'
        })

        res.status(200).json({ message: "Giris Islemi Basarili", token })

    } catch (error) {
        console.log("Giris Sirasinda Hata Olustu", error)
        return res.status(500).json({ message: "Sunucu hatası", error })

    }

})


export default router