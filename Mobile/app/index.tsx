import PinPost from "@/components/PinPost";
import { AuthService } from "@/services/AuthService";
import { Link, Redirect, router } from "expo-router";
import React from "react";
import { useEffect, useState } from "react";
import { Button, TextInput, View, Image } from "react-native";
import PinPinTextArea from "@/components/PinPinTextArea";

export const authService = new AuthService();

export default function Index() {
  //TODO: Set up the authentication logic.
  //This is where the logic will be implemented to swap from Login/Sign Up pages to the main app.
  //Maybe use some kind of custom hook & context provider to help w/ global user state
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    async function login() {
      if (authService.isLoggedIn()) {
        console.log("Hi");
        router.replace("/(home)");
      }

      //if email or pw not provided, don't attempt login
      if (email.length === 0 || password.length === 0) {
        setIsLoggingIn(false);
        return;
      }

      try {
        const user = await authService.login(email, password);
        console.log(user);

        if (authService.isLoggedIn()) {
          setEmail("");
          setPassword("");
          setLoggedIn(true);
        }
      } catch (e) {
        console.log(e);
      }
      setIsLoggingIn(false);
    }

    login();
  }, [isLoggingIn]);

  if (loggedIn) return <Redirect href={"/home/"}></Redirect>;

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button
        title="Login"
        onPress={() => setIsLoggingIn(true)}
        disabled={isLoggingIn}
      ></Button>

      <PinPinTextArea
        style={{
          marginTop: 10,
          marginBottom: 10,
        }}
        onTextChange={(val) => setEmail(val)}
      ></PinPinTextArea>

      <PinPinTextArea
        style={{
          marginBottom: 10,
        }}
        onTextChange={(val) => setPassword(val)}
      ></PinPinTextArea>
      <Link
        href="/signup"
        style={{
          top: 280,
          textDecorationLine: "underline",
          fontWeight: "bold",
        }}
      >
        Don't have an account? Sign up!
      </Link>
    </View>
  );
}
