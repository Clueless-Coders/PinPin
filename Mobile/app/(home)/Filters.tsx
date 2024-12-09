import { API_BASE_URL } from "@/environment";
import axios from "axios";
import { Link } from "expo-router";
import React from "react";
import { useState } from "react";
import { Button, Text, StyleSheet, SafeAreaView } from "react-native";

export default function Filters() {
  const [data, setData] = useState<any>();
  async function test() {
    try {
      const res = await axios.get(`${API_BASE_URL}/user/me`);
      setData(res.data);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text>Hello!</Text>
      <Link href={"/(home)/Filters"}>Filters page</Link>
      <Link href={"/(home)/NewPin"}>New Pin page</Link>
      <Link href={"/(home)/Settings"}>Settings page</Link>
      <Link href={"/(home)/0"}> PinDetail page</Link>

      <Button onPress={test} title="bonk"></Button>
      {data ? <Text>{data.email}</Text> : undefined}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
