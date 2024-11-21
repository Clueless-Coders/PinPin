import React = require("react");
import { View, Text, StyleSheet } from "react-native";
import FontAwesome6 from "@react-native-vector-icons/fontawesome6";
import { faUser } from "@fortawesome/free-solid-svg-icons";

//TODO
//figure out icons??
//shadow???
//actaully populate the component with real data

export default function PinPost() {

  return (
    <View style={styles.pinContainer}>
      <View style={styles.top}>
        <Text style={styles.topText}>15mi</Text>
        <Text style={styles.topText}>32s</Text>
      </View>

      <Text style={styles.text}> Why is this so difficult</Text>

      <View style={styles.bottom}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  pinContainer: {
    padding: 10,
    marginHorizontal: 20,
    flexDirection: "column",
    backgroundColor: "yellow",
  },
  top: {
    flexDirection: "row",
    backgroundColor: "blue",
  },
  topText: {
    margin: 5,
  },
  icon: {
    marginLeft: 10,
  },
  text: {
    marginLeft: 10,
  },
  bottom: {},
});
