import { API_BASE_URL } from "@/environment";
import { User } from "@/interfaces/user.interface";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export interface ITokens {
  access_token: string;
}

export interface IJWTPayload {
  email: string;
  id: number;
  iat: number;
  exp: number;
}
export class AuthService {
  private tokens?: ITokens;
  private currUser?: User;

  constructor() {
    axios.interceptors.request.use((config) => {
      //console.log("Hello!", config);
      config.headers.Authorization =
        "Bearer " + (this.tokens?.access_token ?? "");
      return config;
    });
  }

  /**
   * Logs in the user with the given email and password. Automatically stores
   * access tokens for subsequent requests.
   * @param email
   * @param password
   * @returns
   */
  async login(email: string, password: string): Promise<User> {
    try {
      /*const res = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });*/
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

      return this.currUser;
    } catch (e: any) {
      throw new Error(e);
    }
  }

  isLoggedIn() {
    return this.tokens !== undefined || this.currUser !== undefined;
  }
}
