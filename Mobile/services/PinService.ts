import { API_BASE_URL } from "@/environment";
import { InvisiblePin, VisiblePin } from "@/interfaces/pin.interface";
import axios from "axios";


export interface IPins {
    id: number;
    userID: number;
    text: string;
    upvotes: number;
    downvotes: number;
    imageURL?: string;
    longitude: number;
    latitude: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICreatePin {
    text: string;
    imageURL?: string;
    longitude: number;
    latitude: number;
}

export class PinService {
    // private pins: IPins[];
    constructor() { }
    async getPin(pinID: number): Promise<IPins | undefined> {
        console.log("starting fetching");
        try {
            const res = await axios.get<IPins>(`${API_BASE_URL}/pin/${pinID}`);
            const pin = res.data;
            console.log(pin);
            return pin;
        } catch (e) {
            console.log("Failed to get pin ", e);
        }
    }

    async deletePin(pinID: number) {
        console.log("deleting pin " + pinID);
        try {
            const res = await axios.delete<IPins>(`${API_BASE_URL}/pin/${pinID}`);
            const pin = res.data;
            console.log(pin);
            return pin;
        } catch (e) {
            console.log("Failed to delete pin, ", e);
        }
    }

    async patchPin(pinID: number, text: string) {
        console.log("updating pin " + pinID);
        try {
            const res = await axios.patch<IPins>(`${API_BASE_URL}/pin/${pinID}`, { text });
            const pin = res.data;
            console.log(pin);
            return pin;
        } catch (e) {
            console.log("failed to update pin ", e);
        }
    }

    async createPin(IPin: ICreatePin) {
        console.log("creating pin ");
        try {
            const res = await axios.post<IPins>(`${API_BASE_URL}/pin`, IPin);
            const pin = res.data;
            console.log(pin);
            return pin;
        } catch (e) {
            console.log("failed creating pin ", e);
        }
    }

    async getAllViewable() {
        console.log("getting viewable pins");
        try {
            const res = await axios.get<VisiblePin[]>(`${API_BASE_URL}/pin/visible`);
            const pins = res.data;
            console.log(pins);
            return pins;
        } catch (e) {
            console.log("failed to get viewable pins ", e);
        }
    }


}