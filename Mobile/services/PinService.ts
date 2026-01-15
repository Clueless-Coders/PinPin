import { API_BASE_URL } from "@/environment";
import { VisiblePin } from "@/interfaces/pin.interface";
import axios from "axios";
import { fetch } from "expo/fetch";

export interface IPin {
  id: number;
  userID: number;
  text: string;
  points: number;
  imageURL?: string;
  presignUrl?: string;
  longitude: number;
  latitude: number;
  createdAt: string;
  updatedAt: string;
  userVoteStatus: number;
}

export interface ICreatePin {
  text: string;
  longitude: number;
  latitude: number;
  isUploadingImage?: boolean;
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

  static async uploadPresignedURL(url: string, imageLocalUrl: string) {
    console.log("[PinService] Uploading image - ", imageLocalUrl);
    const fileData = await (
      await fetch(imageLocalUrl, {
        method: "GET",
      })
    ).arrayBuffer();

    const res = await fetch(url, {
      method: "PUT",
      body: fileData,
    });

    if (!res.ok) {
      console.error(
        "[PinService] IMAGE FAILED TO UPLOAD",
        res.status,
        res.statusText
      );
    }

    console.log("[PinService] Image uploaded successfully.");
  }

  static async createPin(IPin: ICreatePin, imageLocalUrl?: string) {
    try {
      const res = await axios.post<IPin>(`${API_BASE_URL}/pin`, IPin);
      const pin = res.data;

      console.log(
        "Upload details",
        IPin.isUploadingImage,
        !!res.data.presignUrl
      );

      console.log(res.data);

      if (IPin.isUploadingImage && imageLocalUrl && res.data.presignUrl)
        await PinService.uploadPresignedURL(res.data.presignUrl, imageLocalUrl);

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
