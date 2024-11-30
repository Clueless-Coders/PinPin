import { Pin } from '@prisma/client';

export interface InvisiblePin {
  latitude: number;
  longitude: number;
  createdAt: Date;
  updatedAt: Date;
  userID: number;
  id: number;
  viewable: boolean;
}

export interface VisiblePin extends Pin {
  viewable: boolean;
}
