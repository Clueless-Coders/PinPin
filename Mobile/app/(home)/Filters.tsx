import React = require("react");
import { useCallback, useRef, useMemo } from "react";
import { StyleSheet, View, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import PinPost from "@/components/PinPost";

// TO DO
// Implement PinList component to scrollable flatlist
// Scrollable Pin List Component??
// Finish search bar + filter button
// Square Buttons Component
// Modal Customizations?
// make keyboard work good
// clean up code

//scrolling stuff isnt working so we might just have to lock the modal to 75% for now idk

export default function Filters() {
  // hooks
  const sheetRef = useRef<BottomSheet>(null);

  // variables
  const data = useMemo(
    () =>
      Array(20)
        .fill(0)
        .map((_, index) => `index-${index}`),
    []
  );
  const snapPoints = useMemo(() => ["15%", "75%", "100%"], []);

  // callbacks
  const handleSheetChange = useCallback((index: number) => {
    console.log("handleSheetChange", index);
  }, []);

  // const handleRefresh = useCallback(() => {   //idk if we're gonna need this in the future
  //   console.log("handleRefresh");
  // }, []);

  // render
  const renderItem = useCallback((something: any) => {
    return (
      <View style={styles.itemContainer}>
        <Text>{something.item}</Text>
      </View>
    );
  }, []);
  return (
    <GestureHandlerRootView style={styles.container}>
      <PinPost> </PinPost>

      <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        onChange={handleSheetChange}
        enableHandlePanningGesture={true}
        enableOverdrag={false}
        backgroundStyle={{ backgroundColor: "#FFF9ED" }}
        handleIndicatorStyle={{ backgroundColor: "#000000" }}
      >
        <BottomSheetTextInput style={styles.input} />
        <BottomSheetFlatList
          data={data}
          keyExtractor={(i) => i}
          renderItem={renderItem}
          contentContainerStyle={styles.contentContainer}
          // refreshing={false}
          // onRefresh={handleRefresh}
          nestedScrollEnabled={true} // Enable nested scrolling
          //keyboardShouldPersistTaps="handled" // Prevent taps from being blocked
        />
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 200,
  },
  contentContainer: {
    backgroundColor: "#FFF9ED",
  },
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: "#eee",
  },
  input: {
    alignSelf: "stretch",
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#000000",
    fontSize: 16,
    lineHeight: 20,
    padding: 5,
    color: "#FFF9ED",
  },
});
