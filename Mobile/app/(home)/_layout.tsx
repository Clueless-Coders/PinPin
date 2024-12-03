import React from "react";
import { Stack } from "expo-router";
import Header from "@/components/Header";

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="Filters"
        options={{
          header: () => <Header color="#87CEEB" />,
        }}
      />
      <Stack.Screen
        name="NewPin"
        options={{
          header: () => <Header color="#FFC900" />,
        }}
      />
      <Stack.Screen
        name="Settings"
        options={{
          header: () => <Header color="#FF6B6B" />,
        }}
      />
      <Stack.Screen
        name="[pinId]"
        options={{
          header: () => <Header color="#FFC900" />,
        }}
      />
    </Stack>
  );
}
