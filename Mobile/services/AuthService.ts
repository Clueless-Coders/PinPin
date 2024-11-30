import { API_BASE_URL } from "@/environment";
import { User } from "@/interfaces/user.interface";
import axios from "axios";
import { router } from "expo-router";
import { jwtDecode } from "jwt-decode";

export interface ITokens {
  access_token: string;
  refresh_token: string;
}

export interface IJWTPayload {
  email: string;
  id: number;
  iat: number;
  exp: number;
}

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

export class AuthService {
  private tokens?: ITokens;
  private currUser?: User;

  constructor() {
    //Set up axios to intercept each HTTP message
    //Adds access_token to all requests except for refresh endpoint
    //Attaches refresh_token on refresh endpoint
    axios.interceptors.request.use((config) => {
      let tokenToInject = this.tokens?.access_token;

      if (config.url === `${API_BASE_URL}/auth/refresh`)
        tokenToInject = this.tokens?.refresh_token;

      config.headers.Authorization = "Bearer " + tokenToInject;

      return config;
    });

    axios.interceptors.response.use((value) => {
      if (value.status === 401) router.replace("/");
      return value;
    });
  }

  /**
   * Logs in the user with the given email and password. Automatically stores
   * access tokens for subsequent requests.
   * @param email
   * @param password
   * @returns
   */
  async login(email: string, password: string): Promise<User | undefined> {
    try {
      const res = await axios.post<ITokens>(`${API_BASE_URL}/auth/signin`, {
        email,
        password,
      });

      const token = res.data;

      this.tokens = token;
      const payload = jwtDecode<IJWTPayload>(this.tokens.access_token);

      this.currUser = {
        email: payload.email as string,
        id: payload.id as number,
      };

      //Convert expiration time to ms then calc time to expiration
      this.scheduleNextRefresh(payload.exp);

      return this.currUser;
    } catch (e: any) {
      console.log(e);
      return;
    }
  }

  isLoggedIn() {
    return this.tokens !== undefined || this.currUser !== undefined;
  }

  /**
   * Refreshes the current access_token with one that is valid.
   */
  refreshToken = async () => {
    try {
      if (!this.isLoggedIn) return;

      const res = await axios.post(`${API_BASE_URL}/auth/refresh`);
      const accessToken: string = res.data.access_token;

      if (!this.tokens) return;

      this.tokens.access_token = accessToken;

      const payload = jwtDecode<IJWTPayload>(this.tokens.access_token);

      this.scheduleNextRefresh(payload.exp);
    } catch (e: any) {
      console.log("Failed to refresh access_token", e);
      this.currUser = undefined;
      this.tokens = undefined;
      router.replace("/");
    }
  };

  /**
   * Given the token's expiration date, schedule the next refresh
   * @param payloadExpr
   */
  scheduleNextRefresh(payloadExpr: number) {
    const now = new Date().getTime();
    const timeToExpireInMs = payloadExpr * 1000 - now;
    console.log("Refresh scheduled in " + timeToExpireInMs / 1000);
    setTimeout(() => {
      console.log("Refreshing token...");
      this.refreshToken();
    }, timeToExpireInMs - 1000);
  }
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
      console.log("Failed to get pin");
      console.log(e);
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
      console.log("Failed to delete pin.");
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
      console.log("failed to update pin");
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
      console.log("failed creating pin");
    }
  }
}
