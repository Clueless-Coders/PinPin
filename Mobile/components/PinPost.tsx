import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons/faEllipsis";
import { faMessage } from "@fortawesome/free-solid-svg-icons/faMessage";
import { faImage } from "@fortawesome/free-solid-svg-icons/faImage";
import { faCaretUp } from "@fortawesome/free-solid-svg-icons/faCaretUp";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons/faCaretDown";
import { router } from "expo-router";

export interface PinPostProps {
  distanceInMiles?: number;
  time: Date;
  text: string;
  commentCount: number;
  karma: number;
  pinId: number;
  isFocused?: boolean;
}

export default function PinPost({
  distanceInMiles,
  time,
  text,
  commentCount,
  karma,
  pinId,
  isFocused,
}: PinPostProps) {
  const timeSincePassed = new Date(Date.now() - time.getTime());
  const hours = timeSincePassed.getUTCHours();
  const minutes = timeSincePassed.getUTCMinutes();

  return (
    <Pressable onPress={() => router.push(`/home/${pinId}`)}>
      <View style={{ marginHorizontal: 10 }}>
        <View style={styles.shadow} />
        <View
          style={isFocused ? styles.pinContainerHighlight : styles.pinContainer}
        >
          <View style={styles.top}>
            <View style={styles.topLeft}>
              <Text style={styles.topText}>
                {distanceInMiles?.toFixed(1) ?? "Loading..."}mi
              </Text>
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
            <View style={styles.topLeft}>
              <FontAwesomeIcon icon={faImage} size={14} style={styles.icon} />
              <FontAwesomeIcon icon={faMessage} size={14} style={styles.icon} />
              <Text style={styles.bottomText}>{`${commentCount}`}</Text>
            </View>
            <View style={styles.topRight}>
              <FontAwesomeIcon icon={faCaretUp} />
              <Text style={styles.bottomText}>{karma}</Text>
              <FontAwesomeIcon icon={faCaretDown} />
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pinContainer: {
    padding: 3,
    flexDirection: "column",
    borderWidth: 1.5,
    borderColor: "black",
    backgroundColor: "#FAEFDF",
    position: "relative",
    fontFamily: "OverpassMono-Light",
  },
  pinContainerHighlight: {
    padding: 3,
    flexDirection: "column",
    borderWidth: 1.5,
    borderColor: "black",
    backgroundColor: "#FFC900",
    position: "relative",
    fontFamily: "OverpassMono-Light",
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
    fontFamily: "OverpassMono-Light",
  },
  text: {
    marginLeft: 10,
    marginBottom: 5,
    padding: 1,
    fontSize: 16,
    fontFamily: "OverpassMono-Light",
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
  shadow: {
    backgroundColor: "black",
    marginLeft: 4,
    marginTop: 4,
    position: "absolute",
    width: "100%",
    height: "100%",
  },
});
