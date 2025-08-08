import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons/faEllipsis";
import { faCaretUp } from "@fortawesome/free-solid-svg-icons/faCaretUp";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons/faCaretDown";

export interface PinPostProps {
  distance: number;
  time: Date;
  text: string;
  commentCount: number;
  karma: number;
  /**
   * 1: User previously upvoted this pin
   * 0: User has not interacted yet
   * -1: User previously downvoted this pin
   */
  userVoteStatus: number
}

/**
 * Renders a Pin's post at a larger scale for viewing more information, including
 * its associated images 
 */
export default function PinView({
  distance,
  time,
  text,
  commentCount,
  karma,
  userVoteStatus
}: PinPostProps) {
  const timeSincePassed = new Date(Date.now() - time.getTime());
  const hours = timeSincePassed.getUTCHours();
  const minutes = timeSincePassed.getUTCMinutes();
  const [voteStatus, setVoteStatus] = useState(-1)
  const voteIconSize = 27

  async function pressVote(isUpvote: true) {
  }

  return (
    <View>
      <View style={styles.pinContainer}>
        <View style={styles.top}>
          <View style={styles.topLeft}>
            <Text style={styles.topText}>{distance}mi</Text>
            <Text style={styles.topText}>
              {hours}h {minutes}m
            </Text>
          </View>
          <View style={styles.topRight}>
            <FontAwesomeIcon icon={faEllipsis} size={20} />
          </View>
        </View>
        <Text style={styles.text}>{text}</Text>
        <View style={styles.bottom}>
          <View style={styles.topLeft}>
            <Text style={styles.bottomText}>{`${commentCount}`} comment{commentCount !== 1 ? 's' : ''}</Text>
          </View>
          <View style={styles.topRight}>
            <Pressable onPressIn={() => pressVote(true)}>
              <FontAwesomeIcon
                icon={faCaretUp}
                color={voteStatus > 0 ? 'orange' : undefined}
                size={voteIconSize}
                style={{ marginTop: 5 }}
              />
            </Pressable>
            <Text style={styles.bottomText}>{karma}</Text>
            <FontAwesomeIcon
              icon={faCaretDown}
              color={voteStatus < 0 ? 'blue' : undefined}
              size={voteIconSize}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pinContainer: {
    padding: 3,
    flexDirection: "column",
    borderWidth: 1.5,
    borderColor: "black",
    backgroundColor: "#FFF9ED",
    position: "relative",
  },
  icon: {
    margin: 5,
  },
  top: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  topLeft: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginHorizontal: 3,
  },
  topRight: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginLeft: "auto",
    marginHorizontal: 3,
  },
  topText: {
    margin: 5,
    fontSize: 12,
    fontFamily: "OverpassMono-Light",
  },
  text: {
    marginLeft: 10,
    marginVertical: 10,
    padding: 1,
    fontSize: 20,
    fontFamily: "OverpassMono-Light",
  },
  bottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  bottomText: {
    marginVertical: 5,
    marginHorizontal: 1,
    fontSize: 15,
    fontFamily: "OverpassMono-Light",
  },
});
