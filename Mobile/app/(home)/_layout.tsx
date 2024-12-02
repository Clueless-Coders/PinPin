import { Stack } from "expo-router";
import React from "react";

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#f4511e",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="Filters" />
      <Stack.Screen name="NewPin" />
      <Stack.Screen name="Settings" />
      <Stack.Screen name="[pinId]" />
    </Stack>
  );
}
