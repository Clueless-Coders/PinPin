import { Stack } from "expo-router";
import React from "react";

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="Filters" />
      <Stack.Screen name="NewPin" />
      <Stack.Screen name="Settings" />
      <Stack.Screen name="[pinId]" />
    </Stack>
  );
}
