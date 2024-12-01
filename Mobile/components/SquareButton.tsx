import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export interface SquareButtonProps {
  size?: number;
  width?: number;
  height?: number;
  color?: string;
  icon?: IconDefinition;
  disabled?: boolean;
  onPress: () => void;
}

export default function SquareButton({
  size = 45,
  width,
  height,
  color = "#FFC900",
  icon,
  disabled = false,
  onPress,
}: SquareButtonProps) {
  const buttonWidth = width ?? size;
  const buttonHeight = height ?? size;
  const buttonColor = disabled ? "gray" : color;

  const handlePress = () => {
    if (!disabled) {
      onPress();
    }
  };

  return (
    <Pressable onPress={handlePress}>
      <View>
        <View
          style={[
            styles.shadow,
            {
              width: buttonWidth,
              height: buttonHeight,
            },
          ]}
        />
        <View
          style={[
            styles.buttonContainer,
            {
              width: buttonWidth,
              height: buttonHeight,
              backgroundColor: buttonColor,
            },
          ]}
        >
          {icon && (
            <FontAwesomeIcon
              icon={icon}
              size={buttonWidth * 0.55}
              color="black"
            />
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    position: "relative",
  },
  shadow: {
    backgroundColor: "black",
    marginLeft: 4,
    marginTop: 4,
    position: "absolute",
    width: "100%",
    height: "100%",
  },
});
