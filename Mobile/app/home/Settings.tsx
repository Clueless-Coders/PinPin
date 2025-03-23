import SettingsOptions from "@/components/SettingsOptions";
import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { authService } from "../_layout";

export default function Settings() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topSection}>
        <SettingsOptions text="Notifications" icon="bell" />
        <SettingsOptions text="Password and Email" icon="shield" />
        <SettingsOptions text="Privacy Policy" icon="lock" />
        <SettingsOptions text="Support" icon="user" />
        <SettingsOptions
          text="Sign Out"
          icon="signOut"
          onPress={() => {
            authService.logout();
          }}
        />
        <SettingsOptions text="Contact Us" icon="envelope" />
      </View>

      <View style={styles.bottomSection}>
        <SettingsOptions
          text="Delete Account"
          icon="trash"
          onPress={() => alert("Delete Account")}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF9ED",
    padding: 10,
    marginTop: 20,
  },
  topSection: {
    flex: 1,
  },
  bottomSection: {
    justifyContent: "flex-end",
    marginTop: 10,
    marginBottom: 20,
  },
});
