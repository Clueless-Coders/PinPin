import React, { useEffect, useRef, useState } from "react";
import { CameraView, useCameraPermissions } from 'expo-camera'
import { Link, router } from "expo-router";
import SquareButton from "@/components/SquareButton";
import { ActivityIndicator, View, Text } from "react-native";
import { useCapturedImage } from "./_layout";
import { SafeAreaView } from "react-native-safe-area-context";
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator'

export default function Camera() {
    const [permission, requestPermission] = useCameraPermissions();
    const [ready, setReady] = useState(false)
    const [saving, setSaving] = useState(false)
    const camRef = useRef<CameraView>(null)
    const { setCapturedImage } = useCapturedImage()

    useEffect(() => {
        if (permission && !permission.granted) {
            requestPermission()
        }
    }, [])

    async function captureImage() {
        await camRef.current?.pausePreview()
        let imageRef = await camRef.current?.takePictureAsync({
            exif: false,
        })

        if (!imageRef) {
            await camRef.current?.resumePreview()
            return
        }

        // Downsize to 1080p vertical, then compress and save as webp, to save space
        const image = await ImageManipulator.manipulate(imageRef.uri)
            .renderAsync()
        imageRef = await image.saveAsync({ format: SaveFormat.JPEG, compress: .5, base64: true })
        setCapturedImage(imageRef)

        router.dismiss()
    }

    if (!permission)
        return (
            <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row' }}>
                <View></View>
            </View>
        )

    return (
        <>
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
                            onPress={() => { setSaving(true); captureImage() }}
                            disabled={!ready}
                            size={75}
                        />
                    </View>
                </SafeAreaView>
            </CameraView>
            {saving ? <View style={{ position: 'absolute', alignSelf: 'center', flexDirection: 'column', justifyContent: 'center', top: '35%' }}>
                <View style={{
                    backgroundColor: 'white', width: 200, height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center',
                    borderColor: "black",
                    borderWidth: 1.5,
                }}>
                    <Text style={{ fontFamily: "OverpassMono-Light" }}>
                        Saving...
                    </Text>
                    <ActivityIndicator />
                </View>
            </View> : <></>}
        </>
    )
}