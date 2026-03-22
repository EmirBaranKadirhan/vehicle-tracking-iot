import mqtt from 'mqtt'

const client = mqtt.connect('ws://127.0.0.1:8888')

client.on('connect', () => {
    console.log('connected!')
})


client.subscribe('new-user', (err) => {

    if (!err) {
        client.publish('new-user', 'EBK')
    }

})


client.on('message', (topic, message) => {

    console.log(topic, ':', message.toString())
})