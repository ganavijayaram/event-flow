import nats, {Message} from 'node-nats-streaming'
import { randomBytes } from 'crypto'

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

  const options = stan.subscriptionOptions()
  //usually once the listener recevies, he immediately sends ack, but now we will send after we process it
  // if we dont send ack, after certain time, send it to again
  .setManualAckMode(true)
  //give all elements emitted in teh past when the client was down
  // downside, too many events if we get all
  .setDeliverAllAvailable() 
  // keep track of what is processes and not
  .setDurableName('order-service')

  //creating subscription and listening to the channel artifact:created
  const subscription = stan.subscribe(
    'artifact:created', //channel name
    'orders-service-queue-group', // also specifying the queue groups
    options //options created previously  and sends events to one insatnce of the queue groups
    )

  subscription.on('message', (msg: Message) => {
   const data = msg.getData()

   if(typeof data === 'string') {
    console.log(`Received event #${msg.getSequence()}, with data: ${(data)}`)
   }

   msg.ack(); //sending the ack
  })
})

//whenever we restart or terminate, we call the close above
process.on('SIGINT', () => stan.close()) //interrupt signals
process.on('SIGTERM', () => stan.close()) //terminate signals