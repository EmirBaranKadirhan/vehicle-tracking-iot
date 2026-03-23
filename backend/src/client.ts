import mqtt from 'mqtt'

const client = mqtt.connect('ws://127.0.0.1:8888')      // broker'a bağlan

client.on('connect', () => {
    console.log('connected!')
})


client.subscribe('new-user', (err) => {         // "new-user" topic'ini dinlemeye başla. Buraya mesaj gelince haber ver.

    if (!err) {
        // Subscribe başarılıysa "new-user" topic'ine "EBK" mesajı gönder.    
        client.publish('new-user', 'EBK-' + Math.ceil(Math.random() * 10))
    }

})


client.on('message', (topic, message) => {          // mesaj geldiginde ekrana yazar

    console.log(topic, ':', message.toString())
})


