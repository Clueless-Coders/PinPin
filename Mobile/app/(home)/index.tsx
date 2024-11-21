import React = require("react");
import { Link } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

//Map, create pin, etc
export default function HomeIndex() {
  return (
    <View>
      <Text>Hello!</Text>
      <Link href={"/(home)/Filters"}>Filters page</Link>
      <Link href={"/(home)/NewPin"}>New Pin page</Link>
      <Link href={"/(home)/Settings"}>Settings page</Link>
      <Link href={"/(home)/0"}> PinDetail page</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    // justifyContent: "center",
    backgroundColor: "#FFF9ED",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFF9ED",
  },
});
