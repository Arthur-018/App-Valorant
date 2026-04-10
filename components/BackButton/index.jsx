import { Pressable, StyleSheet, Text } from "react-native";
import { router } from "expo-router";

export function BackButton() {
  return (
    <Pressable
      onPress={() => router.back()}
      style={({ hovered, pressed }) => [
        styles.button,
        hovered && styles.hover,
        pressed && styles.pressed,
      ]}
    >
      <Text style={styles.text}>Voltar</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: "flex-start",
    backgroundColor: "#1f1f1f",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    marginBottom: 16,
  },
  hover: {
    opacity: 0.85,
  },
  pressed: {
    opacity: 0.7,
  },
  text: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
});
