import PinPost from "@/components/PinPost";
import { AuthService } from "@/services/AuthService";
import { Link, Redirect, router } from "expo-router";
import React from "react";
import { useEffect, useState } from "react";
import { Button, TextInput, View, Image } from "react-native";
import PinPinTextArea from "@/components/PinPinTextArea";

export const authService = new AuthService();

export default function SignupScreen() {
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [SignedUp, setSignedUp] = useState(false);

  const signup = () => {
    async function signup() {

      //if email or pw not provided, don't attempt login
      if (email.length === 0 || password.length === 0) {
        setIsSigningUp(false);
        return;
      }

      try {
        const user = await authService.signup({ email, password });
        console.log(user);

        if (authService.isLoggedIn()) {
          setEmail("");
          setPassword("");
          setSignedUp(true);
          router.replace("/home/")
        }
      } catch (e) {
        console.log(e);
      }
      setIsSigningUp(false);
    }

    signup();
  }

  //if (SignedUp) return <Redirect href={"/home"}></Redirect>;

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

      <Button
        title="Signup"
        onPress={() => { setIsSigningUp(true); signup(); }}
        disabled={isSigningUp}
      ></Button>

      <Link
        href="/"
        style={{
          top: 100,
          textDecorationLine: 'underline',
          fontWeight: 'bold'
        }}>
        Already have an account? Login!
      </Link>
    </View>
  );
}

