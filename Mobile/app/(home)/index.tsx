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
import { faGear } from "@fortawesome/free-solid-svg-icons/faGear";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { Link } from "expo-router";
import SquareButton from "@/components/SquareButton";

// TO DO
// Finish search bar + filter button styling
// Modal Customizations (shadow, divider line, sticky top)
// make keyboard work good
// clean up code
// the top component must be registered as viewing and change color

export default function HomeIndex() {
  const [data, setData] = useState<any>();
  async function test() {
    try {
      const res = await axios.get(`${API_BASE_URL}/user/me`);
      console.log(res.data);
      setData(res.data);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SquareButton icon={faGear} color={"#FF6B6B"} route={"/(home)/Filters"} />
      <SquareButton icon={faPlus} route={"/(home)/Filters"} />

      <Link href={"/(home)/Filters"}>Filters page</Link>
      <Link href={"/(home)/NewPin"}>New Pin page</Link>
      <Link href={"/(home)/Settings"}>Settings page</Link>
      <Link href={"/(home)/0"}> PinDetail page</Link>

      <Button onPress={test} title="bonk"></Button>
      {data ? <Text>{data.email}</Text> : undefined}
    </View>
  );
}
