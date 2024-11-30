import React, { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";
import { PinService } from "@/services/AuthService"; // Assume this is the service that provides getPin
import { TextInput } from "react-native";
import { IPins, ICreatePin } from "@/services/AuthService";

const pinService = new PinService();

export default function PinDetail() {
  const [pin, setPin] = useState<IPins | null>(null);// State to store pin data
  const [pinText, setText] = useState('');
  const [pinID, setID] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [buttonValue, setButton] = useState(0);
  const [requesting, isRequesting] = useState(false);
  // const []

  useEffect(() => {
    const updatePin = async () => {
      try {
        console.log(buttonValue);
        let fetchedPin: IPins | undefined;
        if (buttonValue == 0) {
          return;
        } else if (buttonValue == 1) {
          fetchedPin = await pinService.deletePin(+pinID);
        } else if (buttonValue == 2) {
          fetchedPin = await pinService.getPin(+pinID); // Call the async function
        } else if (buttonValue == 3) {
          fetchedPin = await pinService.patchPin(+pinID, pinText);
        } else if (buttonValue == 4) {
          let newPin: ICreatePin = { text: pinText, latitude: +latitude, longitude: +longitude };
          fetchedPin = await pinService.createPin(newPin);
        }
        setPin((fetchedPin !== undefined) ? fetchedPin : null); // Update state with fetched pin
        setButton(0);
        isRequesting(false);
      } catch (error) {
        console.error("Error updating pin info", error);
      }
    };

    updatePin(); // Invoke the async function
    console.log("inside useEffects");
  }, [requesting]); // Empty dependency array to run this effect only once

  return (
    <View>
      <Text>Pin Detail Page</Text>
      {pin ? <Text>Pin: {JSON.stringify(pin)}</Text> : <Text>Loading...</Text>}

      <TextInput
        style={{
          paddingTop: 10,
          height: 40,
          borderColor: "black",
          borderRadius: 3,
        }}
        placeholder="pinID"
        onChangeText={(val) => setID(val)}
      ></TextInput>

      <Button
        title="Delete"
        onPress={() => { setButton(1); isRequesting(true) }}
        disabled={!isRequesting}
      ></Button>

      <Button
        title="Get"
        onPress={() => { setButton(2); isRequesting(true) }}
        disabled={!isRequesting}
      ></Button>

      <TextInput
        style={{ height: 40, borderColor: "black", borderRadius: 3 }}
        placeholder="pin text"
        onChangeText={(val) => setText(val)}
      ></TextInput>

      <TextInput
        style={{
          paddingTop: 10,
          height: 40,
          borderColor: "black",
          borderRadius: 3,
        }}
        placeholder="latitude"
        onChangeText={(val) => setLatitude(val)}
      ></TextInput>

      <TextInput
        style={{
          paddingTop: 10,
          height: 40,
          borderColor: "black",
          borderRadius: 3,
        }}
        placeholder="longitude"
        onChangeText={(val) => setLongitude(val)}
      ></TextInput>


      <Button
        title="Patch"
        onPress={() => { setButton(3); isRequesting(true) }}
        disabled={!isRequesting}
      ></Button>


      <Button
        title="Create"
        onPress={() => { setButton(4); isRequesting(true) }}
        disabled={!isRequesting}
      ></Button>
    </View>
  );
}
