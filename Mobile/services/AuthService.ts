import { API_BASE_URL } from "@/environment";
import { User } from "@/interfaces/user.interface";
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

  /**
   * Logs in the user with the given email and password. Automatically stores
   * access tokens for subsequent requests.
   * @param email
   * @param password
   * @returns
   */
  async login(email: string, password: string): Promise<User> {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      const token: ITokens = await res.json();

      if (res.status !== 200) {
        throw new Error("Error on sign in");
      }

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
