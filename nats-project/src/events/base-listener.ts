import { Message, Stan } from "node-nats-streaming"
import { Subjects } from "./subjects"

// base class will need ot be generic, where we tell all the sublasses shold have subjects and data
interface Event {
  subject: Subjects
  data: any
}

//creating abstract class to abstract the logic of the listeners
//evertime we are implementing the Listener we need give type for the Listener
// this is generic class
//T is like type
export abstract class Listener<T extends Event> {
  // Abstract fields does not require initialization
  abstract subject: T['subject']
  abstract onMessage(data: T['data'], msg: Message): void
  abstract queueGroupName: string

  // private and public fields need to be initialised in constructor
  // stan is a datatype
  private client: Stan

  protected ackWait = 5 *1000 //5ms

  // the client provided by the subclasses should be connected to the NATS server
  constructor(client: Stan) {
    this.client = client
  }

  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      //usually once the listener recevies, he immediately sends ack, but now we will send after we process it
      // if we dont send ack, after certain time, send it to again
      .setManualAckMode(true)
      //give all elements emitted in teh past when the client was down
      // downside, too many events if we get all
      .setDeliverAllAvailable() 
      // keep track of what is processes and not
      .setDurableName(this.queueGroupName)
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject, //channel name
      this.queueGroupName,  // also specifying the queue groups
      this.subscriptionOptions() //options created previously  and sends events to one insatnce of the queue groups
    )

    subscription.on('message', (msg: Message) => {
      console.log(
        `Message received: ${this.subject} / ${this.queueGroupName}}`
      )
      const parsedMsg = this.parseMessage(msg)
      this.onMessage(parsedMsg, msg)
    })

   
  }

  parseMessage(msg: Message) {
    const data = msg.getData()
    return typeof data === 'string'
    ? JSON.parse(data) // to parse if string
    : JSON.parse(data.toString('utf8')) // to parse buffer
  }

}