import { Text, View, StyleSheet, ActivityIndicator, Pressable, Image } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import PinPinTextArea from "@/components/PinPinTextArea";
import SquareButton from "@/components/SquareButton";
import { PinService } from "@/services/PinService";
import { ICreatePin } from "@/services/PinService";
import { Link, router } from "expo-router";
import { LocationContext } from "../_layout";
import { useCapturedImage } from "./_layout";

export default function NewPin() {
  const [pinText, setText] = useState("");
  const [creating, setCreating] = useState(false);
  const loc = useContext(LocationContext);
  const { capturedImage } = useCapturedImage()

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
    };
    const res = await PinService.createPin(newPin);

    if (!res) {
      console.error("Pin load fail");
      return;
    }
    setCreating(false);
    router.dismiss();
  }

  console.log(capturedImage)
  return (
    <View style={styles.container}>
      {creating ? <ActivityIndicator></ActivityIndicator> : <></>}
      <PinPinTextArea
        charsRemainingEnabled={true}
        textInputProps={textProp}
        onTextChange={(val) => setText(val)}
      ></PinPinTextArea>
      <View style={styles.contentContainer}>
        <Link href={"/home/create-pin/camera"} asChild>
          <SquareButton
            icon="camera"
          ></SquareButton>
        </Link>
        <SquareButton
          onPress={() => {
            createPin()
          }}
          icon="pin"
          color="#A7A6FF"
          disabled={creating}
        >
        </SquareButton>
      </View>
      <Image source={capturedImage} style={{ width: 300, height: 400 }}>
      </Image>
    </View >
  );
}

const textProp = { placeholder: "Pin something!", multiline: true };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFF9ED",
    padding: 30,
  },
  contentContainer: {
    width: "100%",
    marginTop: 30,
    flexDirection: "row",
    gap: 20,
    justifyContent: "flex-end"
  },
});
