import { Subjects } from "./subjects";

//associating artifactCreated channel with what it fields it has to contain

export interface ArtifactCreatedEvent {
  subject: Subjects.ArtifactCreated
  data: {
    id: string
    title: string
    price: number
  }
}