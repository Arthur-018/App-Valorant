import { Image, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { BackButton } from "../components/BackButton";

export default function AgentDetailScreen() {
  const { title, image, description, role } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <BackButton />

      {!!image && (
        <Image
          source={{ uri: image }}
          style={styles.image}
          resizeMode="contain"
        />
      )}

      <Text style={styles.title}>{title}</Text>

      {!!role && <Text style={styles.role}>{role}</Text>}

      {!!description && (
        <Text style={styles.description}>{description}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#791212",
    padding: 20,
  },
  image: {
    width: "100%",
    height: 280,
    marginBottom: 20,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  role: {
    color: "#ffd6d6",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "600",
  },
  description: {
    color: "#fff",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
  },
});
