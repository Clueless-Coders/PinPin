import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function PinDetail() {
  const params = useLocalSearchParams();
  return (
    <View>
      <Text>{JSON.stringify(params)}</Text>
    </View>
  );
}
