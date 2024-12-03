import React from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faBell } from "@fortawesome/free-solid-svg-icons/faBell";
import { faShieldHalved } from "@fortawesome/free-solid-svg-icons/faShieldHalved";
import { faLock } from "@fortawesome/free-solid-svg-icons/faLock";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons/faArrowRightFromBracket";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons/faTrashCan";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons/faEnvelope";

export type SettingsIcon =
  | "bell"
  | "shield"
  | "lock"
  | "user"
  | "signOut"
  | "trash"
  | "envelope";

export interface SettingsProps {
  text: string;
  icon?: IconDefinition | SettingsIcon;
  onPress?: () => void;
}

const icons = {
  bell: faBell,
  shield: faShieldHalved,
  lock: faLock,
  user: faUser,
  signOut: faArrowRightFromBracket,
  trash: faTrashCan,
  envelope: faEnvelope,
};

export default function SettingsOptions({
  text,
  icon,
  onPress,
}: SettingsProps) {
  const resolvedIcon = typeof icon === "string" ? icons[icon] : icon;

  return (
    <Pressable onPress={onPress} style={styles.container}>
      {resolvedIcon && (
        <FontAwesomeIcon icon={resolvedIcon} size={24} style={styles.icon} />
      )}
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAEFDF",
    padding: 15,
    borderWidth: 1,
    borderColor: "black",
    marginHorizontal: 15,
  },
  icon: {
    marginRight: 10,
    color: "#000",
  },
  text: {
    fontSize: 16,
    color: "#000",
  },
});
