import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { router } from "expo-router";

export default function Index() {
  useEffect(() => {
    router.replace("/login");
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#791212" }}>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
}
