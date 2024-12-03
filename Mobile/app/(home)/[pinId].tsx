import React, { useRef } from "react";
import PinView, { PinPostProps } from "@/components/PinView";
import Comment from "@/components/Comment";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { TextInput, View, StyleSheet } from "react-native";

export default function PinDetail() {
  // const [allViewablePins, setAllViewablePins] = useState<VisiblePin[]>([]);

  // temporary data for testing
  const allViewablePins: PinPostProps[] = [
    { distance: 1, text: "First Comment", commentCount: 10, karma: 20 },
    { distance: 5, text: "Second Comment", commentCount: 5, karma: 15 },
    { distance: 10, text: "Thrd Comment", commentCount: 3, karma: 12 },
    { distance: 5, text: "Seond Comment", commentCount: 5, karma: 15 },
    { distance: 10, text: "hird Comment", commentCount: 3, karma: 12 },
  ];

  const flatListRef = useRef<FlatList>(null);

  const renderItem = ({ item }: { item: PinPostProps }) => (
    <Comment
      distance={item.distance}
      text={item.text}
      commentCount={item.commentCount}
      karma={item.karma}
    />
  );

  //to be used with the above? :3

  // async function getAllViewablePins() {
  //   const pins = await axios.get(`${API_BASE_URL}/pin/visible`);
  //   setAllViewablePins(pins.data);
  // }

  return (
    <GestureHandlerRootView>
      <PinView
        distance={0}
        text={
          "I am a pin hello shdisj shdkjas dhashd skhidhbsd dhbshdashdiasud sjdhsak dbskjf bsbf"
        }
        commentCount={0}
        karma={0}
      />

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
    backgroundColor: "orange", 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20, 
    paddingHorizontal: 10,
    paddingVertical: 10,
    zIndex: 1, 
  },
  textInput: {
    height: 40,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
});
