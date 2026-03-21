import { Aedes } from 'aedes'
import { createServer } from 'aedes-server-factory'
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


}


startBroker()