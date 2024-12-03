export interface VisiblePin {
  id: number;
  userID: number;
  text: string;
  upvotes: 0;
  downvotes: 0;
  imageURL?: string;
  longitude: number;
  latitude: number;
  createdAt: string;
  updatedAt: string;
  viewable: boolean;
  distanceInMiles?: number;
}

export interface InvisiblePin {
  id: number;
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
  userId: number;
  viewable: boolean;
}

export interface PinLocationRangeData {
  visible: VisiblePin[];
  invisible: InvisiblePin[];
}
