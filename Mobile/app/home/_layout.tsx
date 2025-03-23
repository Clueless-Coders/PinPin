import React, { createContext, useEffect, useState } from "react";
import { Redirect, router, Stack } from "expo-router";
import Header from "@/components/Header";
import * as Location from "expo-location";
import { authService } from "../_layout";

export const LocationContext = createContext<{
  location: Location.LocationObject | undefined;
  setLocation: any;
} | null>(null);

export default function HomeLayout() {
  const [location, setLocation] = useState();
  const [loggedIn, setLoggedIn] = useState(true);

  useEffect(() => {
    const id = authService.addListener((user) => {
      if (!user) {
        console.log("going to login");
        router.navigate("/");
      }
    });

    return () => {
      authService.removeListener(id);
    };
  }, []);

  return (
    <LocationContext.Provider
      value={{
        location,
        setLocation,
      }}
    >
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="NewPin"
          options={{
            header: () => <Header color="#FFC900" />,
          }}
        />
        <Stack.Screen
          name="Settings"
          options={{
            header: () => <Header color="#FF6B6B" />,
          }}
        />
        <Stack.Screen
          name="[pinId]"
          options={{
            header: () => <Header color="#FFC900" />,
          }}
        />
      </Stack>
    </LocationContext.Provider>
  );
}
