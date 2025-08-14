import React, { useEffect } from "react";
import { CameraView, useCameraPermissions } from 'expo-camera'
import { Link } from "expo-router";
import SquareButton from "@/components/SquareButton";
import { ActivityIndicator } from "react-native";

export default function Camera() {
    const [permission, requestPermission] = useCameraPermissions();

    useEffect(() => {
        if (permission && !permission.granted) {
            requestPermission()
        }
    }, [])

    // still loading permissions
    if (!permission)
        return <ActivityIndicator></ActivityIndicator>

    return (
        <CameraView style={{ flex: 1 }}>
            <Link href={'../'} asChild>
                <SquareButton
                    icon="camera"
                    style={{ position: 'absolute', bottom: 20, right: 20 }}
                />
            </Link>
        </CameraView>
    )
}