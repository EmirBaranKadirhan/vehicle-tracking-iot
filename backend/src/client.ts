import mqtt from 'mqtt'

const client = mqtt.connect('ws://127.0.0.1:8888')

client.on('connect', () => {
    console.log('connected!')
})