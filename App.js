import { NavigationContainer } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { StatusBar, StyleSheet, Text, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import MainTabNav from "./src/navigations/MainTabNav";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoggedInNav from "./src/navigations/LoggedInNav";
import { Asset } from "expo-asset";
import assetStore from "./src/stores/assetStore";
import { Emotions, RoundEmotions } from "./src/Config";
import { Observer } from "mobx-react-lite";
import authStore from "./src/stores/AuthStore";
import LoggedOutNav from "./src/navigations/LoggedOutNav";
import jwtDecode from "jwt-decode";
import * as SecureStore from "expo-secure-store";
import { ACCESS_TOKEN } from "./src/Strings";

SplashScreen.preventAutoHideAsync();

export default function App() {
  // react-query client
  const client = new QueryClient();

  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        const roundEmos = await Asset.loadAsync(RoundEmotions);
        assetStore.setEmotionsRound({
          happy: roundEmos[0]?.localUri,
          passion: roundEmos[1]?.localUri,
          comfort: roundEmos[2]?.localUri,
          tired: roundEmos[3]?.localUri,
          sharp: roundEmos[4]?.localUri,
          sad: roundEmos[5]?.localUri,
          null: roundEmos[6]?.localUri,
        });

        const background = await Asset.loadAsync(Emotions);
        assetStore.setMessageEmotions({
          happy: background[0]?.localUri,
          passion: background[1]?.localUri,
          comfort: background[2]?.localUri,
          tired: background[3]?.localUri,
          sharp: background[4]?.localUri,
          sad: background[5]?.localUri,
          noMessage: background[6]?.localUri,
        });

        // Fonts
        await Font.loadAsync({
          "kangwon-font": require("./assets/fonts/kangwon.ttf"),
          "nanum-regular": require("./assets/fonts/NanumSquareNeo-Regular.ttf"),
          "nanum-bold": require("./assets/fonts/NanumSquareNeo-Bold.ttf"),
        });

        // get Token
        let accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN);

        // refresh access token
        if (accessToken && !authStore.isTokenRefreshing) {
          // 단위: seconds (초)
          const accessTokenExpires = (await jwtDecode(accessToken)).exp;
          const now = parseInt(new Date().getTime() / 1000);
          // 5분 이내 token expires
          if (now + 300 > accessTokenExpires) {
            // if (now + 300 > accessTokenExpires) {
            accessToken = await authStore.refreshAccessToken();
          }
        }

        if (accessToken) {
          authStore.loginAction({ accessToken });
        }
      } catch (e) {
        console.warn(e);
      } finally {
        // tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <Observer>
      {() => (
        <QueryClientProvider client={client}>
          <StatusBar barStyle="dark-content" backgroundColor="white" />
          <SafeAreaProvider>
            <NavigationContainer onReady={onLayoutRootView}>
              {authStore.isLoggedIn ? <LoggedInNav /> : <LoggedOutNav />}
            </NavigationContainer>
          </SafeAreaProvider>
        </QueryClientProvider>
      )}
    </Observer>
  );
}
