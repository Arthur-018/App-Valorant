import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { BackButton } from "../components/BackButton";

export default function WeaponDetailScreen() {
  const { uuid, title, image } = useLocalSearchParams();

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

      <Pressable
        onPress={() =>
          router.push({
            pathname: "/weapon-skins",
            params: {
              uuid,
              title,
            },
          })
        }
        style={({ hovered, pressed }) => [
          styles.button,
          hovered && styles.buttonHover,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={styles.buttonText}>Ver skins</Text>
      </Pressable>
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
    height: 180,
    marginBottom: 20,
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 24,
  },
  button: {
    alignSelf: "center",
    backgroundColor: "#1f1f1f",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  buttonHover: {
    opacity: 0.85,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
