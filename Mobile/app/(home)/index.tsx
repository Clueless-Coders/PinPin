import { useCallback, useRef, useMemo } from "react";
import { StyleSheet, View, Text, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetFlatListMethods,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import PinPost from "@/components/PinPost";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons/faFilter";
import React from "react";
import { useState, useEffect } from "react";
import MapView, { Callout, Marker, MarkerPressEvent } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import { API_BASE_URL } from "@/environment";
import {
  InvisiblePin,
  PinLocationRangeData,
  VisiblePin,
} from "@/interfaces/pin.interface";
import SquareButton from "@/components/SquareButton";
import { router } from "expo-router";

interface LocalImages {
  readablePin: number;
  unreadablePin: number;
}

//Map, create pin, etc
export default function HomeIndex() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );

  const handleButtonPress = () => {
    router.push("/NewPin");
  };

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pins, setPins] = useState<PinLocationRangeData | undefined>();
  const [images, setImages] = useState<LocalImages | undefined>();
  const [selectedPinIndex, setSelectedPinIndex] = useState<number>(0);
  const [allViewablePins, setAllViewablePins] = useState<VisiblePin[]>([]);

  const sheetRef = useRef<BottomSheet>(null);
  const mapRef = useRef<MapView>(null);
  const flatListRef = useRef<BottomSheetFlatListMethods>(null);

  async function getAllViewablePins() {
    const pins = await axios.get(`${API_BASE_URL}/pin/visible`);
    setAllViewablePins(pins.data);
  }

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
      mapRef.current?.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }

    getAllViewablePins();
    setImages({
      readablePin: require("@/assets/images/ReadablePin.png"),
      unreadablePin: require("@/assets/images/UnreadablePin.png"),
    });
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (selectedPinIndex < allViewablePins.length)
      flatListRef.current?.scrollToIndex({
        index: selectedPinIndex,
      });
  }, [selectedPinIndex]);

  // removed 100% snap point while nested scrolling doesnt work
  const snapPoints = useMemo(() => ["12%", "75%"], []);

  const renderItem = useCallback(
    ({ item, index }: { item: VisiblePin; index: number }) => {
      return (
        <View style={{ marginBottom: 15 }}>
          <PinPost
            distance={10}
            time={new Date(Date.parse(item.createdAt)) ?? new Date()}
            text={item.text}
            commentCount={2}
            karma={item.upvotes - item.downvotes}
            isFocused={index === selectedPinIndex}
          />
        </View>
      );
    },
    [selectedPinIndex]
  );

  async function getCurrentBounds() {
    const bounds = await mapRef.current?.getMapBoundaries();

    if (!bounds) return;
    try {
      const final = await axios.post<PinLocationRangeData>(
        `${API_BASE_URL}/pin/location`,
        {
          neLat: bounds.northEast.latitude,
          neLong: bounds.northEast.longitude,
          swLat: bounds.southWest.latitude,
          swLong: bounds.southWest.longitude,
        }
      );

      console.log(final.data);
      setPins(final.data);
    } catch (e: any) {
      console.log(e);
    }
  }

  async function markNewVisiblePins() {
    const currLoc = await Location.getCurrentPositionAsync();

    const newlyVisible = await axios.post<VisiblePin[]>(
      `${API_BASE_URL}/pin/visible`,
      {
        latitude: currLoc.coords.latitude,
        longitude: currLoc.coords.longitude,
      }
    );
    if (newlyVisible.data.length !== 0) getAllViewablePins();

    setLocation(currLoc);
    await getCurrentBounds();
  }

  function handleMarkerClick(event: MarkerPressEvent) {
    // find pin based on location
    if (!pins) return;
    const pinIndex = allViewablePins.findIndex((pin) => {
      return (
        pin.latitude === event.nativeEvent.coordinate.latitude &&
        pin.longitude === event.nativeEvent.coordinate.longitude
      );
    });

    setSelectedPinIndex(pinIndex === -1 ? selectedPinIndex : pinIndex);
  }

  function renderMarker(pin: VisiblePin | InvisiblePin) {
    return (
      <Marker
        coordinate={{ latitude: pin.latitude, longitude: pin.longitude }}
        key={`${pin.id}`}
        id={`${pin.id}`}
        image={pin.viewable ? images?.readablePin : images?.unreadablePin}
        onPress={handleMarkerClick}
      >
        {pin.viewable ? (
          <></>
        ) : (
          <Callout>
            <Text>Travel to this location to view what this pin says!</Text>
          </Callout>
        )}
      </Marker>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <MapView
        style={styles.map}
        ref={mapRef}
        onRegionChangeComplete={getCurrentBounds}
        showsUserLocation={true}
        onUserLocationChange={markNewVisiblePins}
        mapType={Platform.OS === "ios" ? "mutedStandard" : "terrain"}
        showsMyLocationButton={false}
        pitchEnabled={false}
      >
        {pins?.invisible.map(renderMarker) ?? <></>}
        {pins?.visible.map(renderMarker) ?? <></>}
      </MapView>

      <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        enableHandlePanningGesture={true}
        enableOverDrag={false}
        backgroundStyle={{ backgroundColor: "#FFF9ED" }}
        handleIndicatorStyle={{ backgroundColor: "#000000" }}
      >
        <View style={styles.search}>
          <BottomSheetTextInput style={styles.input} />
          <FontAwesomeIcon icon={faFilter} />
        </View>

        <SquareButton icon={"gear"} onPress={handleButtonPress} />

        <BottomSheetFlatList
          data={allViewablePins}
          keyExtractor={(item) => item.id + ""}
          renderItem={renderItem}
          contentContainerStyle={styles.flatlist}
          ref={flatListRef}
          onScrollToIndexFailed={(info) => {
            console.log(info);
          }}
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
