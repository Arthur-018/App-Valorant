import { StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { MenuCard } from "../components/MenuCard";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <MenuCard
          title="Agentes"
          onPress={() => router.push("/agents")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#791212",
    padding: 16,
  },
  content: {
    gap: 16,
    marginTop: 24,
  },
});