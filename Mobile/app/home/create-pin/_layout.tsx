import React from 'react'
import { Stack } from "expo-router";
import Header from "@/components/Header";

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{
                header: () => <Header color="#FFC900" />,
            }}></Stack.Screen>
            <Stack.Screen name="camera" options={{
                headerShown: false,
            }}></Stack.Screen>
        </Stack>
    )
}