import { API_BASE_URL } from "@/environment";
import { User } from "@/interfaces/user.interface";

export class AuthService {
  constructor(private user?: User) {}

  async login(email: string, password: string) {
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
      const user = await res.json();

      console.log(user);
      if (user.statusCode !== "200") {
        throw new Error("Error on sign in");
      }
      return user;
    } catch (e: any) {
      throw new Error(e);
    }
  }
}
