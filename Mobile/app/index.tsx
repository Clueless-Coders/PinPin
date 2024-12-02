import PinPost from "@/components/PinPost";
import { AuthService } from "@/services/AuthService";
import { Link, Redirect, router } from "expo-router";
import React from "react";
import { useEffect, useState } from "react";
import { Button, TextInput, View, Image, Pressable, Text } from "react-native";
import PinPinTextArea from "@/components/PinPinTextArea";
import SquareButton from "@/components/SquareButton";


export const authService = new AuthService();

export default function Index() {
  //TODO: Set up the authentication logic.
  //This is where the logic will be implemented to swap from Login/Sign Up pages to the main app.
  //Maybe use some kind of custom hook & context provider to help w/ global user state
  const [isLoggingIn, setIsLoggingIn] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
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
        setIsProcessing(false);
        return;
      }

      try {
        let ret;
        if (isLoggingIn)
          ret = await authService.login(email, password);
        else
          ret = await authService.signup({ email, password });

        console.log(ret);
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

  if (loggedIn) return <Redirect href={"/home/"}></Redirect>;

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFF9ED"
      }}
    >

      <Image
        source={require('@/assets/images/PinPin_Logo.png')}
        style={{
          width: 225,
          height: 306,
          bottom: 50
        }}
      />

      <PinPinTextArea
        style={{
          marginBottom: "5%",
          height: 58,
          width: 300
        }}
        textInputProps={{
          placeholder: "Email"
        }}
        onTextChange={(val) => setEmail(val)}
      ></PinPinTextArea>

      <PinPinTextArea
        style={{
          marginBottom: "5%",
          height: 58,
          width: 300
        }}
        textInputProps={{
          secureTextEntry: true,
          placeholder: "Password"
        }}
        onTextChange={(val) => setPassword(val)}
      ></PinPinTextArea>

      <SquareButton
        width={180}
        height={60}
        text={isLoggingIn ? "Login" : "Signup"}
        onPress={() => setIsProcessing(true)}
        disabled={isProcessing}
      />

      <Pressable
        onPress={() => setIsLoggingIn(!isLoggingIn)}
        style={{
          top: 100,
        }}>
        <Text style={{
          textDecorationLine: 'underline',
          fontWeight: 'bold'
        }}>
          {
            isLoggingIn ? "Don't have an account? Sign up!" : "Already have an account? Log in!"
          }
        </Text>
      </Pressable>
    </View>
  );
}
