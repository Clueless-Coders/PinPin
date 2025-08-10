import { Pin } from '@prisma/client';

export interface PinQuery extends Pin {
  points: number; //total number of upvotes/downvotes this pin has
  userVoteStatus: number; //1 if user upvoted, -1 if downvoted, 0 if no interaction
}
