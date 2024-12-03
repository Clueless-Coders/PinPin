import React, { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";
import { PinService } from "@/services/PinService";
import { TextInput } from "react-native";
import { IPins, ICreatePin } from "@/services/PinService";
import { useLocalSearchParams } from "expo-router";

const pinService = new PinService();

export default function PinDetail() {
  const [pin, setPin] = useState<IPins | null>(null); // State to store pin data
  const [pinText, setText] = useState("");
  const [pinID, setID] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [buttonValue, setButton] = useState(0);
  const [requesting, isRequesting] = useState(false);
  const { pinId } = useLocalSearchParams();
  // const []

  useEffect(() => {
    const pinService = new PinService();
    async function fetchPin() {
      console.log(pinId);
      const pin = await pinService.getPin(+pinId);
      console.log(pin);
      setPin(pin);
    }

    fetchPin();
  }, []);

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
        onPress={() => {
          setButton(1);
          isRequesting(true);
        }}
        disabled={!isRequesting}
      ></Button>

      <Button
        title="Get"
        onPress={() => {
          setButton(2);
          isRequesting(true);
        }}
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
        onPress={() => {
          setButton(3);
          isRequesting(true);
        }}
        disabled={!isRequesting}
      ></Button>

      <Button
        title="Create"
        onPress={() => {
          setButton(4);
          isRequesting(true);
        }}
        disabled={!isRequesting}
      ></Button>
    </View>
  );
}
