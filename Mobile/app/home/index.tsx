import { useCallback, useRef, useMemo, createContext, useContext } from "react";
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
import Animated, { isSharedValue, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import * as geolib from "geolib";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LocationContext } from "./_layout";

export const metersToMilesConversionFactor = 0.000621371;

interface LocalImages {
  readablePin: number;
  unreadablePin: number;
}

export default function HomeIndex() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );

  const handlePinPress = () => {
    router.push("/home/NewPin");
  };

  const handleSettingsPress = () => {
    router.push("/home/Settings");
  };

  const bottomSheetSharedValue = useSharedValue(0)
  const locationContext = useContext(LocationContext);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pins, setPins] = useState<PinLocationRangeData | undefined>();
  const [images, setImages] = useState<LocalImages | undefined>();
  const [selectedPinIndex, setSelectedPinIndex] = useState<number>(0);
  const [allViewablePins, setAllViewablePins] = useState<VisiblePin[]>([]);

  const sheetRef = useRef<BottomSheet>(null);
  const mapRef = useRef<MapView>(null);
  const flatListRef = useRef<BottomSheetFlatListMethods>(null);

  // Asks backend for all viewable pins from this user
  async function getAllViewablePins() {
    const pins = await axios.get<VisiblePin[]>(`${API_BASE_URL}/pin/visible`);
    let data = pins.data;
    //console.log(location);
    if (location) {
      const distanceAdded = data.map((pin) => {
        // Add current distance data to pins provided
        const distanceInMiles =
          geolib.getDistance(location.coords, {
            latitude: pin.latitude,
            longitude: pin.longitude,
          }) * metersToMilesConversionFactor;
        return { ...pin, distanceInMiles };
      });

      // Sort the pins by current distance for most relevant pins
      // to be viewed first
      distanceAdded.sort(
        (pin, other) => pin.distanceInMiles - other.distanceInMiles
      );
      data = distanceAdded;
    }
    setAllViewablePins(data);
  }

  useEffect(() => {
    getAllViewablePins();
  }, [location]);

  // Asks user for location permissions then renders the map if enabled
  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let newLocation = await Location.getCurrentPositionAsync({});

      if (!newLocation) return;

      setLocation(newLocation);
      locationContext?.setLocation(newLocation);

      mapRef.current?.animateToRegion({
        latitude: newLocation.coords.latitude,
        longitude: newLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }

    getCurrentLocation();
    setImages({
      readablePin: require("@/assets/images/ReadablePin.png"),
      unreadablePin: require("@/assets/images/UnreadablePin.png"),
    });
  }, []);

  // Goes to the pin listed in the scroll list of the bottom sheet
  // when clicked on map
  useEffect(() => {
    if (selectedPinIndex < allViewablePins.length)
      flatListRef.current?.scrollToIndex({
        index: selectedPinIndex,
      });
  }, [selectedPinIndex]);

  const snapPoints = useMemo(() => ["10%", "70%"], []);

  // Renders each Pin card in the bottom sheet scroll view
  const renderItem = useCallback(
    ({ item, index }: { item: VisiblePin; index: number }) => {
      return (
        <View style={{ marginBottom: 15 }}>
          <PinPost
            distanceInMiles={item.distanceInMiles}
            time={new Date(Date.parse(item.createdAt)) ?? new Date()}
            text={item.text}
            commentCount={2}
            karma={item.upvotes - item.downvotes}
            isFocused={index === selectedPinIndex}
            pinId={item.id}
          />
        </View>
      );
    },
    [selectedPinIndex, allViewablePins]
  );

  // Gets all pins within the current viewable map area
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

      setPins(final.data);
    } catch (e: any) {
      console.log(e);
    }
  }

  // On any update of the location, tell the backend to mark
  // new pins visible based on the current location
  async function markNewVisiblePins() {
    const currLoc = await Location.getCurrentPositionAsync();

    locationContext?.setLocation(currLoc);
    const newlyVisible = await axios.post<VisiblePin[]>(
      `${API_BASE_URL}/pin/visible`,
      {
        latitude: currLoc.coords.latitude,
        longitude: currLoc.coords.longitude,
      }
    );
    if (newlyVisible.data.length !== 0) getAllViewablePins();

    setLocation(currLoc);
    console.log(location);
    await getAllViewablePins();
    console.log(location);
    await getCurrentBounds();
  }

  function handleMarkerClick(event: MarkerPressEvent) {
    // find pin based on location
    if (!allViewablePins) return;
    const pinIndex = allViewablePins.findIndex((pin) => {
      return (
        pin.latitude === event.nativeEvent.coordinate.latitude &&
        pin.longitude === event.nativeEvent.coordinate.longitude
      );
    });

    if (pinIndex > -1) sheetRef.current?.expand();
    setSelectedPinIndex(pinIndex === -1 ? selectedPinIndex : pinIndex);
  }

  // Show currently visible markers within the map rendering area
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

  const pinButtonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: bottomSheetSharedValue.get() - 60 }]
    }
  })

  return (
    <SafeAreaProvider style={{ position: "relative" }}>
      <GestureHandlerRootView style={styles.root}>
        <View style={styles.topRightButton}>
          <SquareButton
            onPress={handleSettingsPress}
            icon={"gear"}
            color="#FF6B6B"
          />
        </View>
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

        <Animated.View
          style={[
            styles.buttonContainer,
            pinButtonAnimatedStyle
          ]}
        >
          <SquareButton
            icon={"pin"}
            color={"#A7A6FF"}
            onPress={handlePinPress}
          />
        </Animated.View>

        <BottomSheet
          ref={sheetRef}
          snapPoints={snapPoints}
          enableDynamicSizing={false}
          enableHandlePanningGesture={true}
          enableOverDrag={false}
          backgroundStyle={{ backgroundColor: "#FFF9ED" }}
          animatedPosition={bottomSheetSharedValue}
          style={{
            backgroundColor: "#FFF9ED",
            borderRadius: 10,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 6,
            },
            shadowOpacity: 0.58,
            shadowRadius: 16.0,

            elevation: 24,
          }}
          handleIndicatorStyle={{ backgroundColor: "#000000" }}
        >
          <View style={styles.search}>
            <BottomSheetTextInput
              style={styles.input}
              placeholder="Search Pins"
            />
            <FontAwesomeIcon icon={faFilter} />
          </View>
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
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    right: 15,
  },
  topRightButton: {
    position: "absolute",
    top: 45,
    right: 15,
    zIndex: 1000,
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
    color: "black",
    width: 350,
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
