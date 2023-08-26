import nats, {Message} from 'node-nats-streaming'
import { randomBytes } from 'crypto'

console.clear()

// creating random auto generated id for client so we can run multiple copies of the same
const stan = nats.connect('vintagegalleria', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222' // we are trying to connect to NATS running in a pod in K8
})

stan.on('connect', () => {
  console.log('Listener connected to NATS')

  

  //creating subscription and listening to the channel artifact:created
  const subscription = stan.subscribe(
    'artifact:created', //channel name
    'orders-service-queue-group' // also specifying the queue groups
    )

  subscription.on('message', (msg: Message) => {
   const data = msg.getData()

   if(typeof data === 'string') {
    console.log(`Received event #${msg.getSequence()}, with data: ${(data)}`)
   }
  })
})