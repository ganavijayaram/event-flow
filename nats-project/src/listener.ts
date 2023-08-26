import nats, {Message, Stan} from 'node-nats-streaming'
import { randomBytes } from 'crypto'
import { ArtifactCreatedListener } from './events/artifact-created-listener'

console.clear()

const id = randomBytes(4).toString('hex')

// creating random auto generated id for client so we can run multiple copies of the same
const stan = nats.connect('vintagegalleria', id, {
  url: 'http://localhost:4222' // we are trying to connect to NATS running in a pod in K8
})

stan.on('connect', () => {
  console.log('Listener connected to NATS')

  // this code is to close downt he clients immediatelt after terminating or interuption, 
  //without waiting for retry, or sending heart beats
  stan.on('close', () => {
    console.log(`NATS connection closed! ${id}`)
    process.exit()
  })

  new ArtifactCreatedListener(stan).listen()
})

//whenever we restart or terminate, we call the close above
process.on('SIGINT', () => stan.close()) //interrupt signals
process.on('SIGTERM', () => stan.close()) //terminate signals




