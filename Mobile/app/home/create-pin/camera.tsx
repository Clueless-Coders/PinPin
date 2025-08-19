import React, { useEffect, useRef, useState } from "react";
import { CameraView, useCameraPermissions } from 'expo-camera'
import { Link, router } from "expo-router";
import SquareButton from "@/components/SquareButton";
import { ActivityIndicator, View } from "react-native";
import { useCapturedImage } from "./_layout";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Camera() {
    const [permission, requestPermission] = useCameraPermissions();
    const [ready, setReady] = useState(false)
    const camRef = useRef<CameraView>(null)
    const { setCapturedImage } = useCapturedImage()

    useEffect(() => {
        if (permission && !permission.granted) {
            requestPermission()
        }
    }, [])

    async function captureImage() {
        const imageRef = await camRef.current?.takePictureAsync({
            exif: false,
            quality: .5
        })
        if (!imageRef)
            return
        setCapturedImage(imageRef)
        router.dismiss()
    }

    if (!permission)
        return <ActivityIndicator></ActivityIndicator>

    return (
        <CameraView ref={camRef} ratio="4:3" autofocus='on' onCameraReady={() => setReady(true)} style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1, flexDirection: 'row-reverse', justifyContent: 'center', alignItems: 'flex-end' }}>
                <View style={{ flexDirection: 'row', gap: 30 }}>
                    <Link href={'../'} asChild>
                        <SquareButton
                            icon="x"
                            size={75}
                            color="#FF6B6B"
                        />
                    </Link>
                    <SquareButton
                        icon="camera"
                        onPress={captureImage}
                        disabled={!ready}
                        size={75}
                    />
                </View>
            </SafeAreaView>
        </CameraView>
    )
}