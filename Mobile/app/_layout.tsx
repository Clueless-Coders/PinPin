import { Stack } from "expo-router";
import React = require("react");

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="(home)" />
    </Stack>
  );
}
