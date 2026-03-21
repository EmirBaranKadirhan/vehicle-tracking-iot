import { Aedes } from 'aedes'
import { createServer } from 'aedes-server-factory'
const port = 8888


const startBroker = async () => {

    const aedes = await Aedes.createBroker()
    const httpServer = createServer(aedes, { ws: true })

    httpServer.listen(port, function () {
        console.log('websocket server listening on port ', port)
    })


}


startBroker()