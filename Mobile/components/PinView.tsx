import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons/faEllipsis";
import { faCaretUp } from "@fortawesome/free-solid-svg-icons/faCaretUp";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons/faCaretDown";

export interface PinPostProps {
  distance: number;
  time: Date;
  text: string;
  commentCount: number;
  karma: number;
}

export default function PinView({
  distance,
  time,
  text,
  commentCount,
  karma,
}: PinPostProps) {
  const timeSincePassed = new Date(Date.now() - time.getTime());
  const hours = timeSincePassed.getUTCHours();
  const minutes = timeSincePassed.getUTCMinutes();
  const seconds = timeSincePassed.getUTCSeconds();

  return (
    <View>
      <View style={styles.pinContainer}>
        <View style={styles.top}>
          <View style={styles.topLeft}>
            <Text style={styles.topText}>{distance}mi</Text>
            <Text style={styles.topText}>
              {hours}h {minutes}m {seconds}s
            </Text>
          </View>
          <View style={styles.topRight}>
            <FontAwesomeIcon icon={faEllipsis} size={20} />
          </View>
        </View>

        <Text style={styles.text}>{text}</Text>

        <View style={styles.bottom}>
          <View style={styles.topLeft}>
            <Text style={styles.bottomText}>{`${commentCount}`} comments</Text>
          </View>
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
    backgroundColor: "#FFF9ED",
    position: "relative",
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
    marginVertical: 10,
    padding: 1,
    fontSize: 20,
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
