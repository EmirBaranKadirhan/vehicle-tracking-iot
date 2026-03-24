import { Aedes } from 'aedes'
import { createServer } from 'aedes-server-factory'
import { redis } from './redis'
import { clients } from './websocket'
import History from './models/LocationHistory'

const port = 8888


const startBroker = async () => {

    const aedes = await Aedes.createBroker()
    const httpServer = createServer(aedes, { ws: true })

    aedes.on('client', (client) => {
        console.log('Client bağlandı:', client.id)
    })

    aedes.on('clientDisconnect', (client) => {
        console.log('Client ayrıldı:', client.id)
    })

    httpServer.listen(port, () => {
        console.log(`MQTT broker ${port} portunda çalışıyor`)
    })
    // client ==> mesaji gonderen client
    aedes.on('publish', async (packet, client) => {   // packet ==> gelen mesajin kendisi, icinde topic ve payload var
        console.log('Mesaj geldi:', packet.topic, packet.payload.toString())

        if (packet.topic.startsWith('vehicle/')) {     // startsWith ==> bir stringin belirtilen seyle baslayip baslamadigini kontrol ederiz (true,false)
            // vehicle/1/location
            const parts = packet.topic.split("/")
            const id = parts[1]
            const data = packet.payload.toString()
            const objectData = JSON.parse(data)
            await redis.set(`vehicle:${id}:location`, JSON.stringify(objectData));

            await History.create({
                vehicleId: id as string,
                lat: objectData.lat,
                long: objectData.long,
                speed: objectData.speed,
                direction: objectData.direction,
                altitude: objectData.altitude
            })

            clients.forEach((client) => {
                client.send(JSON.stringify({ id, ...objectData }))
            })
        }

    })

}


startBroker()