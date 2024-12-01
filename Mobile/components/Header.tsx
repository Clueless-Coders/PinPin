import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons/faChevronLeft";
import { useRouter } from "expo-router";

interface HeaderProps {
  color?: string;
}

export default function Header({ color = "#FFC900" }: HeaderProps) {
  const router = useRouter();
  const handlePress = () => {
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <View style={styles.innerContainer}>
        <Pressable onPress={handlePress}>
          <FontAwesomeIcon
            icon={faChevronLeft}
            size={25}
            color="black"
            style={styles.icon}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: "black",
    justifyContent: "flex-end",
    padding: 5,
    zIndex: 1000,
    borderBottomWidth: 1.5,
    borderColor: "black",
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-start",
  },
  icon: {
    padding: 10,
    marginVertical: 5,
  },
});
