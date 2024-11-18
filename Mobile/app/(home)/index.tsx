import { Link } from "expo-router";
import { Text, View } from "react-native";

//Map, create pin, etc
export default function HomeIndex() {
  return (
    <View>
      <Text>Hello!</Text>
      <Link href={"/(home)/Filters"}>Filters page</Link>
      <Link href={"/(home)/NewPin"}>New Pin page</Link>
      <Link href={"/(home)/Settings"}>Settings page</Link>
      <Link href={"/(home)/0"}> PinDetail page</Link>
    </View>
  );
}
