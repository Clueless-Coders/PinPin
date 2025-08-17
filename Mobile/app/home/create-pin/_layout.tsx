import React, { createContext, useContext, useState } from 'react'
import { Stack } from "expo-router";
import Header from "@/components/Header";
import { CameraCapturedPicture } from 'expo-camera';

interface CapturedImageContext {
    capturedImage?: CameraCapturedPicture;
    setCapturedImage: (capturedImage: CameraCapturedPicture) => void
}

const CapturedImageContext = createContext<CapturedImageContext>({
    setCapturedImage: () => { }
})

export function useCapturedImage(): CapturedImageContext {
    const context = useContext(CapturedImageContext)
    if (!context) {
        throw new Error("You must use useCapturedImage as a child of a CapturedImageContext")
    }
    return { capturedImage: context.capturedImage, setCapturedImage: context.setCapturedImage }
}

export default function RootLayout() {
    const [capturedImage, setCapturedImage] = useState<CameraCapturedPicture>()
    return (
        <CapturedImageContext.Provider value={{ capturedImage, setCapturedImage }}>
            <Stack>
                <Stack.Screen name="index" options={{
                    header: () => <Header color="#FFC900" />,
                }}></Stack.Screen>
                <Stack.Screen name="camera" options={{
                    headerShown: false,
                }}></Stack.Screen>
            </Stack>
        </CapturedImageContext.Provider>
    )
}