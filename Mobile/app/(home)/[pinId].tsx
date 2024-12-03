import React, { useRef } from "react";
import PinView, { PinPostProps } from "@/components/PinView";
import Comment from "@/components/Comment";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { TextInput, View, StyleSheet } from "react-native";

export default function PinDetail() {
  // const [allViewablePins, setAllViewablePins] = useState<VisiblePin[]>([]);

  // temporary data for testing
  const allViewablePins: PinPostProps[] = [
    {
      time: new Date(2024, 11, 1),
      distance: 1,
      text: "First Comment",
      commentCount: 10,
      karma: 20,
    },
    {
      time: new Date(2024, 11, 2),
      distance: 5,
      text: "Second Comment",
      commentCount: 5,
      karma: 15,
    },
    {
      time: new Date(2024, 11, 3),
      distance: 10,
      text: "Third Comment",
      commentCount: 3,
      karma: 12,
    },
    {
      time: new Date(2024, 11, 4),
      distance: 3,
      text: "Fourth Comment",
      commentCount: 5,
      karma: 15,
    },
    {
      time: new Date(2024, 11, 5),
      distance: 7,
      text: "Fifth Comment",
      commentCount: 3,
      karma: 12,
    },
    {
      time: new Date(2024, 11, 6),
      distance: 2,
      text: "Sixth Comment",
      commentCount: 8,
      karma: 18,
    },
    {
      time: new Date(2024, 11, 7),
      distance: 4,
      text: "Seventh Comment",
      commentCount: 2,
      karma: 10,
    },
    {
      time: new Date(2024, 11, 8),
      distance: 12,
      text: "Eighth Comment",
      commentCount: 6,
      karma: 25,
    },
    {
      time: new Date(2024, 11, 9),
      distance: 8,
      text: "Ninth Comment",
      commentCount: 4,
      karma: 13,
    },
    {
      time: new Date(2024, 11, 10),
      distance: 9,
      text: "Tenth Comment",
      commentCount: 7,
      karma: 17,
    },
    {
      time: new Date(2024, 11, 11),
      distance: 6,
      text: "Eleventh Comment",
      commentCount: 9,
      karma: 22,
    },
    {
      time: new Date(2024, 11, 12),
      distance: 15,
      text: "Twelfth Comment",
      commentCount: 11,
      karma: 30,
    },
    {
      time: new Date(2024, 11, 13),
      distance: 20,
      text: "Thirteenth Comment",
      commentCount: 13,
      karma: 35,
    },
    {
      time: new Date(2024, 11, 14),
      distance: 25,
      text: "Fourteenth Comment",
      commentCount: 14,
      karma: 40,
    },
  ];

  const flatListRef = useRef<FlatList>(null);

  const renderItem = ({ item }: { item: PinPostProps }) => (
    <Comment time={item.time} text={item.text} karma={item.karma} />
  );

  //to be used with the above? :3

  // async function getAllViewablePins() {
  //   const pins = await axios.get(`${API_BASE_URL}/pin/visible`);
  //   setAllViewablePins(pins.data);
  // }

  return (
    <GestureHandlerRootView>
      {/* <PinView/> // render in nearby pins from database*/}

      <FlatList
        data={allViewablePins}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ref={flatListRef}
        onScrollToIndexFailed={(info) => {
          console.log(info);
        }}
      />
      <View style={styles.textBoxContainer}>
        <TextInput style={styles.textInput} placeholder="Leave a comment..." />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flatListContainer: {
    paddingBottom: 70,
  },
  textBoxContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFF9ED",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    zIndex: 1,
    borderColor: "black",
    borderWidth: 1.5,
    borderRadius: 5,
  },
  textInput: {
    height: 40,
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 15,
  },
});
