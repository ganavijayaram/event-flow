import nats from 'node-nats-streaming'
import { randomBytes } from 'crypto'
import { ArtifactCreatedPublisher } from './events/artifact-created-publisher'
import { Publisher } from './events/base-publisher'



//to clear the console with unrelated ts node info
console.clear()

//stan is equivalent to client, it is just a NATS terminology
//abc is the client id
const stan = nats.connect('vintagegalleria', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222' // we are trying to connect to NATS running in a pod in K8
})

//this is a callback because NATS uses callbacks and not await async
stan.on('connect', () => {
  console.log('Publisher connected to NATS')

  const publisher = new ArtifactCreatedPublisher(stan)

  // data to be sent to the event bus
// data has to be a string only hence JSON.stringify
  publisher.publish({
    id: '123',
    title: 'Vase',
    price: 180
  })

})