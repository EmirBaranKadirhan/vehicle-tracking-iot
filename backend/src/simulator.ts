import mqtt from 'mqtt'

const client = mqtt.connect('ws://127.0.0.1:8888')

interface IGPSData {

    lat: number,
    long: number,
    speed: number,
    direction: number,
    altitude: number

}


client.on('connect', () => {

    console.log('connected!')

    let lastLat = 39.6484
    let lastLng = 27.8826

    setInterval(() => {
        const lat = lastLat + (Math.random() - 0.5) * 0.0002;
        const lng = lastLng + (Math.random() - 0.5) * 0.0002;
        const vehicleSpeed = Math.floor(Math.random() * 121)
        const vehicleDirection = Math.floor(Math.random() * 361)
        const vehicleAltitude = Math.floor(Math.random() * 51) + 100;

        lastLat = lat
        lastLng = lng

        const data: IGPSData = {
            lat: lat,
            long: lng,
            speed: vehicleSpeed,
            direction: vehicleDirection,
            altitude: vehicleAltitude
        }

        client.publish('vehicle/1/location', JSON.stringify(data))
        console.log('Gönderildi:', data)

    }, 1000);

})



