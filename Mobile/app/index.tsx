import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";

export default function Index() {
  //TODO: Set up the authentication logic.
  //This is where the logic will be implemented to swap from Login/Sign Up pages to the main app.
  //Maybe use some kind of custom hook & context provider to help w/ global user state
  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/(home)");
    }
    return () => setLoggedIn(false);
  }, [isLoggedIn]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Link href="/signup">Click here for signup</Link>
      <Button title="Login" onPress={() => setLoggedIn(true)}></Button>
    </View>
  );
}
