import { Message } from 'node-nats-streaming'
import {Listener} from './base-listener'
import { Subjects } from './subjects'
import { ArtifactCreatedEvent } from './artifact-created-events'


export class ArtifactCreatedListener extends Listener<ArtifactCreatedEvent> {
  // readonly =  final
  readonly subject: Subjects.ArtifactCreated = Subjects.ArtifactCreated
  queueGroupName = 'payments-service'
  onMessage(data: ArtifactCreatedEvent['data'], msg: Message): void {
    console.log('Event data! ', data)

    msg.ack() // on successful execution of the listener
  }
  
  
}