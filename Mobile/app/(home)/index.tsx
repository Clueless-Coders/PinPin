import { API_BASE_URL } from "@/environment";
import axios from "axios";
import { Link } from "expo-router";
import { useState } from "react";
import { Button, Text, View } from "react-native";

//Map, create pin, etc
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
    <View>
      <Text>Hello!</Text>
      <Link href={"/(home)/Filters"}>Filters page</Link>
      <Link href={"/(home)/NewPin"}>New Pin page</Link>
      <Link href={"/(home)/Settings"}>Settings page</Link>
      <Link href={"/(home)/0"}> PinDetail page</Link>

      <Button onPress={test} title="bonk"></Button>
      {data ? <Text>{data.email}</Text> : undefined}
    </View>
  );
}
