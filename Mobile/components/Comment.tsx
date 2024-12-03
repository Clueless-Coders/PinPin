import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons/faEllipsis";
import { faCaretUp } from "@fortawesome/free-solid-svg-icons/faCaretUp";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons/faCaretDown";

export interface PinPostProps {
  time: Date;
  text: string;
  karma: number;
}

export default function Comment({ time, text, karma }: PinPostProps) {
  const timeSincePassed = new Date(Date.now() - time.getTime());
  console.log(timeSincePassed);
  const hours = timeSincePassed.getUTCHours();
  const minutes = timeSincePassed.getUTCMinutes();

  return (
    <View>
      <View style={styles.pinContainer}>
        <View style={styles.top}>
          <View style={styles.topLeft}>
            <Text style={styles.topText}>
              {hours}h {minutes}m
            </Text>
          </View>
          <View style={styles.topRight}>
            <FontAwesomeIcon icon={faEllipsis} size={20} />
          </View>
        </View>

        <Text style={styles.text}>{text}</Text>

        <View style={styles.bottom}>
          <View style={styles.topRight}>
            <FontAwesomeIcon icon={faCaretUp} />
            <Text style={styles.bottomText}>{karma}</Text>
            <FontAwesomeIcon icon={faCaretDown} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pinContainer: {
    padding: 3,
    flexDirection: "column",
    borderWidth: 1.5,
    borderColor: "black",
    backgroundColor: "#FAEFDF",
  },
  icon: {
    margin: 5,
  },
  top: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  topLeft: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginHorizontal: 3,
  },
  topRight: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginLeft: "auto",
    marginHorizontal: 3,
  },
  topText: {
    margin: 5,
    fontSize: 12,
  },
  text: {
    marginLeft: 10,
    marginBottom: 5,
    padding: 1,
    fontSize: 16,
  },
  bottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  bottomText: {
    marginVertical: 5,
    marginHorizontal: 1,
    fontSize: 12,
  },
});
