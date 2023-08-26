import { Message } from 'node-nats-streaming'
import {Listener} from './base-listener'

export class ArtifactCreatedListener extends Listener {
  subject = 'artifact:created'
  queueGroupName = 'payments-service'
  onMessage(data: any, msg: Message): void {
    console.log('Event data! ', data)

    msg.ack() // on successful execution of the listener
  }
  
  
}