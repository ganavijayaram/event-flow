import nats from 'node-nats-streaming'

console.clear()

const stan = nats.connect('vintagegalleria', '123', {
  url: 'http://localhost:4222' // we are trying to connect to NATS running in a pod in K8
})

stan.on('connect', () => {
  console.log('Listener connected to NATS')

  //creating subscription and listening to the channel artifact:created
  const subscription = stan.subscribe('artifact:created')

  subscription.on('message', (msg) => {
    console.log('Message received')
  })
})