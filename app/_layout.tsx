// import { store } from '@/store';
import { store } from '../store';
// import { setAuth } from "@/store/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { setAuth } from "../store/authSlice";
// import { fontsToLoad } from "../assets/theme/fonts";
import { fontsToLoad } from "../assets/theme/fonts";
import "../global.css";

SplashScreen.preventAutoHideAsync();

const USERINFO_KEY = "userinfo";

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontsToLoad);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [initialRoute, setInitialRoute] = useState("(auth)");

  useEffect(() => {
    if (fontsLoaded || fontError) {
      (async () => {
        try {
          const existing = await AsyncStorage.getItem(USERINFO_KEY);
          if (existing) {
            const user = JSON.parse(existing);
            store.dispatch(setAuth({
              name: user.name,
              email: user.email,
              createdAt: user.createdAt,
            }));
            setInitialRoute("(main)");
          }
        } catch (e) {
          console.error("Error loading user from storage:", e);
        } finally {
          setIsLoadingAuth(false);
          SplashScreen.hideAsync();
        }
      })();
    }
  }, [fontsLoaded, fontError]);

  if (!(fontsLoaded || fontError) || isLoadingAuth) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }} initialRouteName={initialRoute}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(main)" options={{ headerShown: false }} />
      </Stack>
    </Provider>
   </GestureHandlerRootView>
  );
}