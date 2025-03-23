import { API_BASE_URL } from "@/environment";
import { User } from "@/interfaces/user.interface";
import axios, { AxiosError, AxiosResponse } from "axios";
import { router } from "expo-router";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

export interface Account {
  email: string;
  password: string;
}

export class AuthService {
  private tokens?: ITokens;
  private currUser?: User;

  private authChangeListeners: (((user?: User) => void) | undefined)[] = [];

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
      if (value.status === 401) console.log("unauthorized");
      return value;
    });
  }

  callAuthChangeListeners() {
    for (const fun of this.authChangeListeners) if (fun) fun(this.currUser);
  }

  addListener(callback: (user?: User) => void): number {
    this.authChangeListeners.push(callback);
    return this.authChangeListeners.length - 1;
  }

  removeListener(id: number): boolean {
    if (id < 0 || id > this.authChangeListeners.length) return false;
    this.authChangeListeners[id] = undefined;
    return true;
  }

  async restoreSavedRefreshToken(): Promise<string | null> {
    const data = await AsyncStorage.getItem("token");
    if (!data) return null;

    this.tokens = { refresh_token: data, access_token: "" };
    return data;
  }

  async removeSavedToken() {
    await AsyncStorage.removeItem("token");
  }

  async saveRefreshToken(token: string) {
    await AsyncStorage.setItem("token", token);
  }

  async logout() {
    this.currUser = undefined;
    this.tokens = undefined;

    this.removeSavedToken();
    this.callAuthChangeListeners();
  }

  async loginUsingSavedToken(): Promise<boolean> {
    await this.restoreSavedRefreshToken();
    if (!this.tokens?.refresh_token) return false;

    console.log(jwtDecode(this.tokens.refresh_token));
    console.log(this.tokens.refresh_token);
    await this.refreshToken();
    this.callAuthChangeListeners();

    return true;
  }

  /**
   * Logs in the user with the given email and password. Automatically stores
   * access tokens for subsequent requests.
   * @param email
   * @param password
   * @returns
   */

  async signup(newUser: Account) {
    try {
      const res = await axios.post<User>(`${API_BASE_URL}/user`, newUser);
      const account = res.data;
      const loginRes = await this.login(newUser.email, newUser.password);
      return account;
    } catch (e: any) {
      throw new Error(e.response.data.message);
    }
  }

  async login(
    email: string,
    password: string,
    rememberMe: boolean = false
  ): Promise<User | undefined> {
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
    } catch (e: any) {
      throw new Error(e.response.data.message);
    }

    if (rememberMe && this.tokens?.refresh_token)
      this.saveRefreshToken(this.tokens.refresh_token);

    this.callAuthChangeListeners();
    return this.currUser;
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
      this.currUser = {
        email: payload.email as string,
        id: payload.id as number,
      };

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
