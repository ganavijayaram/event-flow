import { Publisher } from "./base-publisher";
import { ArtifactCreatedEvent } from "./artifact-created-events";
import { Subjects } from "./subjects";



export class ArtifactCreatedPublisher extends Publisher<ArtifactCreatedEvent> {
  subject: Subjects.ArtifactCreated = Subjects.ArtifactCreated;

  


}