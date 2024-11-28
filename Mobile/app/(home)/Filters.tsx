import { useCallback, useRef, useMemo } from "react";
import { StyleSheet, View, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import PinPost, { PinPostProps } from "@/components/PinPost";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons/faFilter";

// TO DO
// Finish search bar + filter button styling
// Square Buttons Component
// Modal Customizations (shadow, divider line, sticky top)
// make keyboard work good
// clean up code
// the top component must be registered as viewing and change color

export default function Filters() {
  const sheetRef = useRef<BottomSheet>(null);

  // testing pin content rendering, need to connect to backend eek
  const data = useMemo(
    () =>
      Array(25)
        .fill(0)
        .map((_, index): PinPostProps & { id: string } => ({
          isFocused: index === 0,
          id: `index-${index}`,
          distance: index + 1,
          time: new Date(Date.now() - 30000),
          text: `test pin index ${index} asldkfjasdkl;jasdkljdflk;asjfl;adjfkl;asdjfklasdfjasdfjasdklfjasjklasdfjasdkl;jasdjajasdjasdfjasdl;fjasdkfjasdfjasd`,
          commentCount: index + 3,
          karma: index + 4,
        })),
    []
  );
  // removed 100% snap point while nested scrolling doesnt work
  const snapPoints = useMemo(() => ["12%", "75%"], []);

  const handleSheetChange = useCallback((index: number) => {
    console.log("handleSheetChange", index);
  }, []);

  // idk if we're gonna need this in the future
  // const handleRefresh = useCallback(() => {
  //   console.log("handleRefresh");
  // }, []);

  const renderItem = useCallback(({ item }: { item: PinPostProps }) => {
    return (
      <View style={{ marginBottom: 15 }}>
        <PinPost
          distance={item.distance}
          time={item.time}
          text={item.text}
          commentCount={item.commentCount}
          karma={item.karma}
          isFocused={item.isFocused}
        />
      </View>
    );
  }, []);
  return (
    <GestureHandlerRootView style={styles.root}>
      <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        onChange={handleSheetChange}
        enableHandlePanningGesture={true}
        enableOverDrag={false}
        backgroundStyle={{ backgroundColor: "#FFF9ED" }}
        handleIndicatorStyle={{ backgroundColor: "#000000" }}
      >
        <View style={styles.search}>
          <BottomSheetTextInput style={styles.input} />
          <FontAwesomeIcon icon={faFilter} />
          {/* must add divider bar, try placing after filter instead of in view*/}
        </View>

        <BottomSheetFlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.flatlist}
          // refreshing={false}
          // onRefresh={handleRefresh}
          // nestedScrollEnabled={true}  // should enable nested scrolling but it doesnt work :(
          // keyboardShouldPersistTaps="handled"  // why are taps still being blocked :(
        />
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: 200,
  },
  flatlist: {
    backgroundColor: "#FFF9ED",
    marginVertical: 10,
  },
  input: {
    marginHorizontal: 10,
    marginTop: 8,
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#000000",
    fontSize: 16,
    lineHeight: 20,
    padding: 5,
    color: "#FFF9ED",
    width: 350, //not sure why this is stretching beyond the screen, must fix to be dynamic
  },
  search: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
