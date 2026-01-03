import { Text, View, StyleSheet, ActivityIndicator, Pressable, Image, Keyboard, KeyboardAvoidingView } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import PinPinTextArea from "@/components/PinPinTextArea";
import SquareButton from "@/components/SquareButton";
import { PinService } from "@/services/PinService";
import { ICreatePin } from "@/services/PinService";
import { Link, router } from "expo-router";
import { LocationContext } from "../_layout";
import { useCapturedImage } from "./_layout";
import PinImagePreview from "@/components/PinImagePreview";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";

import {
  CreateBucketCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  paginateListBuckets,
  PutObjectCommand,
  S3Client,
  waitUntilBucketExists,
  waitUntilObjectExists,
  waitUntilObjectNotExists,
} from '@aws-sdk/client-s3';

export default function NewPin() {
  const [pinText, setText] = useState("");
  const [creating, setCreating] = useState(false);
  const loc = useContext(LocationContext);
  const { capturedImage } = useCapturedImage()
  const [keyboardOpen, setKeyboardOpen] = useState<boolean>(false)

  // Creates the new Pin at the current location when pin button is pressed
  async function createPin() {
    setCreating(true);
    let location = loc?.location?.coords;

    if (location === undefined) {
      console.error("failure to get location");
      return;
    }

    let newPin: ICreatePin = {
      text: pinText,
      latitude: location.latitude,
      longitude: location.longitude,
      isUploadingImage: capturedImage !== null || capturedImage !== undefined
    };

    const res = await PinService.createPin(newPin, capturedImage?.base64);
    console.log("Res after returning?!?! ", res)

    if (!res) {
      console.error("Pin load fail");
      return;
    }
    setCreating(false);
    router.dismiss();
  }

  useEffect(() => {
    const subOpen = Keyboard.addListener('keyboardWillShow', () => setKeyboardOpen(true))
    const subClose = Keyboard.addListener('keyboardWillHide', () => setKeyboardOpen(false))

    return () => {
      subClose.remove()
      subOpen.remove()
    }
  }, [])

  return (
    <GestureHandlerRootView>
      <ScrollView style={{
        flex: 1,
        backgroundColor: "#FFF9ED",
      }}
      >
        <KeyboardAvoidingView style={{
          backgroundColor: "#FFF9ED",
          flex: 1
        }}>
          <View style={styles.container}>
            {creating ? <ActivityIndicator></ActivityIndicator> : <></>}
            <PinPinTextArea
              charsRemainingEnabled={true}
              textInputProps={textProp}
              onTextChange={(val) => setText(val)}
            ></PinPinTextArea>
            <PinImagePreview />
            <View style={styles.contentContainer}>
              <Link href={"/home/create-pin/camera"} asChild>
                <SquareButton
                  icon="camera"
                  style={styles.top}
                ></SquareButton>
              </Link>
              <SquareButton
                onPress={() => {
                  createPin()
                }}
                icon="pin"
                color="#A7A6FF"
                disabled={creating}
                style={styles.top}
              >
              </SquareButton>
            </View>
          </View>
          {
            keyboardOpen && (
              <View style={{ flex: 1, alignSelf: 'flex-end' }}>
                <SquareButton onPress={Keyboard.dismiss} ></SquareButton>
              </View>
            )
          }
        </KeyboardAvoidingView>
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const textProp = { placeholder: "Pin something!", multiline: true };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 30,
    zIndex: -100,
    flexDirection: 'column'
  },
  contentContainer: {
    width: "100%",
    marginTop: 30,
    flexDirection: "row",
    gap: 20,
    justifyContent: "flex-end",
    flex: 1
  },
  top: {
    zIndex: 1000
  }
});
