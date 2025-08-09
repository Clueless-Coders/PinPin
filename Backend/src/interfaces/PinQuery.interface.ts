import { Pin } from '@prisma/client';

export interface PinQuery extends Pin {
  points: number; //total number of upvotes/downvotes this pin has
}
