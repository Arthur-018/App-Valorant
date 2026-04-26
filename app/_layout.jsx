import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#0F1923" },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="home" />
        <Stack.Screen name="agents" />
        <Stack.Screen name="agent-detail" />
        <Stack.Screen name="weapons" />
        <Stack.Screen name="weapon-detail" />
        <Stack.Screen name="weapon-skins" />
        <Stack.Screen name="maps" />
        <Stack.Screen name="banners" />
        <Stack.Screen name="sprays" />
        <Stack.Screen name="titles" />
        <Stack.Screen name="seasons" />
        <Stack.Screen name="season-detail" />
        <Stack.Screen name="act-detail" />
        <Stack.Screen name="leaderboard" />
        <Stack.Screen name="version" />
        <Stack.Screen name="competitive-tiers" />
        <Stack.Screen name="bundles" />
        <Stack.Screen name="gamemodes" />
        <Stack.Screen name="events" />
        <Stack.Screen name="currencies" />
        <Stack.Screen name="profile" />
      </Stack>
    </SafeAreaProvider>
  );
}
