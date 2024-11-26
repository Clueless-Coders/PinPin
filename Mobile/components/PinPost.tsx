import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons/faEllipsis";
import { faMessage } from "@fortawesome/free-solid-svg-icons/faMessage";
import { faImage } from "@fortawesome/free-solid-svg-icons/faImage";
import { faCaretUp } from "@fortawesome/free-solid-svg-icons/faCaretUp";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons/faCaretDown";

// shadow how???????!?!!!!??
// CaretUp looks like it needs to be brought down some
// pins will need to be pressable

export default function PinPost({ distance, time, text, comments, karma }: any) {
  return (
      <View style={styles.pinContainer}>
        <View style={styles.top}>
          <View style={styles.topLeft}>
            <Text style={styles.topText}>{distance}</Text>
            <Text style={styles.topText}>{time}</Text>
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
            <Text style={styles.bottomText}>{comments}</Text>
          </View>
          <View style={styles.topRight}>
            <FontAwesomeIcon icon={faCaretUp} />
            <Text style={styles.bottomText}>{karma}</Text>
            <FontAwesomeIcon icon={faCaretDown} />
          </View>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  pinContainer: {
    padding: 3,
    marginHorizontal: 20,
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
    //backgroundColor: "gray",
  },
  topLeft: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginHorizontal: 3,
    //backgroundColor: "orange",
  },
  topRight: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    //backgroundColor: "orange",
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
    //backgroundColor: "orange",
  },
  bottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    //backgroundColor: "gray",
  },
  bottomText: {
    marginVertical: 5,
    marginHorizontal: 1,
    fontSize: 12,
  },
});
