// import { redis } from './redis'
import './broker'
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import './websocket'
import connectDB from './db'
import historyRouter from './routes/history'
import authRouter from './routes/auth'

dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())


app.use('/api/auth', authRouter)
app.use('/api', historyRouter)


const PORT = process.env.PORT || 5000


app.listen(PORT, async () => {
    // await redis.set('test', 'merhaba')
    // const value = await redis.get('test')
    // console.log('Redis test:', value)
    await connectDB()
    console.log(`Server ${PORT} portunda çalışıyor`)


})