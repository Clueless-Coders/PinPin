import { API_BASE_URL } from "@/environment";
import { InvisiblePin, VisiblePin } from "@/interfaces/pin.interface";
import axios from "axios";

export interface IPin {
  id: number;
  userID: number;
  text: string;
  upvotes: number;
  downvotes: number;
  imageURL?: string;
  longitude: number;
  latitude: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICreatePin {
  text: string;
  imageURL?: string;
  longitude: number;
  latitude: number;
}

export interface ICreateComment {
  pinID: number;
  text: string;
}

export interface IComment {
  id: number;
  userID: number;
  pinID: number;
  text: string;
  upvotes: number;
  downvotes: number;
  createdAt: string;
}

export class PinService {
  // private pins: IPins[];
  constructor() {}
  async getPin(pinID: number): Promise<IPin> {
    try {
      const res = await axios.get<IPin>(`${API_BASE_URL}/pin/${pinID}`);
      const pin = res.data;
      return pin;
    } catch (e: any) {
      console.log("Failed to get pin ", e);
      throw new Error(e);
    }
  }

  async deletePin(pinID: number) {
    try {
      const res = await axios.delete<IPin>(`${API_BASE_URL}/pin/${pinID}`);
      const pin = res.data;
      return pin;
    } catch (e) {
      console.log("Failed to delete pin, ", e);
    }
  }

  async patchPin(pinID: number, text: string) {
    console.log("updating pin " + pinID);
    try {
      const res = await axios.patch<IPin>(`${API_BASE_URL}/pin/${pinID}`, {
        text,
      });
      const pin = res.data;
      return pin;
    } catch (e) {
      console.log("failed to update pin ", e);
    }
  }

  async createPin(IPin: ICreatePin) {
    try {
      const res = await axios.post<IPin>(`${API_BASE_URL}/pin`, IPin);
      const pin = res.data;
      return pin;
    } catch (e) {
      console.log("failed creating pin ", e);
    }
  }

  async getAllViewable() {
    try {
      const res = await axios.get<VisiblePin[]>(`${API_BASE_URL}/pin/visible`);
      const pins = res.data;
      return pins;
    } catch (e) {
      console.log("failed to get viewable pins ", e);
    }
  }

  async createComment(IComment: ICreateComment) {
    try {
      const res = await axios.post<IComment>(
        `${API_BASE_URL}/pin/comments`,
        IComment
      );
      const comment = res.data;
      return comment;
    } catch (e) {
      console.log("failed creating comment ", e);
    }
  }

  async getCommentsByPin(pinID: number) {
    try {
      const res = await axios.get<IComment[]>(
        `${API_BASE_URL}/pin/comments/${pinID}`
      );
      const comments = res.data;
      return comments;
    } catch (e) {
      console.log("Failed to get comments ", e);
    }
  }
}
