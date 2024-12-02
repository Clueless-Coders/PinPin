import React, { useState } from "react";
import { StyleProp, StyleSheet, Text, TextInput, View } from "react-native";

export interface PinPinTextAreaProps {
  charsRemainingEnabled?: boolean;
  style?: any;
  onTextChange?: (text: string) => void;
  textInputProps?: any;
}

export default function PinPinTextArea({
  charsRemainingEnabled,
  style,
  onTextChange,
  textInputProps,
}: PinPinTextAreaProps) {
  const [charsRemaining, setCharsRemaining] = useState<number>(300);

  function updateCounterThenPass(text: string) {
    setCharsRemaining(300 - text.length);

    if (onTextChange) onTextChange(text);
  }

  return (
    <View
      style={{
        width: textInputProps?.multiline ? 350 : 250,
        height: textInputProps?.multiline ? 200 : 40,
        alignSelf: "center",
        ...style,
      }}
    >
      <View>
        <View style={styles.shadow}></View>
        <TextInput
          placeholder="Textbox"
          placeholderTextColor={"grey"}
          {...textInputProps}
          style={styles.input}
          maxLength={300}
          textAlignVertical="top"
          onChangeText={updateCounterThenPass}
        ></TextInput>
      </View>

      {charsRemainingEnabled ? (
        <Text style={{ fontSize: 15, textAlign: "right" }}>
          {charsRemaining}
        </Text>
      ) : (
        <></>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
  },
  input: {
    backgroundColor: "white",
    position: "relative",
    flexDirection: "column",
    borderColor: "black",
    borderWidth: 1.5,
    width: "100%",
    height: "100%",
    padding: 10,
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
});
