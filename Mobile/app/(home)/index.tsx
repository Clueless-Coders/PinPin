import { useCallback, useRef, useMemo } from "react";
import { StyleSheet, View, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import PinPost, { PinPostProps } from "@/components/PinPost";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons/faFilter";
import React from "react";
import { useState, useEffect } from "react";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { Link } from "expo-router";
import * as Location from "expo-location";

//Map, create pin, etc
export default function HomeIndex() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    }

    getCurrentLocation();
  }, []);

  let display_location = "Waiting...";
  if (errorMsg) {
    display_location = errorMsg;
  } else if (location) {
    display_location = JSON.stringify(location);
  }

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
      <Link href={"/(home)/Filters"}>Filters page</Link>
      <Link href={"/(home)/NewPin"}>New Pin page</Link>
      <Link href={"/(home)/Settings"}>Settings page</Link>
      <Link href={"/(home)/0"}> PinDetail page</Link>

      <Text>{JSON.stringify(location?.coords)}</Text>
      {/* must add divider bar, try placing after filter instead of in view*/}
      <MapView style={styles.map} provider={PROVIDER_GOOGLE} />

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

  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  paragraph: {
    fontSize: 18,
    textAlign: "center",
  },
});
