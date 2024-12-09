import { View, StyleSheet, ActivityIndicator } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import PinPinTextArea from "@/components/PinPinTextArea";
import SquareButton from "@/components/SquareButton";
import { PinService } from "@/services/PinService";
import { ICreatePin } from "@/services/PinService";

import * as Location from "expo-location";
import { router } from "expo-router";
import { LocationContext } from "./_layout";

const pinService = new PinService();

export default function NewPin() {
  const [pinText, setText] = useState("");
  const [creating, setCreating] = useState(false);
  const loc = useContext(LocationContext);

  // Creates the new Pin at the current location when pin button is pressed
  useEffect(() => {
    async function createPin() {
      if (creating) {
        if (pinText != "") {
          let location = loc?.location?.coords;
          if (location === undefined) {
            console.log("failure to get location");
            return;
          }
          let newPin: ICreatePin = {
            text: pinText,
            latitude: location.latitude,
            longitude: location.longitude,
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
    marginTop: 30,
    flexDirection: "row-reverse",
  },
});
