import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import PinPinTextArea, {
  PinPinTextAreaProps,
} from "@/components/PinPinTextArea";
import SquareButton, { SquareButtonIcon } from "@/components/SquareButton";
import { PinService } from "@/services/PinService";
import { ICreatePin } from "@/services/PinService";

import * as Location from "expo-location";
import { router } from "expo-router";

const pinService = new PinService();

export async function currentLocation() {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    console.log("Permission to access location was denied");
    return;
  }

  let location = await Location.getCurrentPositionAsync({});
  return [location.coords.latitude, location.coords.longitude];
}

export default function NewPin() {
  const [pinText, setText] = useState("");
  const [creating, setCreating] = useState(false);
  useEffect(() => {
    async function createPin() {
      if (creating) {
        if (pinText != "") {
          let location = await currentLocation();
          if (location === undefined) {
            console.log("failure to get location");
            return;
          }
          let newPin: ICreatePin = {
            text: pinText,
            latitude: location[0],
            longitude: location[1],
          };
          const res = await pinService.createPin(newPin);

          if (!res) {
            console.log("Pin load fail");
            return;
          }
        }
        setCreating(false);
        router.back();
      }
    }

    createPin();
  }, [creating]);

  return (
    <View style={styles.container}>
      {creating ? <ActivityIndicator></ActivityIndicator> : <></>}
      <PinPinTextArea
        charsRemainingEnabled={true}
        textInputProps={textProp}
        onTextChange={(val) => setText(val)}
      ></PinPinTextArea>
      <View style={styles.contentContainer}>
        <SquareButton
          onPress={() => {
            setCreating(true);
          }}
          icon="pin"
          color="#A7A6FF"
        >
          {/*  */}
        </SquareButton>
      </View>
    </View>
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
    // backgroundColor: 'black',

    marginTop: 30,
    flexDirection: "row-reverse",
  },
});
