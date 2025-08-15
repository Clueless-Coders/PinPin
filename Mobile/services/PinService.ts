import { API_BASE_URL } from "@/environment";
import { InvisiblePin, VisiblePin } from "@/interfaces/pin.interface";
import axios from "axios";
import { DO_NOT_USE_OR_YOU_WILL_BE_FIRED_CALLBACK_REF_RETURN_VALUES } from "react";

export interface IPin {
  id: number;
  userID: number;
  text: string;
  points: number;
  imageURL?: string;
  longitude: number;
  latitude: number;
  createdAt: string;
  updatedAt: string;
  userVoteStatus: number;
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
  constructor() {}
  static async getPin(pinID: number): Promise<IPin> {
    try {
      const res = await axios.get<IPin>(`${API_BASE_URL}/pin/${pinID}`);
      const pin = res.data;
      return pin;
    } catch (e: any) {
      console.log("Failed to get pin ", e);
      throw new Error(e);
    }
  }

  static async deletePin(pinID: number) {
    try {
      const res = await axios.delete<IPin>(`${API_BASE_URL}/pin/${pinID}`);
      const pin = res.data;
      return pin;
    } catch (e) {
      console.log("Failed to delete pin, ", e);
    }
  }

  static async patchPin(pinID: number, text: string) {
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

  static async createPin(IPin: ICreatePin) {
    try {
      const res = await axios.post<IPin>(`${API_BASE_URL}/pin`, IPin);
      const pin = res.data;
      return pin;
    } catch (e) {
      console.log("failed creating pin ", e);
    }
  }

  static async getAllViewable() {
    try {
      const res = await axios.get<VisiblePin[]>(`${API_BASE_URL}/pin/visible`);
      const pins = res.data;
      return pins;
    } catch (e) {
      console.log("failed to get viewable pins ", e);
    }
  }

  static async createComment(IComment: ICreateComment) {
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

  static async getCommentsByPin(pinID: number) {
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

  static async togglePinVote(
    pinId: number,
    isUpvote: boolean
  ): Promise<
    { points: number; message: string; userVoteStatus: number } | undefined
  > {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/pin/${pinId}/${isUpvote ? "upvote" : "downvote"}`
      );
      return res.data;
    } catch (e) {
      console.log("Failed to upvote pin ", e);
    }
  }
}
