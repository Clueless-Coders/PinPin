import { AuthService } from "@/services/AuthService";
import { Link, router } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { test } from "./_layout";

export const authService = new AuthService();

export default function Index() {
  //TODO: Set up the authentication logic.
  //This is where the logic will be implemented to swap from Login/Sign Up pages to the main app.
  //Maybe use some kind of custom hook & context provider to help w/ global user state
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  console.log(useContext(test));

  useEffect(() => {
    async function login() {
      try {
        //if email or pw not provided, don't attempt login
        if (email.length === 0 || password.length === 0) return;

        const user = await authService.login(email, password);
        console.log(user);
        if (user) {
          router.replace("/(home)");
        }
      } catch (e) {
        console.log(e);
      }
      setIsLoggingIn(false);
    }

    login();
  }, [isLoggingIn]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Link href="/signup">Click here for signup</Link>

      <Button title="Login" onPress={() => setIsLoggingIn(true)}></Button>

      <TextInput
        style={{ height: 40, borderColor: "black", borderRadius: 3 }}
        placeholder="Email"
        onChangeText={(val) => setEmail(val)}
      ></TextInput>

      <TextInput
        style={{
          paddingTop: 10,
          height: 40,
          borderColor: "black",
          borderRadius: 3,
        }}
        placeholder="Password"
        onChangeText={(val) => setPassword(val)}
      ></TextInput>
    </View>
  );
}
