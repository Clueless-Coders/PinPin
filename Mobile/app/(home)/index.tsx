import { useCallback, useRef, useMemo } from "react";
import { StyleSheet, View, Text } from "react-native";
import {
  GestureHandlerRootView,
  Pressable,
} from "react-native-gesture-handler";
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import PinPost, { PinPostProps } from "@/components/PinPost";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons/faFilter";
import { faGear } from "@fortawesome/free-solid-svg-icons/faGear";
import React from "react";
import { useState, useEffect } from "react";
import MapView, { Details, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import axios from "axios";
import { API_BASE_URL } from "@/environment";
import { PinLocationRangeData, VisiblePin } from "@/interfaces/pin.interface";
import SquareButton from "@/components/SquareButton";

//Map, create pin, etc
export default function HomeIndex() {
  const router = useRouter();
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );

  const handleButtonPress = () => {
    console.log("button button button");
    router.push("/(home)/Filters");
  };

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pins, setPins] = useState<VisiblePin[] | undefined>();

  //Setup Maps
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
  const mapRef = useRef<MapView>(null);

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

  const renderItem = useCallback(({ item }: { item: VisiblePin }) => {
    return (
      <View style={{ marginBottom: 15 }}>
        <PinPost
          distance={10}
          time={new Date(Date.parse(item.createdAt)) ?? new Date()}
          text={item.text}
          commentCount={2}
          karma={item.upvotes - item.downvotes}
          isFocused={item.viewable}
        />
      </View>
    );
  }, []);

  async function getCurrentBounds(region: Region, details: Details) {
    const bounds = await mapRef.current?.getMapBoundaries();
    console.log(bounds);
    console.log(location?.coords);

    if (!bounds) return;
    try {
      const newlyVisible = await axios.post(`${API_BASE_URL}/pin/visible`, {
        latitude: location?.coords.latitude,
        longitude: location?.coords.longitude,
      });

      const final = await axios.post<PinLocationRangeData>(
        `${API_BASE_URL}/pin/location`,
        {
          neLat: bounds.northEast.latitude,
          neLong: bounds.northEast.longitude,
          swLat: bounds.southWest.latitude,
          swLong: bounds.southWest.longitude,
        }
      );

      //console.log(newlyVisible.data);
      console.log(final.data);
      setPins(final.data.visible);
    } catch (e: any) {
      console.log(e);
    }
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      {/* <Pressable onPress={() => router.replace("/")}>
        <Text>Go to login.</Text>
      </Pressable>
      <Link href={"/(home)/Filters"}>Filters page</Link>
      <Link href={"/(home)/NewPin"}>New Pin page</Link>
      <Link href={"/(home)/Settings"}>Settings page</Link>
      <Link href={"/(home)/0"}> PinDetail page</Link>

      <Text>{JSON.stringify(location?.coords)}</Text>
 */}
      <MapView
        style={styles.map}
        ref={mapRef}
        onRegionChangeComplete={getCurrentBounds}
        showsUserLocation={true}
      />

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

        <SquareButton
          icon={faGear}
          onPress={handleButtonPress}
          // disabled={true}
          // navigateTo={"/(home)/Filters"}
        />

        <BottomSheetFlatList
          data={pins}
          keyExtractor={(item) => item.id + ""}
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
    //paddingTop: 200,
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
