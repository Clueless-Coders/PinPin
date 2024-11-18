import { Stack } from "expo-router";

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
