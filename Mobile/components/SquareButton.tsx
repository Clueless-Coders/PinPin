import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faGear } from "@fortawesome/free-solid-svg-icons/faGear";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons/faLocationDot";

export type SquareButtonIcon = "gear" | "plus" | "pin";

export interface SquareButtonProps {
  size?: number;
  width?: number;
  height?: number;
  color?: string;
  icon?: IconDefinition | SquareButtonIcon;
  disabled?: boolean;
  style?: any
  onPress: () => void;
}

const icons = {
  gear: faGear,
  plus: faPlus,
  pin: faLocationDot,
};

export default function SquareButton({
  size = 45,
  width,
  height,
  color = "#FFC900",
  icon,
  disabled = false,
  onPress,
  style
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
    <Pressable onPress={handlePress} style={style}>
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
              icon={typeof icon === "string" ? icons[icon] : icon}
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
