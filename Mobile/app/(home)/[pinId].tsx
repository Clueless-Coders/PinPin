import React, { useRef } from "react";
import PinView, { PinPostProps } from "@/components/PinView";
import Comment from "@/components/Comment";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";

export default function PinDetail() {
  // const [allViewablePins, setAllViewablePins] = useState<VisiblePin[]>([]);

  // temporary data for testing
  const allViewablePins: PinPostProps[] = [
    { distance: 1, text: "First Comment", commentCount: 10, karma: 20 },
    { distance: 5, text: "Second Comment", commentCount: 5, karma: 15 },
    { distance: 10, text: "Third Comment", commentCount: 3, karma: 12 },
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
        keyExtractor={(index) => index.toString()}
        renderItem={renderItem}
        ref={flatListRef}
        onScrollToIndexFailed={(info) => {
          console.log(info);
        }}
      ></FlatList>
    </GestureHandlerRootView>
  );
}
