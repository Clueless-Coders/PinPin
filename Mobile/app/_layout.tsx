import { Stack } from "expo-router";
import React, { createContext } from "react";

export const test = createContext(1);

export default function RootLayout() {
  return (
    <test.Provider value={5}>
      <Stack>
        <Stack.Screen name="index" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="(home)" />
      </Stack>
    </test.Provider>
  );
}
