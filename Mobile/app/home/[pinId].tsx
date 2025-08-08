import React, { useContext, useEffect, useRef, useState } from "react";
import PinView, { PinPostProps } from "@/components/PinView";
import Comment from "@/components/Comment";
import {
  FlatList,
  GestureHandlerRootView,
  Pressable,
} from "react-native-gesture-handler";
import { TextInput, View, StyleSheet, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { IComment, IPin, PinService } from "@/services/PinService";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons/faPaperPlane";
import * as geolib from "geolib";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import * as Location from "expo-location";
import { LocationContext } from "./_layout";
import { metersToMilesConversionFactor } from ".";

const pinService = new PinService();
export default function PinDetail() {
  const { pinId } = useLocalSearchParams();
  const [pin, setPin] = useState<IPin | undefined>();
  const [comments, setComments] = useState<IComment[]>([]);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const locationContext = useContext(LocationContext);

  async function getComments() {
    try {
      const res = await pinService.getCommentsByPin(+pinId);
      setComments(res ?? []);
    } catch (e: any) {
      console.log(e);
    }
  }

  useEffect(() => {
    async function getPin() {
      try {
        const [res] = await Promise.all([await pinService.getPin(+pinId)]);
        setPin(res);
      } catch (e: any) {
        console.log(e);
      }
    }

    getPin();
    getComments();
  }, [pinId]);

  async function submit() {
    setIsSubmittingComment(true);
    try {
      const res = await pinService.createComment({
        pinID: +pinId,
        text: commentInput,
      });
      setIsSubmittingComment(false);
    } catch (e: any) {
      console.log(e);
    }
    await getComments();
  }

  const flatListRef = useRef<FlatList>(null);

  const renderItem = ({ item }: { item: IComment }) => {
    return (
      <Comment
        time={new Date(item.createdAt)}
        text={item.text}
        karma={item.upvotes - item.downvotes}
      />
    );
  };

  return (
    <GestureHandlerRootView>
      {pin ? (
        <PinView
          distance={
            locationContext?.location
              ? // Gets the distance between user's current location and
              // the pin's location, converted to miles then formatted
              // to 1 decimal place
              +(
                geolib.getDistance(locationContext.location.coords, {
                  latitude: pin.latitude,
                  longitude: pin.longitude,
                }) * metersToMilesConversionFactor
              ).toFixed(1)
              : -1
          }
          time={new Date(pin.createdAt)}
          text={pin.text}
          commentCount={comments.length}
          karma={pin.upvotes - pin.downvotes}
          userVoteStatus={0}
        />
      ) : (
        <></>
      )}
      <View
        style={{
          maxHeight: "74%",
          backgroundColor: "#FFF9ED",
        }}
      >

        {
          comments.length === 0 ? <Text>Be the first to leave a comment!</Text> :
            <FlatList
              data={comments}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
              ref={flatListRef}
              onScrollToIndexFailed={(info) => {
                console.log(info);
              }}
            />
        }

      </View>
      <View style={styles.textBoxContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Leave a comment..."
          onChangeText={(text) => setCommentInput(text)}
        />
        <Pressable
          style={styles.submitButton}
          onPress={submit}
          disabled={isSubmittingComment}
        >
          <FontAwesomeIcon icon={faPaperPlane} size={25} />
        </Pressable>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flatListContainer: {
    paddingBottom: 70,
  },
  textBoxContainer: {
    display: "flex",
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFC900",
    paddingHorizontal: 10,
    paddingVertical: 10,
    zIndex: 1,
    borderColor: "black",
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    fontFamily: "OverpassMono-Light",
    flex: 11,
    height: 40,
    backgroundColor: "#FFF9ED",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 15,
    marginLeft: 10,
  },
  submitButton: {
    flex: 1,
    margin: 10,
    marginBottom: 16,
  },
});
