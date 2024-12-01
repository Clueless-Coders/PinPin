import React from "react";
import { View, StyleSheet } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Link, Route } from "expo-router";

export interface SquareButtonProps {
  size?: number;
  width?: number;
  height?: number;
  color?: string;
  icon?: any;
  route: string;
  disabled?: boolean;
}

export default function SquareButton({
  size = 45,
  width,
  height,
  color = "#FFC900",
  icon,
  route,
  disabled = false,
}: SquareButtonProps) {
  const buttonWidth = width ?? size;
  const buttonHeight = height ?? size;
  const buttonColor = disabled ? "gray" : color;

  return (
    <Link href={disabled ? "/" : (route as Route)}>
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
              icon={"face-smile-plus"}
              size={buttonWidth * 0.55}
              color="black"
            />
          )}
        </View>
      </View>
    </Link>
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
