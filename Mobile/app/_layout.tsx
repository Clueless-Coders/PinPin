import { AuthService } from "@/services/AuthService";
import { Stack } from "expo-router";
import React, { useEffect } from "react";

export const authService = new AuthService();

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="home" />
    </Stack>
  );
}
