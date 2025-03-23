import { Redirect, router } from "expo-router";
import React from "react";
import { useEffect, useState } from "react";
import {
  View,
  Image,
  Pressable,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import PinPinTextArea from "@/components/PinPinTextArea";
import SquareButton from "@/components/SquareButton";
import { authService } from "./_layout";

export default function Index() {
  const [isLoggingIn, setIsLoggingIn] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    async function login() {
      if (email.length === 0 || password.length === 0) {
        setIsProcessing(false);
        return;
      }

      try {
        // Take appropriate action depending on login/signup state
        if (isLoggingIn) await authService.login(email, password, true);
        else await authService.signup({ email, password });

        // Redirect to Home page if login success
        if (authService.isLoggedIn()) {
          setEmail("");
          setPassword("");
          setLoggedIn(true);
        }
      } catch (e) {
        console.log(e);
      }
      setIsProcessing(false);
    }

    login();
  }, [isProcessing]);

  useEffect(() => {
    const id = authService.addListener((user) => {
      if (user) {
        setLoggedIn(true);
        console.log("Logged in!");
      }
    });

    authService.loginUsingSavedToken();

    return () => {
      authService.removeListener(id);
    };
  }, []);

  useEffect(() => {
    if (loggedIn) {
      console.log("going home");
      router.push("/home/");
    }
  }, [loggedIn]);

  console.log("render");

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{
        backgroundColor: "#FFF9ED",
      }}
    >
      <View
        style={{
          justifyContent: "flex-start",
          alignItems: "center",
          top: "15%",
          height: "100%",
        }}
      >
        <Image
          source={require("@/assets/images/PinPin_Logo.png")}
          style={{
            width: 150,
            height: 205,
          }}
        />
        <Text
          style={{
            fontSize: 50,
            paddingBottom: 10,
            fontFamily: "VisbyRoundCF-Bold",
            padding: 20,
          }}
        >
          P!nPin
        </Text>
        <PinPinTextArea
          style={{
            marginBottom: "5%",
            height: 58,
            width: 300,
          }}
          textInputProps={{
            placeholder: "Email",
            autoCapitalize: "none",
            inputMode: "email",
          }}
          onTextChange={(val) => setEmail(val)}
        ></PinPinTextArea>

        <PinPinTextArea
          style={{
            marginBottom: "5%",
            height: 58,
            width: 300,
          }}
          textInputProps={{
            secureTextEntry: true,
            placeholder: "Password",
            autoCapitalize: "none",
          }}
          onTextChange={(val) => setPassword(val)}
        ></PinPinTextArea>

        <SquareButton
          width={180}
          height={60}
          text={isLoggingIn ? "Login" : "Signup"}
          onPress={() => setIsProcessing(true)}
          disabled={isProcessing}
          color={!isLoggingIn ? "#A7A6FF" : undefined}
        />

        {
          // Swap state between signing up or signing in
        }
        <Pressable
          onPress={() => setIsLoggingIn(!isLoggingIn)}
          style={{
            top: 100,
          }}
        >
          <Text
            style={{
              textDecorationLine: "underline",
              fontWeight: "bold",
            }}
          >
            {isLoggingIn
              ? "Don't have an account? Sign up!"
              : "Already have an account? Log in!"}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
