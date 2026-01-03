import { useCapturedImage } from "@/app/home/create-pin/_layout"
import { View, StyleSheet } from 'react-native'
import { Image } from 'expo-image'
import React from "react"
import SquareButton from "./SquareButton";

export default function PinImagePreview() {
    let { capturedImage, setCapturedImage } = useCapturedImage()
    if (!capturedImage)
        return <></>
    const width = capturedImage.width / 5
    const height = capturedImage.height / 5

    return (
        <View style={{ width, height }}>
            <View style={styles.shadow} />
            <View style={styles.container}>
                <Image source={capturedImage} style={{ width, margin: 5 }} contentFit="scale-down" />
                <SquareButton
                    style={{ position: 'absolute', left: width - 60, top: 10 }}
                    color="#FF6B6B"
                    icon={"x"}
                    onPress={() => setCapturedImage(undefined)}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        width: '100%',
        height: '100%',
        borderColor: 'black',
        borderWidth: 2,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    shadow: {
        backgroundColor: "black",
        position: "absolute",
        width: "100%",
        height: "100%",
        marginLeft: 2,
        marginTop: 2,
        borderRadius: 2,
    },
})