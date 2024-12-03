import React, { useEffect, useRef, useState } from "react";
import PinView, { PinPostProps } from "@/components/PinView";
import Comment from "@/components/Comment";
import {
  FlatList,
  GestureHandlerRootView,
  Pressable,
} from "react-native-gesture-handler";
import { TextInput, View, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { IComment, IPin, PinService } from "@/services/PinService";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons/faPaperPlane";
import * as geolib from "geolib";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import * as Location from "expo-location";

const pinService = new PinService();
export default function PinDetail() {
  const { pinId } = useLocalSearchParams();
  const [pin, setPin] = useState<IPin | undefined>();
  const [comments, setComments] = useState<IComment[]>([]);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [currLoc, setCurrLoc] = useState<Location.LocationObject | undefined>();

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
        const [res, location] = await Promise.all([
          await pinService.getPin(+pinId),
          await Location.getCurrentPositionAsync({}),
        ]);
        setCurrLoc(location);
        setPin(res);
      } catch (e: any) {
        console.log(e);
      }
    }

    getPin();
    getComments();
  }, [pinId]);

  useEffect(() => {
    let cancel = false;
    async function submit() {
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
    submit();
    return () => {
      cancel = true;
    };
  }, [isSubmittingComment]);

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
            currLoc
              ? +(
                  geolib.getDistance(currLoc.coords, {
                    latitude: pin.latitude,
                    longitude: pin.longitude,
                  }) * 0.000621371
                ).toFixed(1)
              : -1
          }
          time={new Date(pin.createdAt)}
          text={pin.text}
          commentCount={comments.length}
          karma={pin.upvotes - pin.downvotes}
        />
      ) : (
        <></>
      )}

      <FlatList
        data={comments}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ref={flatListRef}
        onScrollToIndexFailed={(info) => {
          console.log(info);
        }}
        style={{
          maxHeight: "74%",
          backgroundColor: "#FFF9ED",
        }}
      />
      <View style={styles.textBoxContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Leave a comment..."
          onChangeText={(text) => setCommentInput(text)}
        />
        <Pressable
          style={styles.submitButton}
          onPress={() => setIsSubmittingComment(true)}
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
