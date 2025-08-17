import React, { useEffect, useRef } from "react";
import { CameraView, useCameraPermissions } from 'expo-camera'
import { Link } from "expo-router";
import SquareButton from "@/components/SquareButton";
import { ActivityIndicator } from "react-native";
import { useCapturedImage } from "./_layout";

export default function Camera() {
    const [permission, requestPermission] = useCameraPermissions();
    const camRef = useRef<CameraView>(null)
    const { setCapturedImage } = useCapturedImage()

    useEffect(() => {
        if (permission && !permission.granted) {
            requestPermission()
        }
    }, [])

    async function captureImage() {
        const imageRef = await camRef.current?.takePictureAsync()
        if (!imageRef)
            return

        setCapturedImage(imageRef)
    }

    if (!permission)
        return <ActivityIndicator></ActivityIndicator>

    return (
        <CameraView style={{ flex: 1 }} ref={camRef}>
            <Link href={'../'} asChild>
                <SquareButton
                    icon="x"
                    style={{ position: 'absolute', bottom: 20, right: 20 }}
                />
            </Link>
            <SquareButton
                icon="camera"
                style={{ position: 'absolute', bottom: 20, right: 40 }}
                onPress={captureImage}
            />
        </CameraView>
    )
}