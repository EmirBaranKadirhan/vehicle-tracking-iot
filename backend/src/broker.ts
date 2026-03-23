import { Aedes } from 'aedes'
import { createServer } from 'aedes-server-factory'
import { redis } from './redis'
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
        if (packet.topic === 'vehicle/1/location') {
            const data = packet.payload.toString()
            const objectData = JSON.parse(data)
            await redis.set('vehicle:1:location', JSON.stringify(objectData));
        }

    })

}


startBroker()