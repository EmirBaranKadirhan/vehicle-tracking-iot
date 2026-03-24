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

    const vehicles = [
        { id: 1, lastLat: 39.6484, lastLng: 27.8826 },
        { id: 2, lastLat: 39.6510, lastLng: 27.8900 },
        { id: 3, lastLat: 39.6450, lastLng: 27.8750 },
    ]

    setInterval(() => {

        vehicles.forEach((vehicle) => {

            const lat = vehicle.lastLat + (Math.random() - 0.5) * 0.0002;
            const lng = vehicle.lastLng + (Math.random() - 0.5) * 0.0002;
            const vehicleSpeed = Math.floor(Math.random() * 121)
            const vehicleDirection = Math.floor(Math.random() * 361)
            const vehicleAltitude = Math.floor(Math.random() * 51) + 100;

            vehicle.lastLat = lat
            vehicle.lastLng = lng

            const data: IGPSData = {
                lat: lat,
                long: lng,
                speed: vehicleSpeed,
                direction: vehicleDirection,
                altitude: vehicleAltitude
            }

            client.publish(`vehicle/${vehicle.id}/location`, JSON.stringify(data))

            console.log('Gönderildi:', data)
        })

    }, 1000);

})



