import { Aedes } from 'aedes'
import { createServer } from 'aedes-server-factory'
import { redis } from './redis'
import { clients } from './websocket'
import History from './models/LocationHistory'
import Alert from './models/Alerts'

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
            await redis.set(`vehicle:${id}:lastSeen`, Date.now().toString());

            await History.create({
                vehicleId: id as string,
                lat: objectData.lat,
                long: objectData.long,
                speed: objectData.speed,
                direction: objectData.direction,
                altitude: objectData.altitude
            })

            if (objectData.speed > 90) {
                await Alert.create({
                    vehicleId: id as string,
                    type: "speed_violation",
                    message: `Vehicle ${id} exceeded speed limit: ${objectData.speed} km/h`,
                    speed: objectData.speed
                })
            }

            clients.forEach((client) => {
                client.send(JSON.stringify({ id, ...objectData }))
            })
        }

    })

}

setInterval(async () => {
    const vehicleIds = ['1', '2', '3']

    for (const id of vehicleIds) {
        // lastSeen'i Redis'ten oku
        const value = await redis.get(`vehicle:${id}:lastSeen`);
        const diff = Date.now() - Number(value)

        if (diff > 5 * (60 * 1000)) {

            Alert.create({
                vehicleId: id as string,
                type: "offline",
                message: `Vehicle ${id} has been offline for more than 5 minutes`

            })
        }
        // şu anki zamanla karşılaştır
        // 5 dakikadan eskiyse Alert.create()
    }
}, 60000) // her dakika


startBroker()