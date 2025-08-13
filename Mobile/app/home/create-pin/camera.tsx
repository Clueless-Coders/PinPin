import React from "react";
import { CameraView, useCameraPermissions } from 'expo-camera'
import { Link } from "expo-router";
import SquareButton from "@/components/SquareButton";

export default function Camera() {
    const [permission, requestPermission] = useCameraPermissions();
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