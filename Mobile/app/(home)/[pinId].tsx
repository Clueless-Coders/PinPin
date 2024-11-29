import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { PinService } from "@/services/AuthService"; // Assume this is the service that provides getPin
import { IPins } from "@/services/AuthService";

const pinService = new PinService();

export default function PinDetail() {
  const [pin, setPin] = useState<IPins | null>(null);// State to store pin data

  useEffect(() => {
    const fetchPin = async () => {
      try {
        const fetchedPin = await pinService.getPin(3); // Call the async function
        setPin(fetchedPin); // Update state with fetched pin
      } catch (error) {
        console.error("Error fetching pin:", error);
      }
    };

    fetchPin(); // Invoke the async function
    console.log("inside useEffects");
  }, []); // Empty dependency array to run this effect only once

  return (
    <View>
      <Text>Pin Detail Page</Text>
      {pin ? <Text>Pin: {JSON.stringify(pin)}</Text> : <Text>Loading...</Text>}
    </View>
  );
}
